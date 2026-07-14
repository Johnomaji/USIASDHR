'use client'

import { useActionState } from 'react'
import { updateLesson } from '@/actions/admin'

type Props = {
  lessonId: string
  courseId: string
  initialTitle: string
  initialVideoUrl: string | null
  initialContent: string | null
}

const inputClass =
  'w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50'

export default function LessonForm({
  lessonId,
  courseId,
  initialTitle,
  initialVideoUrl,
  initialContent,
}: Props) {
  const [state, formAction, pending] = useActionState(updateLesson, null)

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="courseId" value={courseId} />

      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Title
        </label>
        <input
          id="title"
          type="text"
          name="title"
          defaultValue={initialTitle}
          required
          disabled={pending}
          className={inputClass}
        />
        {state?.error && !state.error.toLowerCase().includes('video') && (
          <p className="mt-1.5 text-xs text-red-600" aria-live="polite">
            {state.error}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="videoUrl" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Video URL
        </label>
        <input
          id="videoUrl"
          type="text"
          name="videoUrl"
          defaultValue={initialVideoUrl ?? ''}
          placeholder="e.g. 123456789 or vimeo.com/123456789"
          disabled={pending}
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Accepts a Vimeo video ID, a vimeo.com URL, or a full player embed URL. Leave blank for no video.
        </p>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Content{' '}
          <span className="font-normal text-slate-400">(Markdown)</span>
        </label>
        <textarea
          id="content"
          name="content"
          defaultValue={initialContent ?? ''}
          rows={22}
          disabled={pending}
          className={`${inputClass} font-mono resize-y`}
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600" aria-live="polite">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Save lesson'}
      </button>
    </form>
  )
}
