'use client'

import { useEffect, useRef } from 'react'

export default function HeroVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches && wrapperRef.current) {
      wrapperRef.current.style.display = 'none'
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      aria-hidden="true"
    >
      <iframe
        src="https://player.vimeo.com/video/1209799381?background=1&autoplay=1&muted=1&loop=1&autopause=0"
        allow="autoplay; fullscreen"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto"
        style={{ aspectRatio: '16/9', minWidth: '177.78vh', minHeight: '56.25vw' }}
        title=""
      />
    </div>
  )
}
