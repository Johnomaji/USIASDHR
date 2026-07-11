import { notFound, redirect } from 'next/navigation'
import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'

type Props = { params: Promise<{ slug: string }> }

export default async function LearnCoursePage({ params }: Props) {
  const { slug } = await params
  const session = await verifySession()

  const course = await prisma.course.findUnique({
    where: { slug, published: true },
    select: {
      id: true,
      modules: {
        orderBy: { order: 'asc' },
        select: {
          lessons: { orderBy: { order: 'asc' }, select: { id: true } },
          quizzes: { select: { id: true } },
        },
      },
    },
  })
  if (!course) notFound()

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    select: { id: true },
  })
  if (!enrollment) redirect(`/courses/${slug}`)

  // Mixed flat sequence: lessons then quiz per module
  type Item = { type: 'lesson' | 'quiz'; id: string }
  const allItems: Item[] = course.modules.flatMap((m) => [
    ...m.lessons.map((l) => ({ type: 'lesson' as const, id: l.id })),
    ...m.quizzes.map((q) => ({ type: 'quiz' as const, id: q.id })),
  ])
  if (allItems.length === 0) redirect('/dashboard')

  const [completedLessons, passedQuizzes] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: {
        userId: session.user.id,
        completed: true,
        lesson: { module: { courseId: course.id } },
      },
      select: { lessonId: true },
    }),
    prisma.quizAttempt.findMany({
      where: {
        userId: session.user.id,
        passed: true,
        quiz: { module: { courseId: course.id } },
      },
      select: { quizId: true },
    }),
  ])

  const completedIds = new Set(completedLessons.map((lp) => lp.lessonId))
  const passedIds = new Set(passedQuizzes.map((a) => a.quizId))

  const isItemComplete = (item: Item) =>
    item.type === 'lesson' ? completedIds.has(item.id) : passedIds.has(item.id)

  // Resume from first incomplete item; if all done, land on last item
  const target =
    allItems.find((item) => !isItemComplete(item)) ?? allItems[allItems.length - 1]

  if (target.type === 'lesson') {
    redirect(`/learn/${slug}/${target.id}`)
  } else {
    redirect(`/learn/${slug}/quiz/${target.id}`)
  }
}
