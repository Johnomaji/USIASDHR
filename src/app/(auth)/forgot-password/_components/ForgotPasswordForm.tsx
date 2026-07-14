'use client'

import { useActionState } from 'react'
import { forgotPassword } from '@/actions/auth'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

const inputClass =
  'w-full px-3 py-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white ' +
  'placeholder:text-slate-400 text-base ' +
  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ' +
  'aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-300'

export default function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPassword, undefined)

  if (state?.success) {
    return (
      <div
        role="status"
        className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800"
      >
        <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium text-sm">Check your inbox</p>
          <p className="text-sm mt-0.5 text-emerald-700">
            If that email is registered, you&apos;ll receive a reset link shortly. Check your spam
            folder if it doesn&apos;t arrive within a few minutes.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form action={action} noValidate className="space-y-5">
      {state?.error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed text-white font-medium rounded-lg text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        {pending ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  )
}
