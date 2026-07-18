import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createModule, createLesson, createQuiz } from '@/actions/admin'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const course = await prisma.course.findUnique({ where: { id }, select: { title: true } })
  return { title: course ? `Lessons: ${course.title}` : 'Not Found' }
}

const inputClass =
  'px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

export default async function CourseLessonsPage({ params }: Props) {
  const { id } = await params
  const course = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      modules: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          order: true,
          lessons: {
            orderBy: { order: 'asc' },
            select: { id: true, title: true, videoUrl: true, order: true },
          },
          quizzes: {
            select: {
              id: true,
              title: true,
              passingScore: true,
              _count: { select: { questions: true } },
            },
          },
        },
      },
    },
  })
  if (!course) notFound()

  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0)
  const withVideo = course.modules.reduce(
    (n, m) => n + m.lessons.filter((l) => l.videoUrl).length,
    0,
  )

  return (
    <div>
      <Link
        href="/admin/courses"
        className="text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6 inline-block"
      >
        ← Back to courses
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">{course.title}</h1>
          <p className="text-sm text-slate-500">
            {withVideo} of {totalLessons} lessons have a video
          </p>
        </div>
      </div>

      {/* Add module */}
      <details className="mb-6 bg-white border border-slate-200 rounded-xl overflow-hidden">
        <summary className="flex items-center gap-2 px-5 py-3 cursor-pointer text-sm font-medium text-primary-700 hover:bg-slate-50 transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true">+</span> Add new module
        </summary>
        <form
          action={createModule}
          className="flex items-center gap-3 px-5 py-4 border-t border-slate-100"
        >
          <input type="hidden" name="courseId" value={id} />
          <input
            type="text"
            name="title"
            required
            placeholder="Module title"
            className={`${inputClass} flex-1`}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add module
          </button>
        </form>
      </details>

      {course.modules.length === 0 && (
        <p className="text-slate-500 text-sm text-center py-10">
          No modules yet — add one above to get started.
        </p>
      )}

      <div className="space-y-4">
        {course.modules.map((mod) => (
          <div key={mod.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Module header */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-700">
                Module {mod.order}: {mod.title}
              </h2>
            </div>

            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                {/* Lessons */}
                {mod.lessons.map((lesson) => (
                  <tr key={lesson.id}>
                    <td className="px-5 py-3 text-slate-400 w-10 tabular-nums">{lesson.order}</td>
                    <td className="px-5 py-3 font-medium text-slate-900">{lesson.title}</td>
                    <td className="px-5 py-3">
                      {lesson.videoUrl ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Video added
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          No video
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/courses/${id}/lessons/${lesson.id}`}
                        className="text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}

                {/* Quizzes */}
                {mod.quizzes.map((quiz) => (
                  <tr key={quiz.id} className="bg-violet-50/40">
                    <td className="px-5 py-3 text-slate-400 w-10 text-xs">Q</td>
                    <td className="px-5 py-3 font-medium text-slate-900">{quiz.title}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                        {quiz._count.questions} question{quiz._count.questions !== 1 ? 's' : ''} ·{' '}
                        {quiz.passingScore}% to pass
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/courses/${id}/quizzes/${quiz.id}`}
                        className="text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}

                {mod.lessons.length === 0 && mod.quizzes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-4 text-slate-400 text-sm text-center">
                      No lessons or quizzes yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Per-module actions */}
            <div className="flex items-center gap-3 px-5 py-3 border-t border-slate-100 bg-slate-50">
              <form action={createLesson}>
                <input type="hidden" name="courseId" value={id} />
                <input type="hidden" name="moduleId" value={mod.id} />
                <button
                  type="submit"
                  className="text-xs font-medium text-primary-700 hover:text-primary-800 transition-colors"
                >
                  + Add lesson
                </button>
              </form>
              <span className="text-slate-300" aria-hidden="true">|</span>
              <form action={createQuiz}>
                <input type="hidden" name="courseId" value={id} />
                <input type="hidden" name="moduleId" value={mod.id} />
                <button
                  type="submit"
                  className="text-xs font-medium text-violet-700 hover:text-violet-800 transition-colors"
                >
                  + Add quiz
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
