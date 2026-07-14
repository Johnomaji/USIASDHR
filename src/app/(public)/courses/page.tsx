import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import CourseCard from '@/components/CourseCard'
import type { CourseLevel } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Browse all USIASDHR Academy courses on autism education.',
}

const CATEGORIES = ['Foundations', 'Education', 'Caregiving'] as const
const LEVELS: { value: CourseLevel; label: string }[] = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
]
const VALID_LEVELS = new Set(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])

type Props = {
  searchParams: Promise<{ q?: string; category?: string; level?: string }>
}

export default async function CoursesPage({ searchParams }: Props) {
  const { q, category, level } = await searchParams

  const safeCategory =
    category && (CATEGORIES as readonly string[]).includes(category) ? category : undefined
  const safeLevel =
    level && VALID_LEVELS.has(level) ? (level as CourseLevel) : undefined

  const courses = await prisma.course.findMany({
    where: {
      published: true,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(safeCategory ? { category: safeCategory } : {}),
      ...(safeLevel ? { level: safeLevel } : {}),
    },
    orderBy: { createdAt: 'asc' },
    select: {
      slug: true,
      title: true,
      description: true,
      category: true,
      level: true,
      isFree: true,
      price: true,
      instructor: { select: { name: true } },
      _count: { select: { enrollments: true } },
    },
  })

  const hasFilters = q || safeCategory || safeLevel

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">All courses</h1>
        <p className="mt-2 text-slate-600">
          {courses.length} course{courses.length !== 1 ? 's' : ''}
          {hasFilters ? ' matching your filters' : ' available'}
        </p>
      </div>

      {/* Filters — works without JS */}
      <form method="GET" aria-label="Filter courses" className="mb-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <label htmlFor="q" className="block text-sm font-medium text-slate-700 mb-1">
              Search
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q ?? ''}
              placeholder="Search courses…"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={safeCategory ?? ''}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-slate-700 mb-1">
              Level
            </label>
            <select
              id="level"
              name="level"
              defaultValue={safeLevel ?? ''}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All levels</option>
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Apply
            </button>
            {hasFilters && (
              <a
                href="/courses"
                className="px-5 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Clear
              </a>
            )}
          </div>
        </div>
      </form>

      {courses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-600 text-lg">No courses found.</p>
          {hasFilters && (
            <a
              href="/courses"
              className="mt-4 inline-block text-primary-700 hover:text-primary-800 font-medium"
            >
              Clear all filters
            </a>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} headingLevel="h2" />
          ))}
        </div>
      )}
    </div>
  )
}
