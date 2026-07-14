'use client'

import { useEffect, useRef } from 'react'

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) ref.current?.pause()
  }, [])

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/human%20rights%20videos/12.mp4" type="video/mp4" />
    </video>
  )
}
