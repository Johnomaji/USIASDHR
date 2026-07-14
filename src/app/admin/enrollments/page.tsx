import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Enrollments — Admin' }

export default async function AdminEnrollmentsPage() {
  const enrollments = await prisma.enrollment.findMany({
    orderBy: { enrolledAt: 'desc' },
    select: {
      id: true,
      enrolledAt: true,
      completedAt: true,
      progress: true,
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Enrollments</h1>
        <span className="text-sm text-slate-500">{enrollments.length} total</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">User</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Course</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Progress</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Enrolled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                  No enrollments yet.
                </td>
              </tr>
            ) : (
              enrollments.map((e) => (
                <tr key={e.id}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-900">{e.user.name}</p>
                    <p className="text-xs text-slate-400">{e.user.email}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{e.course.title}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${Math.round(e.progress)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 tabular-nums">
                        {Math.round(e.progress)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {e.completedAt ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        In progress
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs tabular-nums whitespace-nowrap">
                    {new Date(e.enrolledAt).toLocaleDateString('en-NG', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
