import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PricingForm from './_components/PricingForm'
import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const course = await prisma.course.findUnique({ where: { id }, select: { title: true } })
  return { title: course ? `Pricing: ${course.title}` : 'Not Found' }
}

export default async function AdminCoursePricingPage({ params }: Props) {
  const { id } = await params
  const course = await prisma.course.findUnique({
    where: { id },
    select: { id: true, title: true, isFree: true, price: true },
  })
  if (!course) notFound()

  return (
    <div className="max-w-lg">
      <Link
        href="/admin/courses"
        className="text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6 inline-block"
      >
        ← Back to courses
      </Link>

      <h1 className="text-xl font-bold text-slate-900 mb-1">{course.title}</h1>
      <p className="text-sm text-slate-500 mb-8">Set whether this course is free or requires payment.</p>

      <PricingForm
        courseId={course.id}
        initialIsFree={course.isFree}
        initialPrice={course.price ? Number(course.price) : null}
      />
    </div>
  )
}
