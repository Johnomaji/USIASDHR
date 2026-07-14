import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import NewCourseForm from './_components/NewCourseForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Course — Admin' }

export default async function NewCoursePage() {
  const instructors = await prisma.user.findMany({
    where: { role: { in: ['INSTRUCTOR', 'ADMIN'] } },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, email: true },
  })

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/courses"
        className="text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6 inline-block"
      >
        ← Back to courses
      </Link>

      <h1 className="text-xl font-bold text-slate-900 mb-8">New course</h1>

      <NewCourseForm instructors={instructors} />
    </div>
  )
}
