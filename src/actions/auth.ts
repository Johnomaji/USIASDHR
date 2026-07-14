'use server'

import { signIn, signOut } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { AuthError } from 'next-auth'
import { randomBytes } from 'crypto'
import { redirect } from 'next/navigation'
import { sendPasswordResetEmail } from '@/lib/email'

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

// ── Forgot password ───────────────────────────────────────────────────────────

export type ForgotPasswordState = { success?: boolean; error?: string } | undefined

export async function forgotPassword(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()

  if (!email || !z.email().safeParse(email).success) {
    return { error: 'Enter a valid email address.' }
  }

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } })

  // Always return success — never reveal whether the email exists
  if (!user) return { success: true }

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

  const token = randomBytes(32).toString('hex')
  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
  })

  const resetUrl = `${process.env.APP_URL}/reset-password/${token}`
  await sendPasswordResetEmail(email, resetUrl)

  return { success: true }
}

// ── Reset password ────────────────────────────────────────────────────────────

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters.' })
    .regex(/[A-Z]/, { error: 'Must contain at least one uppercase letter.' })
    .regex(/[0-9]/, { error: 'Must contain at least one number.' }),
})

export type ResetPasswordState =
  | { errors?: { password?: string[] }; error?: string }
  | undefined

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const token = formData.get('token') as string
  const password = formData.get('password') as string
  const confirm = formData.get('confirmPassword') as string

  if (password !== confirm) {
    return { errors: { password: ['Passwords do not match.'] } }
  }

  const result = resetPasswordSchema.safeParse({ password })
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    select: { id: true, userId: true, expiresAt: true, usedAt: true },
  })

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { error: 'This reset link is invalid or has expired. Please request a new one.' }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { hashedPassword } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ])

  redirect('/login?reset=success')
}
