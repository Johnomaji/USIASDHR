import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-6 py-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

export default async function AdminDashboardPage() {
  const [userCount, enrollmentCount, courseCount, revenueResult, recentEnrollments] =
    await Promise.all([
      prisma.user.count(),
      prisma.enrollment.count(),
      prisma.course.count({ where: { published: true } }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.enrollment.findMany({
        take: 10,
        orderBy: { enrolledAt: 'desc' },
        select: {
          enrolledAt: true,
          progress: true,
          completedAt: true,
          user: { select: { name: true, email: true } },
          course: { select: { title: true } },
        },
      }),
    ])

  const revenue = revenueResult._sum.amount ? Number(revenueResult._sum.amount) : 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Registered users" value={userCount} />
        <StatCard label="Total enrollments" value={enrollmentCount} />
        <StatCard label="Published courses" value={courseCount} />
        <StatCard
          label="Revenue (NGN)"
          value={revenue > 0 ? `₦${revenue.toLocaleString('en-NG')}` : '—'}
        />
      </div>

      <h2 className="text-base font-semibold text-slate-900 mb-3">Recent enrollments</h2>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">User</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Course</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Progress</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Enrolled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentEnrollments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400 text-sm">
                  No enrollments yet.
                </td>
              </tr>
            ) : (
              recentEnrollments.map((e, i) => (
                <tr key={i}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-900">{e.user.name}</p>
                    <p className="text-xs text-slate-400">{e.user.email}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{e.course.title}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
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
        {recentEnrollments.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
            <Link
              href="/admin/enrollments"
              className="text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
            >
              View all enrollments →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
