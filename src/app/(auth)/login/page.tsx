import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from './_components/LoginForm'
import { CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign In — USIASDHR Academy',
}

type Props = { searchParams: Promise<{ reset?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const { reset } = await searchParams

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-slate-600 mt-1 text-sm">
          Sign in to continue your learning journey.
        </p>
      </div>

      {reset === 'success' && (
        <div
          role="status"
          className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm border border-emerald-200 mb-4"
        >
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>Password updated successfully. You can now sign in with your new password.</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <LoginForm />
        <p className="text-center text-sm mt-5">
          <Link
            href="/forgot-password"
            className="text-slate-500 hover:text-primary-600 transition-colors underline underline-offset-2"
          >
            Forgot your password?
          </Link>
        </p>
      </div>

      <p className="text-center text-sm text-slate-500 mt-5">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2"
        >
          Create one — it&apos;s free
        </Link>
      </p>
    </div>
  )
}
