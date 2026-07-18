import Image from 'next/image'
import Link from 'next/link'
import type { CourseLevel } from '@prisma/client'

const levelBadge: Record<CourseLevel, { label: string; className: string }> = {
  BEGINNER: { label: 'Beginner', className: 'bg-emerald-100 text-emerald-800' },
  INTERMEDIATE: { label: 'Intermediate', className: 'bg-amber-100 text-amber-800' },
  ADVANCED: { label: 'Advanced', className: 'bg-rose-100 text-rose-800' },
}

type CourseCardCourse = {
  slug: string
  title: string
  description: string
  category: string
  level: CourseLevel
  isFree: boolean
  price: unknown
  coverImage?: string | null
  instructor: { name: string }
  _count?: { enrollments: number }
}

type Props = {
  course: CourseCardCourse
  headingLevel?: 'h2' | 'h3'
}

export default function CourseCard({ course, headingLevel: H = 'h3' }: Props) {
  const badge = levelBadge[course.level]

  return (
    <article className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {/* Cover image */}
      <div className="relative w-full h-44 shrink-0 overflow-hidden">
        {course.coverImage ? (
          <Image
            src={course.coverImage}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
          <span className="text-xs text-slate-500 shrink-0">{course.category}</span>
        </div>

        <div className="flex-1">
          <H className="text-base font-semibold text-slate-900 leading-snug">{course.title}</H>
          <p className="mt-1 text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-slate-500 truncate">
            {course.instructor.name}
            {course._count != null ? ` · ${course._count.enrollments} learners` : ''}
          </span>
          <div className="flex items-center gap-3 shrink-0">
            {course.isFree ? (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Free
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-700">
                ₦{Number(course.price).toLocaleString('en-NG', { minimumFractionDigits: 0 })}
              </span>
            )}
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
            >
              View course →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
