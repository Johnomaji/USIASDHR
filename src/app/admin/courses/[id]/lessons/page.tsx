import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const course = await prisma.course.findUnique({ where: { id }, select: { title: true } })
  return { title: course ? `Lessons: ${course.title}` : 'Not Found' }
}

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
        },
      },
    },
  })
  if (!course) notFound()

  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0)
  const withVideo = course.modules.reduce(
    (n, m) => n + m.lessons.filter((l) => l.videoUrl).length,
    0
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

      <div className="space-y-4">
        {course.modules.map((mod) => (
          <div key={mod.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-700">
                Module {mod.order}: {mod.title}
              </h2>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
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
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
