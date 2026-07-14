'use client'

import { useState, useActionState } from 'react'
import { updateCoursePricing } from '@/actions/admin'

type Props = {
  courseId: string
  initialIsFree: boolean
  initialPrice: number | null
}

export default function PricingForm({ courseId, initialIsFree, initialPrice }: Props) {
  const [isFree, setIsFree] = useState(initialIsFree)
  const [state, formAction] = useActionState(updateCoursePricing, null)

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="isFree" value={String(isFree)} />

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-slate-700">Pricing type</legend>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="_pricing"
            value="free"
            checked={isFree}
            onChange={() => setIsFree(true)}
            className="accent-primary-600"
          />
          <span className="text-sm text-slate-700">Free — anyone can enroll at no cost</span>
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
          <span className="text-sm text-slate-700">Paid — students pay before enrolling</span>
        </label>
      </fieldset>

      {!isFree && (
        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Price (NGN)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">₦</span>
            <input
              id="price"
              type="number"
              name="price"
              min="100"
              step="100"
              defaultValue={initialPrice ?? ''}
              required={!isFree}
              placeholder="5000"
              className="w-40 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">Minimum ₦100. Charged in Nigerian Naira via Paystack.</p>
        </div>
      )}

      {state?.error && (
        <p className="text-sm text-red-600" aria-live="polite">{state.error}</p>
      )}

      <button
        type="submit"
        className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
      >
        Save pricing
      </button>
    </form>
  )
}
