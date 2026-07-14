'use client'

import { useActionState, useState } from 'react'
import { resetPassword } from '@/actions/auth'
import { AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

const inputClass =
  'w-full px-3 py-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white ' +
  'placeholder:text-slate-400 text-base ' +
  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ' +
  'aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-300'

const rules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
]

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPassword, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword] = useState('')

  return (
    <form action={action} noValidate className="space-y-5">
      <input type="hidden" name="token" value={token} />

      {state?.error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          New password
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
            aria-invalid={!!state?.errors?.password}
            aria-describedby={state?.errors?.password ? 'password-error' : undefined}
            className={inputClass + ' pr-11'}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
          >
            {showPassword ? <EyeOff className="w-4 h-4" aria-hidden /> : <Eye className="w-4 h-4" aria-hidden />}
          </button>
        </div>

        {/* Live requirements */}
        {password.length > 0 && (
          <ul className="space-y-1 mt-2" aria-label="Password requirements">
            {rules.map(({ label, test }) => {
              const met = test(password)
              return (
                <li key={label} className={`flex items-center gap-1.5 text-xs ${met ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden />
                  {label}
                </li>
              )
            })}
          </ul>
        )}

        {state?.errors?.password && (
          <p id="password-error" role="alert" className="text-sm text-red-600">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
          Confirm new password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            required
            className={inputClass + ' pr-11'}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" aria-hidden /> : <Eye className="w-4 h-4" aria-hidden />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed text-white font-medium rounded-lg text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        {pending ? 'Saving…' : 'Set new password'}
      </button>
    </form>
  )
}
