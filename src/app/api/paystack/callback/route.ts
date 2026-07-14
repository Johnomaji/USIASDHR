import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get('reference')
  if (!reference) return NextResponse.redirect(new URL('/courses', request.url))

  const payment = await prisma.payment.findUnique({
    where: { reference },
    include: { course: { select: { slug: true } } },
  })
  if (!payment) return NextResponse.redirect(new URL('/courses', request.url))

  // Already processed
  if (payment.status === 'COMPLETED') {
    return NextResponse.redirect(new URL(`/learn/${payment.course.slug}`, request.url))
  }

  const verify = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  })
  const json = await verify.json()

  if (json.status && json.data?.status === 'success') {
    await prisma.$transaction([
      prisma.payment.update({ where: { reference }, data: { status: 'COMPLETED' } }),
      prisma.enrollment.upsert({
        where: { userId_courseId: { userId: payment.userId, courseId: payment.courseId } },
        update: {},
        create: { userId: payment.userId, courseId: payment.courseId },
      }),
    ])
    return NextResponse.redirect(new URL(`/learn/${payment.course.slug}`, request.url))
  }

  await prisma.payment.update({ where: { reference }, data: { status: 'FAILED' } })
  return NextResponse.redirect(
    new URL(`/courses/${payment.course.slug}?payment=failed`, request.url)
  )
}
