import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Wordmark */}
      <Link
        href="/"
        className="mb-8 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-lg"
        aria-label="USIASDHR — go to home page"
      >
        <span className="block text-sm font-semibold tracking-widest text-teal-700 uppercase">
          USIASDHR
        </span>
        <span className="block text-xs text-slate-500 mt-0.5">
          Academy
        </span>
      </Link>

      <main className="w-full max-w-md" id="main-content">
        {children}
      </main>

      <footer className="mt-8 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} United States Institute of Autism Spectrum Disorder and Human Rights
      </footer>
    </div>
  )
}
