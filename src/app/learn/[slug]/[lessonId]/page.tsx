import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { marked } from 'marked'
import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { markLessonComplete } from '@/actions/progress'
import CourseNav from '@/components/CourseNav'

type Props = {
  params: Promise<{ slug: string; lessonId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lessonId } = await params
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, module: { course: { slug } } },
    select: { title: true },
  })
  return { title: lesson?.title ?? 'Lesson' }
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonId } = await params
  const session = await verifySession()

  const [course, lesson] = await Promise.all([
    prisma.course.findUnique({
      where: { slug, published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        modules: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            lessons: {
              orderBy: { order: 'asc' },
              select: { id: true, title: true },
            },
            quizzes: {
              select: { id: true, title: true },
            },
          },
        },
      },
    }),
    prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, title: true, content: true, videoUrl: true, moduleId: true },
    }),
  ])

  if (!course || !lesson) notFound()

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    select: { id: true },
  })
  if (!enrollment) redirect(`/courses/${slug}`)

  // Mixed flat sequence: lessons then quiz per module — drives prev/next navigation
  type Item = { type: 'lesson' | 'quiz'; id: string; title: string }
  const allItems: Item[] = course.modules.flatMap((m) => [
    ...m.lessons.map((l) => ({ type: 'lesson' as const, id: l.id, title: l.title })),
    ...m.quizzes.map((q) => ({ type: 'quiz' as const, id: q.id, title: q.title })),
  ])

  const currentIndex = allItems.findIndex((i) => i.type === 'lesson' && i.id === lessonId)
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null

  function itemHref(item: Item) {
    return item.type === 'lesson'
      ? `/learn/${slug}/${item.id}`
      : `/learn/${slug}/quiz/${item.id}`
  }

  const currentModule = course.modules.find((m) => m.id === lesson.moduleId)

  // Completion / quiz attempt state for sidebar and footer
  const [completedRecords, quizAttemptRecords] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: {
        userId: session.user.id,
        completed: true,
        lesson: { module: { courseId: course.id } },
      },
      select: { lessonId: true },
    }),
    prisma.quizAttempt.findMany({
      where: {
        userId: session.user.id,
        quiz: { module: { courseId: course.id } },
      },
      select: { quizId: true, passed: true },
    }),
  ])

  const completedLessonIds = new Set(completedRecords.map((lp) => lp.lessonId))
  const passedQuizIds = new Set(quizAttemptRecords.filter((a) => a.passed).map((a) => a.quizId))
  const attemptedQuizIds = new Set(quizAttemptRecords.map((a) => a.quizId))
  const isComplete = completedLessonIds.has(lessonId)

  const contentHtml = lesson.content ? marked(lesson.content, { async: false }) : ''

  const nextHref = nextItem ? itemHref(nextItem) : ''
  const nextLabel =
    nextItem?.type === 'quiz'
      ? 'Mark complete & take quiz →'
      : nextItem
        ? 'Mark complete & continue →'
        : 'Complete course →'

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-14 flex items-center gap-3 px-4 sm:px-6 shrink-0">
        <Link
          href="/dashboard"
          className="text-sm text-slate-500 hover:text-slate-900 transition-colors shrink-0 flex items-center gap-1"
        >
          ←<span className="hidden sm:inline ml-1">Dashboard</span>
        </Link>
        <p className="flex-1 min-w-0 text-sm font-medium text-slate-700 truncate text-center">
          {course.title}
        </p>
        <p
          className="text-xs text-slate-400 shrink-0 tabular-nums"
          aria-label={`Item ${currentIndex + 1} of ${allItems.length}`}
        >
          {currentIndex + 1}/{allItems.length}
        </p>
      </header>

      <div className="flex flex-1 min-h-0">

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <aside
          className="hidden lg:block w-64 xl:w-72 shrink-0 border-r border-slate-200 bg-slate-50 sticky top-14 overflow-y-auto"
          style={{ height: 'calc(100vh - 3.5rem)' }}
        >
          <CourseNav
            slug={slug}
            modules={course.modules}
            completedLessonIds={completedLessonIds}
            passedQuizIds={passedQuizIds}
            attemptedQuizIds={attemptedQuizIds}
            currentLessonId={lessonId}
          />
        </aside>

        {/* ── Main ──────────────────────────────────────────────────────────── */}
        <main id="main-content" className="flex-1 min-w-0 flex flex-col">
          <div className="lg:hidden bg-slate-50 border-b border-slate-100 px-4 py-2 text-xs text-slate-500">
            {currentModule?.title} &rsaquo; {lesson.title}
          </div>

          <div className="flex-1 px-5 sm:px-10 py-10 max-w-3xl mx-auto w-full">
            <div className="mb-8">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                {currentModule?.title}
              </p>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                {lesson.title}
              </h1>
              {isComplete && (
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-full">
                  <span aria-hidden="true">✓</span> Completed
                </span>
              )}
            </div>

            {lesson.videoUrl && (
              <div
                className="mb-8 aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center gap-3 select-none"
                role="img"
                aria-label="Video lesson — video player will appear here"
              >
                <span className="text-5xl text-white opacity-50" aria-hidden="true">▶</span>
                <p className="text-sm text-slate-400">Video content</p>
              </div>
            )}

            {contentHtml && (
              <div className="lesson-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            )}
          </div>

          {/* ── Footer ────────────────────────────────────────────────────────── */}
          <footer className="shrink-0 border-t border-slate-200 bg-white px-5 sm:px-10 py-4 flex items-center justify-between gap-4">
            {prevItem ? (
              <Link
                href={itemHref(prevItem)}
                className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                aria-label={`Previous: ${prevItem.title}`}
              >
                ← Previous
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}

            {isComplete ? (
              nextItem ? (
                <Link
                  href={itemHref(nextItem)}
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                  aria-label={`Next: ${nextItem.title}`}
                >
                  {nextItem.type === 'quiz' ? 'Take quiz →' : 'Next lesson →'}
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                >
                  Back to dashboard →
                </Link>
              )
            ) : (
              <form action={markLessonComplete}>
                <input type="hidden" name="lessonId" value={lesson.id} />
                <input type="hidden" name="courseSlug" value={slug} />
                <input type="hidden" name="nextHref" value={nextHref} />
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                >
                  {nextLabel}
                </button>
              </form>
            )}
          </footer>
        </main>
      </div>
    </div>
  )
}
