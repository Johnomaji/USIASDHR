import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/dal'
import { enrollInCourse } from '@/actions/enrollment'
import type { CourseLevel } from '@prisma/client'

const levelLabel: Record<CourseLevel, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = await prisma.course.findUnique({
    where: { slug, published: true },
    select: { title: true, description: true },
  })
  if (!course) return { title: 'Course Not Found' }
  return { title: course.title, description: course.description }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params

  const [course, session] = await Promise.all([
    prisma.course.findUnique({
      where: { slug, published: true },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        level: true,
        slug: true,
        instructor: { select: { name: true } },
        modules: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            order: true,
            lessons: {
              orderBy: { order: 'asc' },
              select: { id: true, title: true, order: true, videoUrl: true },
            },
          },
        },
        _count: { select: { enrollments: true } },
      },
    }),
    getSession(),
  ])

  if (!course) notFound()

  let isEnrolled = false
  if (session?.user?.id) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
      select: { id: true },
    })
    isEnrolled = !!enrollment
  }

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-3 lg:gap-12">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-slate-500 list-none p-0 m-0">
              <li>
                <Link href="/courses" className="hover:text-primary-700 transition-colors">
                  Courses
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-700 font-medium truncate">{course.title}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {course.category}
            </span>
            <span className="text-sm text-slate-500">{levelLabel[course.level]}</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 leading-tight">{course.title}</h1>
          <p className="mt-4 text-slate-600 leading-relaxed">{course.description}</p>
          <p className="mt-3 text-sm text-slate-500">
            Taught by{' '}
            <span className="font-medium text-slate-700">{course.instructor.name}</span>
            {' · '}
            {course._count.enrollments} learner
            {course._count.enrollments !== 1 ? 's' : ''} enrolled
          </p>

          {/* Curriculum */}
          <section className="mt-10" aria-labelledby="curriculum-heading">
            <h2 id="curriculum-heading" className="text-xl font-bold text-slate-900 mb-2">
              Course curriculum
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {course.modules.length} module{course.modules.length !== 1 ? 's' : ''} &middot;{' '}
              {totalLessons} lesson{totalLessons !== 1 ? 's' : ''}
            </p>

            <div className="space-y-3">
              {course.modules.map((mod, idx) => (
                <details
                  key={mod.id}
                  open={idx === 0}
                  className="border border-slate-200 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-medium text-slate-400 w-5 text-center shrink-0">
                        {mod.order}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">{mod.title}</p>
                        {mod.description && (
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            {mod.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 ml-4">
                      {mod.lessons.length} lesson{mod.lessons.length !== 1 ? 's' : ''}
                    </span>
                  </summary>
                  <ul className="divide-y divide-slate-100 list-none p-0 m-0">
                    {mod.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex items-center gap-3 px-4 py-3">
                        <span className="text-slate-400 w-5 text-center text-xs shrink-0">
                          {lesson.order}
                        </span>
                        <span className="text-sm text-slate-700 flex-1">{lesson.title}</span>
                        {lesson.videoUrl && (
                          <span className="text-slate-400 text-xs shrink-0" aria-label="Video lesson">
                            ▶
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* Enrollment sidebar */}
        <aside className="mt-10 lg:mt-0" aria-label="Enrollment">
          <div className="bg-white border border-slate-200 rounded-xl p-6 lg:sticky lg:top-24 shadow-sm">
            <p className="text-2xl font-bold text-slate-900 mb-1">Free</p>
            <p className="text-sm text-slate-500 mb-6">Full access &middot; No expiry</p>

            {!session ? (
              <>
                <Link
                  href="/register"
                  className="block w-full text-center px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
                >
                  Sign up to enroll
                </Link>
                <p className="mt-3 text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-primary-700 hover:text-primary-800 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            ) : isEnrolled ? (
              <Link
                href={`/learn/${course.slug}`}
                className="block w-full text-center px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
              >
                Continue learning
              </Link>
            ) : (
              <form action={enrollInCourse}>
                <input type="hidden" name="courseId" value={course.id} />
                <input type="hidden" name="slug" value={course.slug} />
                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
                >
                  Enroll for free
                </button>
              </form>
            )}

            <ul className="mt-6 space-y-2 text-sm text-slate-600 list-none p-0 m-0">
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="text-primary-600">✓</span> Evidence-based content
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="text-primary-600">✓</span> Accessible design
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="text-primary-600">✓</span> Self-paced
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="text-primary-600">✓</span> Certificate of completion
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
