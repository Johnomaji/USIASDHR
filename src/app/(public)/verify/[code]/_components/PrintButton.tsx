'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors print:hidden"
    >
      Print certificate
    </button>
  )
}
