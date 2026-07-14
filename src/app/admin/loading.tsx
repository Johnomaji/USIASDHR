function Bone({ className }: { className: string }) {
  return <div className={`bg-slate-200 animate-pulse rounded-lg ${className}`} />
}

export default function AdminLoading() {
  return (
    <div>
      <Bone className="h-8 w-48 mb-6" />
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Bone key={i} className="h-3 w-20" />
          ))}
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-6">
              <Bone className="h-4 w-40" />
              <Bone className="h-4 w-24" />
              <Bone className="h-5 w-16 rounded-full" />
              <Bone className="h-4 w-20" />
              <Bone className="h-4 w-16 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
