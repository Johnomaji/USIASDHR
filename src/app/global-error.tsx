'use client'

import { useEffect } from 'react'
import { Geist } from 'next/font/google'

const geist = Geist({ subsets: ['latin'] })

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en" className={geist.className}>
      <body className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 px-4">
        <div className="text-center max-w-md">
          <p className="text-5xl font-bold text-slate-300 mb-4">500</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Something went wrong</h1>
          <p className="text-slate-500 mb-8">
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={unstable_retry}
            className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
