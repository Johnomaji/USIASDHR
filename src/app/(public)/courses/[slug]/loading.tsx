function Bone({ className }: { className: string }) {
  return <div className={`bg-slate-200 animate-pulse rounded-lg ${className}`} />
}

export default function CourseDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-3 lg:gap-12">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <Bone className="h-3 w-32" />
          <Bone className="h-8 w-3/4" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-2/3" />
          <Bone className="h-3 w-40 mt-2" />

          <div className="mt-10 space-y-3">
            <Bone className="h-6 w-48" />
            <Bone className="h-3 w-32" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Bone key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="mt-10 lg:mt-0">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <Bone className="h-8 w-24" />
            <Bone className="h-3 w-40" />
            <Bone className="h-12 w-full rounded-lg" />
            <div className="space-y-2 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Bone key={i} className="h-3 w-48" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
