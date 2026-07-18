'use client'

import { useState, useActionState } from 'react'
import { createCourse } from '@/actions/admin'

type Instructor = { id: string; name: string; email: string }

type Props = { instructors: Instructor[] }

const inputClass =
  'w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50'

const fieldError = (msgs: string[] | undefined) =>
  msgs ? <p className="mt-1.5 text-xs text-red-600">{msgs[0]}</p> : null

export default function NewCourseForm({ instructors }: Props) {
  const [state, formAction, pending] = useActionState(createCourse, null)
  const [isFree, setIsFree] = useState(true)

  return (
    <form action={formAction} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Title
        </label>
        <input
          id="title"
          type="text"
          name="title"
          required
          disabled={pending}
          aria-invalid={!!state?.errors?.title}
          className={inputClass}
        />
        {fieldError(state?.errors?.title)}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          disabled={pending}
          aria-invalid={!!state?.errors?.description}
          className={inputClass}
        />
        {fieldError(state?.errors?.description)}
      </div>

      {/* Cover image */}
      <div>
        <label htmlFor="coverImage" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Cover image URL{' '}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="coverImage"
          type="url"
          name="coverImage"
          disabled={pending}
          placeholder="https://example.com/image.jpg"
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Paste a direct image URL. Shown on course cards and the detail page.
        </p>
      </div>

      {/* Category + Level */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Category
          </label>
          <input
            id="category"
            type="text"
            name="category"
            placeholder="e.g. Human Rights"
            required
            disabled={pending}
            aria-invalid={!!state?.errors?.category}
            className={inputClass}
          />
          {fieldError(state?.errors?.category)}
        </div>
        <div>
          <label htmlFor="level" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Level
          </label>
          <select id="level" name="level" disabled={pending} className={inputClass}>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Instructor */}
      <div>
        <label htmlFor="instructorId" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Instructor
        </label>
        <select
          id="instructorId"
          name="instructorId"
          required
          disabled={pending}
          aria-invalid={!!state?.errors?.instructorId}
          className={inputClass}
        >
          <option value="">Select an instructor…</option>
          {instructors.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name} ({i.email})
            </option>
          ))}
        </select>
        {fieldError(state?.errors?.instructorId)}
      </div>

      {/* Pricing */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-slate-700">Pricing</legend>
        <input type="hidden" name="isFree" value={String(isFree)} />
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="_pricing"
            value="free"
            checked={isFree}
            onChange={() => setIsFree(true)}
            className="accent-primary-600"
          />
          <span className="text-sm text-slate-700">Free</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="_pricing"
            value="paid"
            checked={!isFree}
            onChange={() => setIsFree(false)}
            className="accent-primary-600"
          />
          <span className="text-sm text-slate-700">Paid</span>
        </label>
        {!isFree && (
          <div className="pl-7">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">₦</span>
              <input
                type="number"
                name="price"
                min="100"
                step="100"
                required={!isFree}
                placeholder="5000"
                disabled={pending}
                className="w-36 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            {fieldError(state?.errors?.price)}
            <p className="mt-1.5 text-xs text-slate-400">Minimum ₦100.</p>
          </div>
        )}
      </fieldset>

      {/* Published */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="published"
          disabled={pending}
          className="accent-primary-600 w-4 h-4"
        />
        <span className="text-sm text-slate-700">Publish immediately</span>
      </label>

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
        {pending ? 'Creating…' : 'Create course'}
      </button>
    </form>
  )
}
