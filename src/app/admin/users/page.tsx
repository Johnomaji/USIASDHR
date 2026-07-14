import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Users — Admin' }

const roleBadge: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-800',
  INSTRUCTOR: 'bg-blue-100 text-blue-800',
  STUDENT: 'bg-slate-100 text-slate-600',
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { enrollments: true } },
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <span className="text-sm text-slate-500">{users.length} total</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Name</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Email</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Role</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Enrollments</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                  No users yet.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-3 font-medium text-slate-900">{user.name}</td>
                  <td className="px-5 py-3 text-slate-500">{user.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge[user.role]}`}
                    >
                      {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-700 tabular-nums">
                    {user._count.enrollments}
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs tabular-nums whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString('en-NG', {
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
