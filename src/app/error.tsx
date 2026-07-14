'use client'

import { useEffect } from 'react'

export default function Error({
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
    <div className="flex-1 flex items-center justify-center px-4 py-24">
      <div className="text-center max-w-md">
        <p className="text-5xl font-bold text-slate-300 mb-4">500</p>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Something went wrong</h2>
        <p className="text-slate-500 mb-2">
          An unexpected error occurred. You can try again — if the problem persists, please contact
          support.
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 mb-8 font-mono">Error ID: {error.digest}</p>
        )}
        <button
          onClick={unstable_retry}
          className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
