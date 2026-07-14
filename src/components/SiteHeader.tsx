import Link from 'next/link'
import { getSession } from '@/lib/dal'
import { logout } from '@/actions/auth'
import MobileMenu from './MobileMenu'

export default async function SiteHeader() {
  const session = await getSession()

  const dashboardHref =
    session?.user?.role === 'ADMIN'
      ? '/admin'
      : session?.user?.role === 'INSTRUCTOR'
        ? '/instructor'
        : '/dashboard'

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" aria-label="USIASDHR Academy — Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/US2.png"
              alt="USIASDHR — United States Institute of Autism Spectrum Disorder and Human Rights"
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden sm:block">
            <ul className="flex items-center gap-6 list-none m-0 p-0">
              <li>
                <Link
                  href="/courses"
                  className="text-slate-600 hover:text-primary-700 transition-colors text-sm font-medium"
                >
                  Courses
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop auth */}
          <div className="hidden sm:flex items-center gap-3">
            {session ? (
              <>
                <Link
                  href={dashboardHref}
                  className="text-sm font-medium text-slate-700 hover:text-primary-700 transition-colors"
                >
                  Dashboard
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-700 hover:text-primary-700 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <MobileMenu isLoggedIn={!!session} dashboardHref={dashboardHref} />
        </div>
      </div>
    </header>
  )
}
