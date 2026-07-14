import type { Metadata } from 'next'
import Link from 'next/link'
import RegisterForm from './_components/RegisterForm'

export const metadata: Metadata = {
  title: 'Create Account — USIASDHR Academy',
}

export default function RegisterPage() {
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
        <p className="text-slate-600 mt-1 text-sm">
          Free access to our autism education courses.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <RegisterForm />
      </div>

      <p className="text-center text-sm text-slate-500 mt-5">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
