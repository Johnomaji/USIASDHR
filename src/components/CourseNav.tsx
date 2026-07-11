import Link from 'next/link'

type NavLesson = { id: string; title: string }
type NavQuiz = { id: string; title: string }

export type NavModule = {
  id: string
  title: string
  lessons: NavLesson[]
  quizzes: NavQuiz[]
}

type Props = {
  slug: string
  modules: NavModule[]
  completedLessonIds: Set<string>
  passedQuizIds: Set<string>
  attemptedQuizIds: Set<string>
  currentLessonId?: string
  currentQuizId?: string
}

export default function CourseNav({
  slug,
  modules,
  completedLessonIds,
  passedQuizIds,
  attemptedQuizIds,
  currentLessonId,
  currentQuizId,
}: Props) {
  return (
    <nav className="p-4 pb-8" aria-label="Course navigation">
      {modules.map((mod) => (
        <div key={mod.id} className="mb-6">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2 px-2">
            {mod.title}
          </p>
          <ul className="space-y-0.5 list-none m-0 p-0">
            {mod.lessons.map((l) => {
              const done = completedLessonIds.has(l.id)
              const current = l.id === currentLessonId
              return (
                <li key={l.id}>
                  <Link
                    href={`/learn/${slug}/${l.id}`}
                    aria-current={current ? 'page' : undefined}
                    className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors ${
                      current
                        ? 'bg-primary-100 text-primary-800 font-medium'
                        : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <Indicator done={done} active={current} />
                    <span className="leading-snug">{l.title}</span>
                  </Link>
                </li>
              )
            })}

            {mod.quizzes.map((q) => {
              const passed = passedQuizIds.has(q.id)
              const attempted = attemptedQuizIds.has(q.id)
              const failed = attempted && !passed
              const current = q.id === currentQuizId
              return (
                <li key={q.id}>
                  <Link
                    href={`/learn/${slug}/quiz/${q.id}`}
                    aria-current={current ? 'page' : undefined}
                    className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors ${
                      current
                        ? 'bg-primary-100 text-primary-800 font-medium'
                        : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <Indicator done={passed} active={current} failed={failed} />
                    <span className="leading-snug flex-1">{q.title}</span>
                    <span
                      className="text-[10px] text-slate-400 shrink-0 ml-1"
                      aria-label="Quiz"
                    >
                      Quiz
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function Indicator({
  done,
  active,
  failed = false,
}: {
  done: boolean
  active: boolean
  failed?: boolean
}) {
  return (
    <span
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 text-[9px] font-bold transition-colors ${
        done
          ? 'bg-primary-600 border-primary-600 text-white'
          : failed
            ? 'bg-rose-100 border-rose-400 text-rose-600'
            : active
              ? 'border-primary-400 bg-white'
              : 'border-slate-300 bg-white'
      }`}
      aria-hidden="true"
    >
      {done ? '✓' : failed ? '✗' : ''}
    </span>
  )
}
