import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { updateQuiz, deleteQuiz, addQuestion, deleteQuestion } from '@/actions/admin'

type Props = { params: Promise<{ id: string; quizId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { quizId } = await params
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, select: { title: true } })
  return { title: quiz ? `Quiz: ${quiz.title}` : 'Not Found' }
}

const inputClass =
  'w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

export default async function QuizEditorPage({ params }: Props) {
  const { id: courseId, quizId } = await params

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      id: true,
      title: true,
      passingScore: true,
      maxAttempts: true,
      module: {
        select: {
          courseId: true,
          course: { select: { title: true } },
        },
      },
      questions: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          text: true,
          order: true,
          options: {
            select: { id: true, text: true, isCorrect: true },
          },
        },
      },
    },
  })

  if (!quiz || quiz.module.courseId !== courseId) notFound()

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/admin/courses" className="hover:text-slate-700 transition-colors">
          Courses
        </Link>
        <span>/</span>
        <Link
          href={`/admin/courses/${courseId}/lessons`}
          className="hover:text-slate-700 transition-colors"
        >
          {quiz.module.course.title}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate">{quiz.title}</span>
      </nav>

      <div className="flex items-start justify-between mb-8">
        <h1 className="text-xl font-bold text-slate-900">{quiz.title}</h1>
        <form action={deleteQuiz}>
          <input type="hidden" name="quizId" value={quizId} />
          <input type="hidden" name="courseId" value={courseId} />
          <button
            type="submit"
            className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Delete quiz
          </button>
        </form>
      </div>

      {/* Quiz settings */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-slate-700 mb-5">Settings</h2>
        <form action={updateQuiz} className="space-y-4">
          <input type="hidden" name="quizId" value={quizId} />
          <input type="hidden" name="courseId" value={courseId} />

          <div>
            <label htmlFor="quiz-title" className="block text-sm font-medium text-slate-700 mb-1.5">
              Title
            </label>
            <input
              id="quiz-title"
              type="text"
              name="title"
              defaultValue={quiz.title}
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="passingScore"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Passing score (%)
              </label>
              <input
                id="passingScore"
                type="number"
                name="passingScore"
                defaultValue={quiz.passingScore}
                min="1"
                max="100"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="maxAttempts"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Max attempts
              </label>
              <input
                id="maxAttempts"
                type="number"
                name="maxAttempts"
                defaultValue={quiz.maxAttempts}
                min="1"
                required
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Save settings
          </button>
        </form>
      </section>

      {/* Questions */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">
          Questions ({quiz.questions.length})
        </h2>

        {quiz.questions.length === 0 ? (
          <p className="text-sm text-slate-400 mb-4">No questions yet — add one below.</p>
        ) : (
          <div className="space-y-3 mb-4">
            {quiz.questions.map((q) => {
              const correctOption = q.options.find((o) => o.isCorrect)
              return (
                <div
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-xl px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm font-medium text-slate-900">
                      {q.order}. {q.text}
                    </p>
                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        href={`/admin/courses/${courseId}/quizzes/${quizId}/questions/${q.id}`}
                        className="text-xs font-medium text-primary-700 hover:text-primary-800 transition-colors"
                      >
                        Edit →
                      </Link>
                      <form action={deleteQuestion}>
                        <input type="hidden" name="questionId" value={q.id} />
                        <input type="hidden" name="quizId" value={quizId} />
                        <input type="hidden" name="courseId" value={courseId} />
                        <button
                          type="submit"
                          className="text-xs text-red-500 hover:text-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>

                  {q.options.length > 0 ? (
                    <ul className="space-y-1 list-none p-0 m-0">
                      {q.options.map((opt) => (
                        <li
                          key={opt.id}
                          className={`text-xs flex items-center gap-2 ${
                            opt.isCorrect ? 'text-emerald-700 font-medium' : 'text-slate-500'
                          }`}
                        >
                          <span aria-hidden="true">{opt.isCorrect ? '✓' : '○'}</span>
                          {opt.text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-amber-600">No options — click Edit to add some.</p>
                  )}

                  {q.options.length > 0 && !correctOption && (
                    <p className="text-xs text-amber-600 mt-2">
                      No correct answer set — click Edit to mark one.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Add question */}
        <details className="bg-white border border-dashed border-slate-300 rounded-xl overflow-hidden">
          <summary className="flex items-center gap-2 px-5 py-3 cursor-pointer text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true">+</span> Add question
          </summary>
          <form action={addQuestion} className="px-5 pb-5 pt-3 border-t border-slate-100 space-y-3">
            <input type="hidden" name="quizId" value={quizId} />
            <input type="hidden" name="courseId" value={courseId} />
            <textarea
              name="text"
              required
              rows={3}
              placeholder="Enter question text…"
              className={inputClass}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add question →
            </button>
          </form>
        </details>
      </section>
    </div>
  )
}
