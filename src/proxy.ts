import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { Role } from '@prisma/client'

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl
  const role = req.auth?.user?.role as Role | undefined

  // Redirect authenticated users away from auth pages
  if (pathname === '/login' || pathname === '/register') {
    if (req.auth) {
      if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin', req.nextUrl))
      if (role === 'INSTRUCTOR') return NextResponse.redirect(new URL('/instructor', req.nextUrl))
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
    return
  }

  // Admin routes — ADMIN only
  if (pathname.startsWith('/admin')) {
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    return
  }

  // Instructor routes — INSTRUCTOR or ADMIN
  if (pathname.startsWith('/instructor')) {
    if (role !== 'INSTRUCTOR' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    return
  }

  // Dashboard + lesson player — any authenticated user
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/learn')) {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    return
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$).*)'],
}
