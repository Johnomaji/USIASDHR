import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { submitQuiz } from '@/actions/quiz'
import CourseNav from '@/components/CourseNav'

type Props = {
  params: Promise<{ slug: string; quizId: string }>
  searchParams: Promise<{ attempt?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, quizId } = await params
  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, module: { course: { slug } } },
    select: { title: true },
  })
  return { title: quiz?.title ?? 'Quiz' }
}

export default async function QuizPage({ params, searchParams }: Props) {
  const { slug, quizId } = await params
  const { attempt: attemptId } = await searchParams
  const session = await verifySession()

  // Course + sidebar data
  const course = await prisma.course.findUnique({
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
          lessons: { orderBy: { order: 'asc' }, select: { id: true, title: true } },
          quizzes: { select: { id: true, title: true } },
        },
      },
    },
  })
  if (!course) notFound()

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    select: { id: true },
  })
  if (!enrollment) redirect(`/courses/${slug}`)

  // Sidebar completion state
  const [completedLessons, quizAttempts] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: {
        userId: session.user.id,
        completed: true,
        lesson: { module: { courseId: course.id } },
      },
      select: { lessonId: true },
    }),
    prisma.quizAttempt.findMany({
      where: { userId: session.user.id, quiz: { module: { courseId: course.id } } },
      select: { quizId: true, passed: true },
    }),
  ])

  const completedLessonIds = new Set(completedLessons.map((lp) => lp.lessonId))
  const passedQuizIds = new Set(quizAttempts.filter((a) => a.passed).map((a) => a.quizId))
  const attemptedQuizIds = new Set(quizAttempts.map((a) => a.quizId))

  // ── Results view ────────────────────────────────────────────────────────────
  if (attemptId) {
    const attempt = await prisma.quizAttempt.findFirst({
      where: { id: attemptId, userId: session.user.id, quizId },
      select: {
        score: true,
        passed: true,
        quiz: {
          select: {
            title: true,
            passingScore: true,
            maxAttempts: true,
            questions: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                text: true,
                order: true,
                options: { select: { id: true, text: true, isCorrect: true } },
              },
            },
          },
        },
        answers: { select: { questionId: true, optionId: true } },
      },
    })

    if (!attempt) redirect(`/learn/${slug}/quiz/${quizId}`)

    const answerMap = new Map(attempt.answers.map((a) => [a.questionId, a.optionId]))
    const totalAttemptsUsed = quizAttempts.filter((a) => a.quizId === quizId).length
    const canRetake = totalAttemptsUsed < attempt.quiz.maxAttempts && !attempt.passed

    // What comes after this quiz in the mixed sequence
    type Item = { type: 'lesson' | 'quiz'; id: string }
    const allItems: Item[] = course.modules.flatMap((m) => [
      ...m.lessons.map((l) => ({ type: 'lesson' as const, id: l.id })),
      ...m.quizzes.map((q) => ({ type: 'quiz' as const, id: q.id })),
    ])
    const quizIndex = allItems.findIndex((i) => i.type === 'quiz' && i.id === quizId)
    const nextItem = quizIndex < allItems.length - 1 ? allItems[quizIndex + 1] : null
    const nextHref = nextItem
      ? nextItem.type === 'lesson'
        ? `/learn/${slug}/${nextItem.id}`
        : `/learn/${slug}/quiz/${nextItem.id}`
      : '/dashboard'

    return (
      <QuizShell
        courseTitle={course.title}
        slug={slug}
        quizId={quizId}
        modules={course.modules}
        completedLessonIds={completedLessonIds}
        passedQuizIds={passedQuizIds}
        attemptedQuizIds={attemptedQuizIds}
      >
        {/* Score card */}
        <div
          className={`rounded-2xl p-8 mb-10 text-center ${
            attempt.passed
              ? 'bg-emerald-50 border border-emerald-200'
              : 'bg-rose-50 border border-rose-200'
          }`}
          role="status"
          aria-live="polite"
        >
          <p
            className={`text-5xl font-bold mb-2 ${
              attempt.passed ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {attempt.score}%
          </p>
          <p
            className={`text-lg font-semibold ${
              attempt.passed ? 'text-emerald-800' : 'text-rose-800'
            }`}
          >
            {attempt.passed ? '✓ Passed' : '✗ Not passed'}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Passing score: {attempt.quiz.passingScore}% &middot; Attempt{' '}
            {totalAttemptsUsed} of {attempt.quiz.maxAttempts}
          </p>
        </div>

        {/* Answer review */}
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Review</h2>
        <ol className="space-y-8 list-none p-0 m-0 mb-10">
          {attempt.quiz.questions.map((q) => {
            const selectedId = answerMap.get(q.id)
            return (
              <li key={q.id}>
                <p className="font-semibold text-slate-900 mb-3">
                  {q.order}. {q.text}
                </p>
                <ul className="space-y-2 list-none p-0 m-0">
                  {q.options.map((opt) => {
                    const isSelected = opt.id === selectedId
                    const isCorrect = opt.isCorrect

                    const bg =
                      isSelected && isCorrect
                        ? 'bg-emerald-50 border-emerald-300'
                        : isSelected && !isCorrect
                          ? 'bg-rose-50 border-rose-300'
                          : !isSelected && isCorrect
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-white border-slate-200'

                    return (
                      <li
                        key={opt.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${bg}`}
                      >
                        <span
                          className={`shrink-0 font-bold w-4 text-center mt-0.5 ${
                            isSelected && isCorrect
                              ? 'text-emerald-700'
                              : isSelected && !isCorrect
                                ? 'text-rose-700'
                                : !isSelected && isCorrect
                                  ? 'text-emerald-600'
                                  : 'text-slate-300'
                          }`}
                          aria-hidden="true"
                        >
                          {isSelected && isCorrect
                            ? '✓'
                            : isSelected && !isCorrect
                              ? '✗'
                              : isCorrect
                                ? '✓'
                                : ''}
                        </span>
                        <span
                          className={
                            isSelected ? 'text-slate-900' : isCorrect ? 'text-slate-700' : 'text-slate-400'
                          }
                        >
                          {isSelected && isCorrect && (
                            <span className="sr-only">Your answer — correct: </span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="sr-only">Your answer — incorrect: </span>
                          )}
                          {!isSelected && isCorrect && (
                            <span className="sr-only">Correct answer: </span>
                          )}
                          {opt.text}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ol>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {canRetake && (
            <Link
              href={`/learn/${slug}/quiz/${quizId}`}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Retake quiz
            </Link>
          )}
          <Link
            href={nextHref}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            {nextItem ? 'Continue →' : 'Back to dashboard →'}
          </Link>
        </div>
      </QuizShell>
    )
  }

  // ── Quiz form view ────────────────────────────────────────────────────────
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      id: true,
      title: true,
      passingScore: true,
      maxAttempts: true,
      questions: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          text: true,
          order: true,
          // isCorrect deliberately omitted — never sent to client
          options: { select: { id: true, text: true } },
        },
      },
    },
  })
  if (!quiz) notFound()

  const existingCount = quizAttempts.filter((a) => a.quizId === quizId).length
  const hasPassed = passedQuizIds.has(quizId)
  const attemptsExhausted = existingCount >= quiz.maxAttempts

  return (
    <QuizShell
      courseTitle={course.title}
      slug={slug}
      quizId={quizId}
      modules={course.modules}
      completedLessonIds={completedLessonIds}
      passedQuizIds={passedQuizIds}
      attemptedQuizIds={attemptedQuizIds}
    >
      {/* Quiz header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Module quiz
        </p>
        <h1 className="text-2xl font-bold text-slate-900">{quiz.title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Passing score: {quiz.passingScore}% &middot; {quiz.questions.length} question
          {quiz.questions.length !== 1 ? 's' : ''} &middot; Attempt{' '}
          {existingCount + 1} of {quiz.maxAttempts}
        </p>
      </div>

      {hasPassed ? (
        <div
          className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center"
          role="status"
        >
          <p className="text-emerald-800 font-semibold text-lg">✓ You&apos;ve passed this quiz!</p>
          <p className="mt-1 text-sm text-slate-600">
            You can still retake it if you&apos;d like.
          </p>
        </div>
      ) : attemptsExhausted ? (
        <div
          className="rounded-xl bg-slate-100 border border-slate-200 p-6 text-center"
          role="status"
        >
          <p className="text-slate-800 font-semibold">Maximum attempts reached</p>
          <p className="mt-1 text-sm text-slate-600">
            You&apos;ve used all {quiz.maxAttempts} attempts for this quiz.
          </p>
          <Link
            href={`/courses/${slug}`}
            className="mt-4 inline-block text-sm text-primary-700 hover:text-primary-800 font-medium"
          >
            Return to course →
          </Link>
        </div>
      ) : (
        <form action={submitQuiz}>
          <input type="hidden" name="quizId" value={quiz.id} />
          <input type="hidden" name="courseSlug" value={slug} />

          <ol className="space-y-10 list-none p-0 m-0 mb-10">
            {quiz.questions.map((q) => (
              <li key={q.id}>
                <fieldset>
                  <legend className="text-base font-semibold text-slate-900 mb-4">
                    {q.order}. {q.text}
                  </legend>
                  <div className="space-y-3">
                    {q.options.map((opt, oi) => (
                      <label
                        key={opt.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:bg-primary-50 has-[:checked]:border-primary-300"
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt.id}
                          required={oi === 0}
                          className="mt-0.5 w-4 h-4 shrink-0 text-primary-600 border-slate-300 focus:ring-primary-500"
                        />
                        <span className="text-sm text-slate-700 leading-relaxed">
                          {opt.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </li>
            ))}
          </ol>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            Submit quiz
          </button>
        </form>
      )}
    </QuizShell>
  )
}

// ── Shared shell ──────────────────────────────────────────────────────────────

type ShellProps = {
  courseTitle: string
  slug: string
  quizId: string
  modules: Parameters<typeof CourseNav>[0]['modules']
  completedLessonIds: Set<string>
  passedQuizIds: Set<string>
  attemptedQuizIds: Set<string>
  children: React.ReactNode
}

function QuizShell({
  courseTitle,
  slug,
  quizId,
  modules,
  completedLessonIds,
  passedQuizIds,
  attemptedQuizIds,
  children,
}: ShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-14 flex items-center gap-3 px-4 sm:px-6 shrink-0">
        <Link
          href="/dashboard"
          className="text-sm text-slate-500 hover:text-slate-900 transition-colors shrink-0 flex items-center gap-1"
        >
          ←<span className="hidden sm:inline ml-1">Dashboard</span>
        </Link>
        <p className="flex-1 min-w-0 text-sm font-medium text-slate-700 truncate text-center">
          {courseTitle}
        </p>
        <span className="text-xs text-slate-400 shrink-0">Quiz</span>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside
          className="hidden lg:block w-64 xl:w-72 shrink-0 border-r border-slate-200 bg-slate-50 sticky top-14 overflow-y-auto"
          style={{ height: 'calc(100vh - 3.5rem)' }}
        >
          <CourseNav
            slug={slug}
            modules={modules}
            completedLessonIds={completedLessonIds}
            passedQuizIds={passedQuizIds}
            attemptedQuizIds={attemptedQuizIds}
            currentQuizId={quizId}
          />
        </aside>

        <main id="main-content" className="flex-1 min-w-0 px-5 sm:px-10 py-10">
          <div className="max-w-2xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
