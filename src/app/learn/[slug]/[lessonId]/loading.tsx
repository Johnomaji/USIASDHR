function Bone({ className }: { className: string }) {
  return <div className={`bg-slate-200 animate-pulse rounded-lg ${className}`} />
}

export default function LessonLoading() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-200 bg-white p-4 space-y-3">
        <Bone className="h-5 w-3/4" />
        <Bone className="h-3 w-1/2" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Bone key={i} className="h-8 w-full" />
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-10 space-y-6 max-w-3xl">
        <Bone className="h-4 w-32" />
        <Bone className="h-7 w-2/3" />
        {/* Video placeholder */}
        <Bone className="w-full aspect-video rounded-xl" />
        {/* Content lines */}
        <div className="space-y-3 pt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Bone key={i} className={`h-3 ${i % 4 === 3 ? 'w-2/3' : 'w-full'}`} />
          ))}
        </div>
      </main>
    </div>
  )
}
