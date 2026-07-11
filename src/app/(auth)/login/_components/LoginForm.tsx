'use client'

import { useActionState } from 'react'
import { login } from '@/actions/auth'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const inputClass =
  'w-full px-3 py-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white ' +
  'placeholder:text-slate-400 text-base ' +
  'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ' +
  'aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-300'

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={action} noValidate className="space-y-5">
      {/* General error */}
      {state?.error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Email */}
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
          aria-invalid={state?.errors?.email ? true : undefined}
          aria-describedby={state?.errors?.email ? 'email-error' : undefined}
          className={inputClass}
          placeholder="you@example.com"
        />
        {state?.errors?.email && (
          <p id="email-error" role="alert" className="text-sm text-red-600">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            aria-invalid={state?.errors?.password ? true : undefined}
            aria-describedby={state?.errors?.password ? 'password-error' : undefined}
            className={inputClass + ' pr-11'}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1 rounded"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {state?.errors?.password && (
          <p id="password-error" role="alert" className="text-sm text-red-600">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed text-white font-medium rounded-lg text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
