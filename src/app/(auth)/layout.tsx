import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
        aria-label="USIASDHR Academy — go to home page"
      >
        <Image
          src="/US2.png"
          alt="USIASDHR — United States Institute of Autism Spectrum Disorder and Human Rights"
          width={180}
          height={60}
          className="h-14 w-auto"
          priority
        />
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
