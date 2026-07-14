import { verifyRole } from '@/lib/dal'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await verifyRole(['ADMIN'])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Admin</span>
        <nav aria-label="Admin navigation">
          <ul className="flex items-center gap-4 list-none m-0 p-0">
            <li>
              <Link
                href="/admin/courses"
                className="text-sm font-medium text-slate-600 hover:text-primary-700 transition-colors"
              >
                Course Pricing
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  )
}
