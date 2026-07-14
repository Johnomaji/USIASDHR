import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Page Not Found' }

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          <p className="text-6xl font-bold text-primary-600 mb-4">404</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Page not found</h1>
          <p className="text-slate-500 mb-8">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/"
              className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Go home
            </Link>
            <Link
              href="/courses"
              className="px-5 py-2.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
