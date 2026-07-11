'use server'

import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function enrollInCourse(formData: FormData) {
  const session = await verifySession()
  const courseId = formData.get('courseId') as string
  const slug = formData.get('slug') as string

  if (!courseId || !slug) return

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    update: {},
    create: { userId: session.user.id, courseId },
  })

  redirect(`/learn/${slug}`)
}
