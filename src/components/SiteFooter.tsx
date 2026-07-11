import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <p className="font-bold text-white text-sm mb-3">USIASDHR Academy</p>
            <p className="text-sm leading-6">
              Online learning for autism education — for families, caregivers, educators, and
              professionals.
            </p>
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
