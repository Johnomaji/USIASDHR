import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PrintButton from './_components/PrintButton'

type Props = { params: Promise<{ code: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const cert = await prisma.certificate.findUnique({
    where: { certificateCode: code },
    select: { course: { select: { title: true } } },
  })
  if (!cert) return { title: 'Certificate not found' }
  return { title: `Certificate — ${cert.course.title}` }
}

export default async function CertificatePage({ params }: Props) {
  const { code } = await params

  const cert = await prisma.certificate.findUnique({
    where: { certificateCode: code },
    select: {
      certificateCode: true,
      issuedAt: true,
      user: { select: { name: true } },
      course: {
        select: {
          title: true,
          category: true,
          instructor: { select: { name: true } },
        },
      },
    },
  })

  if (!cert) notFound()

  const issuedDate = new Date(cert.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 print:bg-white print:py-0">
      {/* Actions — hidden when printing */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/dashboard"
          className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          ← Back to dashboard
        </Link>
        <PrintButton />
      </div>

      {/* Certificate */}
      <div
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl print:shadow-none print:rounded-none"
        role="main"
        aria-label="Certificate of completion"
      >
        {/* Outer decorative border */}
        <div className="p-4 rounded-2xl border-4 border-primary-600 print:rounded-none">
          {/* Inner decorative border */}
          <div className="p-8 sm:p-14 rounded-xl border-2 border-primary-200 text-center">

            {/* Header */}
            <div className="mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/US1-01.png"
                alt="USIASDHR seal"
                className="h-28 w-auto mx-auto mb-4"
              />
              <p className="text-lg font-semibold tracking-wide text-slate-700">
                USIASDHR Academy
              </p>
            </div>

            {/* Decorative rule */}
            <div className="flex items-center gap-4 mb-8" aria-hidden="true">
              <div className="flex-1 h-px bg-primary-200" />
              <span className="text-primary-400 text-lg">✦</span>
              <div className="flex-1 h-px bg-primary-200" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-slate-500 tracking-wide uppercase mb-10">
              Certificate of Completion
            </h1>

            {/* Body */}
            <p className="text-slate-500 text-base mb-4">This is to certify that</p>

            <p className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {cert.user.name}
            </p>

            <p className="text-slate-500 text-base mb-4">
              has successfully completed the course
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-primary-700 mb-10">
              {cert.course.title}
            </p>

            {/* Decorative rule */}
            <div className="flex items-center gap-4 mb-10" aria-hidden="true">
              <div className="flex-1 h-px bg-primary-200" />
              <span className="text-primary-400 text-lg">✦</span>
              <div className="flex-1 h-px bg-primary-200" />
            </div>

            {/* Signature / date row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-10 text-left">
              <div>
                <p className="text-lg font-bold text-slate-900">{cert.course.instructor.name}</p>
                <div className="mt-1 h-px w-40 bg-slate-300" />
                <p className="mt-1.5 text-xs text-slate-500 uppercase tracking-wider">
                  Instructor
                </p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-lg font-bold text-slate-900">{issuedDate}</p>
                <div className="mt-1 h-px w-40 bg-slate-300" />
                <p className="mt-1.5 text-xs text-slate-500 uppercase tracking-wider">
                  Date of issue
                </p>
              </div>
            </div>

            {/* Verification footer */}
            <div className="bg-slate-50 rounded-xl px-6 py-4 print:bg-white print:border print:border-slate-200">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                Verification code
              </p>
              <p className="font-mono text-sm font-semibold text-slate-700 break-all">
                {cert.certificateCode}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Verify at{' '}
                <span className="text-primary-600">usiasdhr.com/verify/{cert.certificateCode}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category badge — below certificate, hidden when printing */}
      <div className="max-w-3xl mx-auto mt-6 text-center print:hidden">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {cert.course.category}
        </span>
        <p className="mt-3 text-xs text-slate-400">
          This certificate was issued by USIASDHR Academy and can be verified using the code above.
        </p>
      </div>
    </div>
  )
}
