'use client'

import { useTransition } from 'react'
import { toggleCoursePublished } from '@/actions/admin'

export default function PublishToggle({ courseId, published }: { courseId: string; published: boolean }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => toggleCoursePublished(courseId, !published))}
      className={`text-xs font-medium px-2.5 py-1 rounded transition-colors disabled:opacity-50 ${
        published
          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
      }`}
    >
      {pending ? '...' : published ? 'Unpublish' : 'Publish'}
    </button>
  )
}
