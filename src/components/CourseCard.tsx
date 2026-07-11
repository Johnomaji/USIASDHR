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
    <article className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
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
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors shrink-0"
        >
          View course →
        </Link>
      </div>
    </article>
  )
}
