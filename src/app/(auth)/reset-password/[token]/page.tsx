import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ResetPasswordForm from './_components/ResetPasswordForm'

export const metadata: Metadata = { title: 'Reset Password' }

type Props = { params: Promise<{ token: string }> }

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = await params

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    select: { expiresAt: true, usedAt: true },
  })

  const isValid = record && !record.usedAt && record.expiresAt > new Date()

  if (!isValid) {
    return (
      <div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Link expired</h1>
          <p className="text-slate-600 mt-1 text-sm">
            This reset link is invalid or has already been used.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-4">
          <p className="text-slate-600 text-sm">
            Reset links expire after 1 hour and can only be used once.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Set a new password</h1>
        <p className="text-slate-600 mt-1 text-sm">Choose a strong password for your account.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
}
