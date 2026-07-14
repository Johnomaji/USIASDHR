import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import LessonForm from './_components/LessonForm'
import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string; lessonId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { title: true } })
  return { title: lesson ? `Edit: ${lesson.title}` : 'Not Found' }
}

export default async function LessonEditorPage({ params }: Props) {
  const { id, lessonId } = await params

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      videoUrl: true,
      content: true,
      order: true,
      module: {
        select: {
          title: true,
          order: true,
          course: { select: { id: true, title: true } },
        },
      },
    },
  })

  if (!lesson || lesson.module.course.id !== id) notFound()

  return (
    <div className="max-w-2xl">
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/admin/courses" className="hover:text-slate-700 transition-colors">
          Courses
        </Link>
        <span>/</span>
        <Link href={`/admin/courses/${id}/lessons`} className="hover:text-slate-700 transition-colors">
          {lesson.module.course.title}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate">
          M{lesson.module.order} · L{lesson.order}
        </span>
      </nav>

      <h1 className="text-xl font-bold text-slate-900 mb-1">{lesson.title}</h1>
      <p className="text-sm text-slate-500 mb-8">
        {lesson.module.title} — Lesson {lesson.order}
      </p>

      <LessonForm
        lessonId={lesson.id}
        courseId={id}
        initialTitle={lesson.title}
        initialVideoUrl={lesson.videoUrl}
        initialContent={lesson.content}
      />
    </div>
  )
}
