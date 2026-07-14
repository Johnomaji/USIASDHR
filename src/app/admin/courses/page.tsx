import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Course Pricing — Admin' }

function formatPrice(price: unknown): string {
  if (price == null) return '—'
  return `₦${Number(price).toLocaleString('en-NG', { minimumFractionDigits: 0 })}`
}

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      published: true,
      isFree: true,
      price: true,
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Course Pricing</h1>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Course</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Category</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Pricing</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="px-5 py-4 font-medium text-slate-900">{course.title}</td>
                <td className="px-5 py-4 text-slate-500">{course.category}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      course.published
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {course.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {course.isFree ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Free
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-900">{formatPrice(course.price)}</span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
                  >
                    Edit pricing
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
