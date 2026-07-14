'use client'

import { useActionState } from 'react'
import { register } from '@/actions/auth'
import { AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

const inputClass =
  'w-full px-3 py-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white ' +
  'placeholder:text-slate-400 text-base ' +
  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ' +
  'aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-300'

const passwordRules = [
  { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One number', test: (v: string) => /[0-9]/.test(v) },
]

export default function RegisterForm() {
  const [state, action, pending] = useActionState(register, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')

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

      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={state?.errors?.name ? true : undefined}
          aria-describedby={state?.errors?.name ? 'name-error' : undefined}
          className={inputClass}
          placeholder="Your name"
        />
        {state?.errors?.name && (
          <p id="name-error" role="alert" className="text-sm text-red-600">
            {state.errors.name[0]}
          </p>
        )}
      </div>

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
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={state?.errors?.password ? true : undefined}
            aria-describedby="password-rules"
            className={inputClass + ' pr-11'}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Live password rules */}
        <ul id="password-rules" className="space-y-1 mt-2" aria-label="Password requirements">
          {passwordRules.map((rule) => {
            const met = rule.test(password)
            return (
              <li
                key={rule.label}
                className={`flex items-center gap-1.5 text-xs ${met ? 'text-primary-700' : 'text-slate-500'}`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${met ? 'text-primary-600' : 'text-slate-300'}`}
                  aria-hidden="true"
                />
                <span aria-live="polite">
                  <span className="sr-only">{met ? 'Requirement met: ' : 'Requirement not yet met: '}</span>
                  {rule.label}
                </span>
              </li>
            )
          })}
        </ul>

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
        className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed text-white font-medium rounded-lg text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        {pending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
