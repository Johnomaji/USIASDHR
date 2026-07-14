import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <div className="inline-flex bg-white rounded-xl p-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/US1-01.png"
                alt="USIASDHR seal"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-sm leading-6">
              Online learning for autism education — for families, caregivers, educators, and
              professionals.
            </p>
            <div className="mt-4 space-y-1 text-sm">
              <p>
                <a href="tel:+2349062037222" className="hover:text-white transition-colors">
                  +234 906 203 7222
                </a>
              </p>
              <p>
                <a href="mailto:Info@usiasdhr.com" className="hover:text-white transition-colors">
                  Info@usiasdhr.com
                </a>
              </p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white text-sm mb-3">Learn</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=Foundations"
                  className="hover:text-white transition-colors"
                >
                  Foundations
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=Education"
                  className="hover:text-white transition-colors"
                >
                  Education
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=Caregiving"
                  className="hover:text-white transition-colors"
                >
                  Caregiving
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white text-sm mb-3">Account</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-10 pt-6 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} USIASDHR. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
