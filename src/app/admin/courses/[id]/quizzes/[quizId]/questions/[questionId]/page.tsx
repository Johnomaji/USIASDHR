import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { updateQuestion, addOption, deleteOption, setCorrectOption } from '@/actions/admin'

type Props = { params: Promise<{ id: string; quizId: string; questionId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { questionId } = await params
  const q = await prisma.question.findUnique({ where: { id: questionId }, select: { text: true } })
  return { title: q ? `Question: ${q.text.slice(0, 60)}` : 'Not Found' }
}

const inputClass =
  'w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

export default async function QuestionEditorPage({ params }: Props) {
  const { id: courseId, quizId, questionId } = await params

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: {
      id: true,
      text: true,
      order: true,
      quizId: true,
      quiz: {
        select: {
          id: true,
          title: true,
          module: {
            select: {
              courseId: true,
              course: { select: { title: true } },
            },
          },
        },
      },
      options: {
        select: { id: true, text: true, isCorrect: true },
      },
    },
  })

  if (
    !question ||
    question.quizId !== quizId ||
    question.quiz.module.courseId !== courseId
  )
    notFound()

  const correctCount = question.options.filter((o) => o.isCorrect).length

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
        <Link href="/admin/courses" className="hover:text-slate-700 transition-colors">
          Courses
        </Link>
        <span>/</span>
        <Link
          href={`/admin/courses/${courseId}/lessons`}
          className="hover:text-slate-700 transition-colors"
        >
          {question.quiz.module.course.title}
        </Link>
        <span>/</span>
        <Link
          href={`/admin/courses/${courseId}/quizzes/${quizId}`}
          className="hover:text-slate-700 transition-colors"
        >
          {question.quiz.title}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Question {question.order}</span>
      </nav>

      <h1 className="text-xl font-bold text-slate-900 mb-8">
        Question {question.order}
      </h1>

      {/* Question text */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Question text</h2>
        <form action={updateQuestion} className="space-y-4">
          <input type="hidden" name="questionId" value={questionId} />
          <input type="hidden" name="quizId" value={quizId} />
          <input type="hidden" name="courseId" value={courseId} />
          <textarea
            name="text"
            defaultValue={question.text}
            required
            rows={4}
            className={`${inputClass} resize-y`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Save text
          </button>
        </form>
      </section>

      {/* Options */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">
            Answer options ({question.options.length})
          </h2>
          {correctCount === 0 && question.options.length > 0 && (
            <span className="text-xs text-amber-600 font-medium">No correct answer set</span>
          )}
        </div>

        {question.options.length === 0 ? (
          <p className="text-sm text-slate-400 mb-4">No options yet — add some below.</p>
        ) : (
          <div className="space-y-2 mb-4">
            {question.options.map((opt) => (
              <div
                key={opt.id}
                className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${
                  opt.isCorrect
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Toggle correct */}
                <form action={setCorrectOption} className="shrink-0">
                  <input type="hidden" name="optionId" value={opt.id} />
                  <input type="hidden" name="questionId" value={questionId} />
                  <input type="hidden" name="quizId" value={quizId} />
                  <input type="hidden" name="courseId" value={courseId} />
                  <button
                    type="submit"
                    title={opt.isCorrect ? 'Correct answer' : 'Set as correct'}
                    aria-label={opt.isCorrect ? 'Correct answer' : 'Set as correct answer'}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                      opt.isCorrect
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300 text-slate-300 hover:border-emerald-400 hover:text-emerald-400'
                    }`}
                  >
                    {opt.isCorrect ? '✓' : '○'}
                  </button>
                </form>

                <span
                  className={`flex-1 ${
                    opt.isCorrect ? 'text-emerald-800 font-medium' : 'text-slate-700'
                  }`}
                >
                  {opt.text}
                </span>

                {/* Delete option */}
                <form action={deleteOption} className="shrink-0">
                  <input type="hidden" name="optionId" value={opt.id} />
                  <input type="hidden" name="questionId" value={questionId} />
                  <input type="hidden" name="quizId" value={quizId} />
                  <input type="hidden" name="courseId" value={courseId} />
                  <button
                    type="submit"
                    className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    aria-label={`Delete option: ${opt.text}`}
                  >
                    Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        {/* Add option */}
        <details className="bg-white border border-dashed border-slate-300 rounded-xl overflow-hidden">
          <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true">+</span> Add option
          </summary>
          <form
            action={addOption}
            className="flex items-center gap-3 px-4 pb-4 pt-3 border-t border-slate-100"
          >
            <input type="hidden" name="questionId" value={questionId} />
            <input type="hidden" name="quizId" value={quizId} />
            <input type="hidden" name="courseId" value={courseId} />
            <input
              type="text"
              name="text"
              required
              placeholder="Option text…"
              className={`${inputClass} flex-1`}
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors shrink-0"
            >
              Add
            </button>
          </form>
        </details>

        <p className="mt-3 text-xs text-slate-400">
          Click the circle button next to an option to mark it as the correct answer.
        </p>
      </section>

      <Link
        href={`/admin/courses/${courseId}/quizzes/${quizId}`}
        className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        ← Back to quiz
      </Link>
    </div>
  )
}
