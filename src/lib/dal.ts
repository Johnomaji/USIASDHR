import 'server-only'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import type { Role } from '@prisma/client'

export const getSession = cache(async () => {
  return auth()
})

export const verifySession = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  return session
})

export const verifyRole = cache(async (allowedRoles: Role[]) => {
  const session = await verifySession()
  if (!allowedRoles.includes(session.user.role)) redirect('/')
  return session
})
