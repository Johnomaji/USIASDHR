import { verifyRole } from '@/lib/dal'
import Link from 'next/link'

const navLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/enrollments', label: 'Enrollments' },
  { href: '/admin/courses', label: 'Courses' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await verifyRole(['ADMIN'])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 shrink-0">
          Admin
        </span>
        <nav aria-label="Admin navigation">
          <ul className="flex items-center gap-4 list-none m-0 p-0">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm font-medium text-slate-600 hover:text-primary-700 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {children}
    </div>
  )
}
