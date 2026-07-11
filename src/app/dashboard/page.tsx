import type { Metadata } from 'next'
import Link from 'next/link'
import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import type { CourseLevel } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Dashboard',
}

const levelBadge: Record<CourseLevel, { label: string; className: string }> = {
  BEGINNER: { label: 'Beginner', className: 'bg-emerald-100 text-emerald-800' },
  INTERMEDIATE: { label: 'Intermediate', className: 'bg-amber-100 text-amber-800' },
  ADVANCED: { label: 'Advanced', className: 'bg-rose-100 text-rose-800' },
}

export default async function DashboardPage() {
  const session = await verifySession()

  const [enrollments, certificates] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: session.user.id },
      orderBy: { enrolledAt: 'desc' },
      select: {
        id: true,
        progress: true,
        enrolledAt: true,
        completedAt: true,
        course: {
          select: {
            title: true,
            slug: true,
            category: true,
            level: true,
            instructor: { select: { name: true } },
          },
        },
      },
    }),
    prisma.certificate.findMany({
      where: { userId: session.user.id },
      orderBy: { issuedAt: 'desc' },
      select: {
        id: true,
        certificateCode: true,
        issuedAt: true,
        course: { select: { title: true } },
      },
    }),
  ])

  const inProgressCount = enrollments.filter((e) => e.progress > 0 && !e.completedAt).length
  const completedCount = enrollments.filter((e) => !!e.completedAt).length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {session.user.name ?? 'Learner'}
        </h1>
        <p className="mt-1 text-slate-600">Here&rsquo;s what you&rsquo;re working on.</p>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
        role="list"
        aria-label="Learning statistics"
      >
        {[
          { label: 'Enrolled', value: enrollments.length },
          { label: 'In progress', value: inProgressCount },
          { label: 'Completed', value: completedCount },
          { label: 'Certificates', value: certificates.length },
        ].map(({ label, value }) => (
          <div
            key={label}
            role="listitem"
            className="bg-white rounded-xl border border-slate-200 p-5 text-center"
          >
            <p className="text-3xl font-bold text-primary-600" aria-label={`${value} ${label}`}>
              {value}
            </p>
            <p className="mt-1 text-sm text-slate-500" aria-hidden="true">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* My Courses */}
      <section aria-labelledby="courses-heading" className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 id="courses-heading" className="text-lg font-semibold text-slate-900">
            My courses
          </h2>
          <Link
            href="/courses"
            className="text-sm text-primary-700 font-medium hover:text-primary-800 transition-colors"
          >
            Browse more &rarr;
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <p className="text-slate-600">You haven&rsquo;t enrolled in any courses yet.</p>
            <Link
              href="/courses"
              className="mt-4 inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Browse courses
            </Link>
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-4 list-none p-0 m-0">
            {enrollments.map((enrollment) => {
              const badge = levelBadge[enrollment.course.level]
              const pct = Math.round(enrollment.progress)
              const isComplete = !!enrollment.completedAt

              const ctaLabel =
                isComplete ? 'Review course' : pct === 0 ? 'Start learning' : 'Continue learning'

              return (
                <li key={enrollment.id}>
                  <article className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4 h-full">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      {isComplete && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          Completed
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 leading-snug">
                        {enrollment.course.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {enrollment.course.instructor.name} &middot; {enrollment.course.category}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-500">Progress</span>
                        <span className="text-xs font-medium text-slate-700">{pct}%</span>
                      </div>
                      <div
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${enrollment.course.title} — ${pct}% complete`}
                        className="h-2 bg-slate-200 rounded-full overflow-hidden"
                      >
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/learn/${enrollment.course.slug}`}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      {ctaLabel}
                    </Link>
                  </article>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Certificates */}
      <section aria-labelledby="certs-heading">
        <h2 id="certs-heading" className="text-lg font-semibold text-slate-900 mb-6">
          Certificates
        </h2>

        {certificates.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <p className="text-slate-600 text-sm">
              Complete a course to earn your first certificate.
            </p>
          </div>
        ) : (
          <ul className="space-y-3 list-none p-0 m-0">
            {certificates.map((cert) => (
              <li
                key={cert.id}
                className="bg-white rounded-xl border border-slate-200 px-6 py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-slate-900 text-sm">{cert.course.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Issued{' '}
                    {new Date(cert.issuedAt).toLocaleDateString('en-US', {
                      dateStyle: 'medium',
                    })}
                  </p>
                </div>
                <Link
                  href={`/verify/${cert.certificateCode}`}
                  className="text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors shrink-0"
                  aria-label={`View certificate for ${cert.course.title}`}
                >
                  View &rarr;
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
