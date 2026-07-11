'use server'

import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function markLessonComplete(formData: FormData) {
  const session = await verifySession()
  const lessonId = formData.get('lessonId') as string
  const courseSlug = formData.get('courseSlug') as string
  const nextHref = formData.get('nextHref') as string

  if (!lessonId || !courseSlug) return

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id, course: { slug: courseSlug } },
    select: { id: true, courseId: true },
  })
  if (!enrollment) redirect('/dashboard')

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    update: { completed: true, completedAt: new Date() },
    create: {
      userId: session.user.id,
      lessonId,
      enrollmentId: enrollment.id,
      completed: true,
      completedAt: new Date(),
    },
  })

  const [totalLessons, completedLessons] = await Promise.all([
    prisma.lesson.count({ where: { module: { courseId: enrollment.courseId } } }),
    prisma.lessonProgress.count({
      where: {
        userId: session.user.id,
        completed: true,
        lesson: { module: { courseId: enrollment.courseId } },
      },
    }),
  ])

  const newProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progress: newProgress,
      ...(completedLessons >= totalLessons ? { completedAt: new Date() } : {}),
    },
  })

  // Only allow redirects to internal /learn/* paths to prevent open redirect
  const safeHref = nextHref?.startsWith('/learn/') ? nextHref : null
  redirect(safeHref ?? '/dashboard')
}
