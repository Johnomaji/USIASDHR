function Bone({ className }: { className: string }) {
  return <div className={`bg-slate-200 animate-pulse rounded-lg ${className}`} />
}

function CourseCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
      <Bone className="h-3 w-20" />
      <Bone className="h-5 w-3/4" />
      <Bone className="h-3 w-full" />
      <Bone className="h-3 w-5/6" />
      <Bone className="h-3 w-2/3" />
      <div className="pt-2 flex items-center justify-between">
        <Bone className="h-3 w-24" />
        <Bone className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}

export default function CoursesLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <Bone className="h-8 w-40" />
        <Bone className="h-10 flex-1 max-w-sm" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
