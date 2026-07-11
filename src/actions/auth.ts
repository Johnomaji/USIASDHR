'use server'

import { signIn, signOut } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { AuthError } from 'next-auth'

// ── Register ─────────────────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(2, { error: 'Name must be at least 2 characters.' }).trim(),
  email: z.email({ error: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters.' })
    .regex(/[A-Z]/, { error: 'Must contain at least one uppercase letter.' })
    .regex(/[0-9]/, { error: 'Must contain at least one number.' }),
})

export type RegisterState =
  | {
      errors?: { name?: string[]; email?: string[]; password?: string[] }
      error?: string
    }
  | undefined

export async function register(
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const result = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { name, email, password } = result.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { errors: { email: ['An account with this email already exists.'] } }
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: { name, email, hashedPassword, role: 'STUDENT' },
  })

  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Account created but sign-in failed. Please sign in manually.' }
    }
    throw error
  }
}

// ── Login ─────────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address.' }),
  password: z.string().min(1, { error: 'Password is required.' }),
})

export type LoginState =
  | {
      errors?: { email?: string[]; password?: string[] }
      error?: string
    }
  | undefined

export async function login(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const result = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  try {
    await signIn('credentials', {
      email: result.data.email,
      password: result.data.password,
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password. Please try again.' }
        default:
          return { error: 'Something went wrong. Please try again.' }
      }
    }
    throw error
  }
}

// ── Logout ───────────────────────────────────────────────────────────────────

export async function logout() {
  await signOut({ redirectTo: '/' })
}
