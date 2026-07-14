function Bone({ className }: { className: string }) {
  return <div className={`bg-slate-200 animate-pulse rounded-lg ${className}`} />
}

function EnrollmentCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
      <Bone className="h-3 w-16" />
      <Bone className="h-5 w-3/4" />
      <Bone className="h-3 w-full" />
      <div className="flex items-center gap-3 pt-1">
        <Bone className="h-1.5 flex-1 rounded-full" />
        <Bone className="h-3 w-8" />
      </div>
      <Bone className="h-9 w-full rounded-lg" />
    </div>
  )
}

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Bone className="h-8 w-48 mb-8" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl px-6 py-5 space-y-2">
            <Bone className="h-3 w-20" />
            <Bone className="h-8 w-12" />
          </div>
        ))}
      </div>

      {/* Enrollments */}
      <Bone className="h-5 w-40 mb-4" />
      <div className="grid sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <EnrollmentCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
