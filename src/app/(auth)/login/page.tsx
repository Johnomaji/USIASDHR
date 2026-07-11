import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from './_components/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In — USIASDHR Academy',
}

export default function LoginPage() {
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-slate-600 mt-1 text-sm">
          Sign in to continue your learning journey.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <LoginForm />
      </div>

      <p className="text-center text-sm text-slate-500 mt-5">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-teal-600 hover:text-teal-700 font-medium underline underline-offset-2"
        >
          Create one — it&apos;s free
        </Link>
      </p>
    </div>
  )
}
