'use server'

import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

function generateRef() {
  return `usiasdhr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export async function initiatePayment(formData: FormData) {
  const session = await verifySession()
  const courseId = formData.get('courseId') as string
  if (!courseId) redirect('/courses')

  const course = await prisma.course.findUnique({
    where: { id: courseId, published: true },
    select: { id: true, slug: true, isFree: true, price: true },
  })
  if (!course) redirect('/courses')

  // Guard: should not reach here for free courses, but handle gracefully
  if (course.isFree || !course.price) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      update: {},
      create: { userId: session.user.id, courseId },
    })
    redirect(`/learn/${course.slug}`)
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    select: { id: true },
  })
  if (existing) redirect(`/learn/${course.slug}`)

  const reference = generateRef()
  const appUrl = process.env.APP_URL ?? 'http://localhost:3000'
  const amountKobo = Math.round(Number(course.price) * 100)

  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: session.user.email,
      amount: amountKobo,
      currency: 'NGN',
      reference,
      callback_url: `${appUrl}/api/paystack/callback`,
      metadata: { courseId: course.id, courseSlug: course.slug, userId: session.user.id },
    }),
  })

  const json = await res.json()
  if (!json.status) redirect(`/courses/${course.slug}?payment=error`)

  await prisma.payment.create({
    data: {
      userId: session.user.id,
      courseId: course.id,
      amount: course.price,
      reference,
    },
  })

  redirect(json.data.authorization_url)
}
