'use server'

import { verifyRole } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateCoursePricing(
  _prevState: { error: string } | null | undefined,
  formData: FormData
) {
  await verifyRole(['ADMIN'])

  const courseId = formData.get('courseId') as string
  const isFree = formData.get('isFree') === 'true'
  const priceRaw = formData.get('price') as string

  const price = !isFree && priceRaw ? parseFloat(priceRaw) : null
  if (!isFree && (!price || price <= 0)) return { error: 'Enter a valid price.' }

  await prisma.course.update({
    where: { id: courseId },
    data: { isFree, price: price ?? null },
  })

  revalidatePath('/admin/courses')
  revalidatePath('/courses')
  revalidatePath('/')
}

type CourseFieldErrors = {
  title?: string[]
  description?: string[]
  category?: string[]
  instructorId?: string[]
  price?: string[]
}

type CourseFormState = { errors?: CourseFieldErrors; error?: string } | null | undefined

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function createCourse(_prevState: CourseFormState, formData: FormData): Promise<CourseFormState> {
  await verifyRole(['ADMIN'])

  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const category = (formData.get('category') as string)?.trim()
  const level = (formData.get('level') as string) || 'BEGINNER'
  const instructorId = formData.get('instructorId') as string
  const published = formData.get('published') === 'on'
  const isFree = formData.get('isFree') === 'true'
  const priceRaw = (formData.get('price') as string)?.trim()

  const errors: NonNullable<CourseFormState>['errors'] = {}
  if (!title) errors.title = ['Title is required.']
  if (!description) errors.description = ['Description is required.']
  if (!category) errors.category = ['Category is required.']
  if (!instructorId) errors.instructorId = ['Instructor is required.']
  if (!isFree && (!priceRaw || parseFloat(priceRaw) <= 0)) errors.price = ['Enter a valid price.']
  if (Object.keys(errors).length > 0) return { errors }

  const price = !isFree && priceRaw ? parseFloat(priceRaw) : null

  let slug = slugify(title)
  const taken = await prisma.course.count({ where: { slug } })
  if (taken > 0) slug = `${slug}-${Date.now()}`

  const course = await prisma.course.create({
    data: { title, slug, description, category, level: level as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED', instructorId, published, isFree, price },
  })

  revalidatePath('/admin/courses')
  revalidatePath('/courses')
  revalidatePath('/')

  redirect(`/admin/courses/${course.id}/lessons`)
}

export async function updateLesson(
  _prevState: { error: string } | null | undefined,
  formData: FormData
) {
  await verifyRole(['ADMIN'])

  const lessonId = formData.get('lessonId') as string
  const courseId = formData.get('courseId') as string
  const title = (formData.get('title') as string)?.trim()
  const videoUrl = (formData.get('videoUrl') as string)?.trim() || null
  const content = (formData.get('content') as string)?.trim() || null

  if (!title) return { error: 'Title is required.' }

  await prisma.lesson.update({
    where: { id: lessonId },
    data: { title, videoUrl, content },
  })

  revalidatePath(`/admin/courses/${courseId}/lessons`)
  revalidatePath('/learn', 'layout')

  redirect(`/admin/courses/${courseId}/lessons`)
}
