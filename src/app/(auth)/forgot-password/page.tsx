import type { Metadata } from 'next'
import Link from 'next/link'
import ForgotPasswordForm from './_components/ForgotPasswordForm'

export const metadata: Metadata = { title: 'Forgot Password' }

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Forgot your password?</h1>
        <p className="text-slate-600 mt-1 text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <ForgotPasswordForm />
      </div>

      <p className="text-center text-sm text-slate-500 mt-5">
        Remembered it?{' '}
        <Link
          href="/login"
          className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
