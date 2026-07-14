'use client'

import { useState } from 'react'
import Link from 'next/link'
import { logout } from '@/actions/auth'

type Props = {
  isLoggedIn: boolean
  dashboardHref: string
}

export default function MobileMenu({ isLoggedIn, dashboardHref }: Props) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="17" y2="6" />
            <line x1="3" y1="10" x2="17" y2="10" />
            <line x1="3" y1="14" x2="17" y2="14" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-md z-50 px-4 py-3 flex flex-col gap-1">
          <Link
            href="/courses"
            onClick={close}
            className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Courses
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href={dashboardHref}
                onClick={close}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={close}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={close}
                className="mx-3 mt-1 px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium text-center hover:bg-primary-700 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
