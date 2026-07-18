'use server'

import { verifyRole } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Course ────────────────────────────────────────────────────────────────────

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

export async function createCourse(
  _prevState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  await verifyRole(['ADMIN'])

  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const category = (formData.get('category') as string)?.trim()
  const level = (formData.get('level') as string) || 'BEGINNER'
  const instructorId = formData.get('instructorId') as string
  const published = formData.get('published') === 'on'
  const isFree = formData.get('isFree') === 'true'
  const priceRaw = (formData.get('price') as string)?.trim()
  const coverImage = (formData.get('coverImage') as string)?.trim() || null

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
    data: {
      title,
      slug,
      description,
      category,
      level: level as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
      instructorId,
      published,
      isFree,
      price,
      coverImage,
    },
  })

  revalidatePath('/admin/courses')
  revalidatePath('/courses')
  revalidatePath('/')

  redirect(`/admin/courses/${course.id}/lessons`)
}

// ── Module ────────────────────────────────────────────────────────────────────

export async function createModule(formData: FormData) {
  await verifyRole(['ADMIN'])

  const courseId = formData.get('courseId') as string
  const title = (formData.get('title') as string)?.trim()
  if (!courseId || !title) return

  const last = await prisma.module.findFirst({
    where: { courseId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  await prisma.module.create({
    data: { courseId, title, order: (last?.order ?? 0) + 1 },
  })

  revalidatePath(`/admin/courses/${courseId}/lessons`)
  redirect(`/admin/courses/${courseId}/lessons`)
}

// ── Lesson ────────────────────────────────────────────────────────────────────

export async function createLesson(formData: FormData) {
  await verifyRole(['ADMIN'])

  const courseId = formData.get('courseId') as string
  const moduleId = formData.get('moduleId') as string
  if (!courseId || !moduleId) return

  const last = await prisma.lesson.findFirst({
    where: { moduleId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const lesson = await prisma.lesson.create({
    data: { moduleId, title: 'New lesson', order: (last?.order ?? 0) + 1 },
  })

  redirect(`/admin/courses/${courseId}/lessons/${lesson.id}`)
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

// ── Quiz ──────────────────────────────────────────────────────────────────────

export async function createQuiz(formData: FormData) {
  await verifyRole(['ADMIN'])

  const courseId = formData.get('courseId') as string
  const moduleId = formData.get('moduleId') as string
  if (!courseId || !moduleId) return

  const quiz = await prisma.quiz.create({
    data: { moduleId, title: 'New quiz', passingScore: 70, maxAttempts: 3 },
  })

  redirect(`/admin/courses/${courseId}/quizzes/${quiz.id}`)
}

export async function updateQuiz(formData: FormData) {
  await verifyRole(['ADMIN'])

  const quizId = formData.get('quizId') as string
  const courseId = formData.get('courseId') as string
  const title = (formData.get('title') as string)?.trim()
  const passingScore = parseInt(formData.get('passingScore') as string, 10)
  const maxAttempts = parseInt(formData.get('maxAttempts') as string, 10)

  if (!title || isNaN(passingScore) || isNaN(maxAttempts)) return

  await prisma.quiz.update({
    where: { id: quizId },
    data: {
      title,
      passingScore: Math.max(1, Math.min(100, passingScore)),
      maxAttempts: Math.max(1, maxAttempts),
    },
  })

  revalidatePath(`/admin/courses/${courseId}/lessons`)
  redirect(`/admin/courses/${courseId}/quizzes/${quizId}`)
}

export async function deleteQuiz(formData: FormData) {
  await verifyRole(['ADMIN'])

  const quizId = formData.get('quizId') as string
  const courseId = formData.get('courseId') as string

  await prisma.quiz.delete({ where: { id: quizId } })

  revalidatePath(`/admin/courses/${courseId}/lessons`)
  redirect(`/admin/courses/${courseId}/lessons`)
}

// ── Question ──────────────────────────────────────────────────────────────────

export async function addQuestion(formData: FormData) {
  await verifyRole(['ADMIN'])

  const quizId = formData.get('quizId') as string
  const courseId = formData.get('courseId') as string
  const text = (formData.get('text') as string)?.trim()
  if (!quizId || !courseId || !text) return

  const last = await prisma.question.findFirst({
    where: { quizId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const question = await prisma.question.create({
    data: { quizId, text, order: (last?.order ?? 0) + 1 },
  })

  redirect(`/admin/courses/${courseId}/quizzes/${quizId}/questions/${question.id}`)
}

export async function updateQuestion(formData: FormData) {
  await verifyRole(['ADMIN'])

  const questionId = formData.get('questionId') as string
  const quizId = formData.get('quizId') as string
  const courseId = formData.get('courseId') as string
  const text = (formData.get('text') as string)?.trim()
  if (!text) return

  await prisma.question.update({ where: { id: questionId }, data: { text } })

  revalidatePath(`/admin/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`)
  redirect(`/admin/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`)
}

export async function deleteQuestion(formData: FormData) {
  await verifyRole(['ADMIN'])

  const questionId = formData.get('questionId') as string
  const quizId = formData.get('quizId') as string
  const courseId = formData.get('courseId') as string

  await prisma.question.delete({ where: { id: questionId } })

  revalidatePath(`/admin/courses/${courseId}/quizzes/${quizId}`)
  redirect(`/admin/courses/${courseId}/quizzes/${quizId}`)
}

// ── Option ────────────────────────────────────────────────────────────────────

export async function addOption(formData: FormData) {
  await verifyRole(['ADMIN'])

  const questionId = formData.get('questionId') as string
  const quizId = formData.get('quizId') as string
  const courseId = formData.get('courseId') as string
  const text = (formData.get('text') as string)?.trim()
  if (!questionId || !text) return

  await prisma.questionOption.create({
    data: { questionId, text, isCorrect: false },
  })

  revalidatePath(`/admin/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`)
  redirect(`/admin/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`)
}

export async function deleteOption(formData: FormData) {
  await verifyRole(['ADMIN'])

  const optionId = formData.get('optionId') as string
  const questionId = formData.get('questionId') as string
  const quizId = formData.get('quizId') as string
  const courseId = formData.get('courseId') as string

  await prisma.questionOption.delete({ where: { id: optionId } })

  revalidatePath(`/admin/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`)
  redirect(`/admin/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`)
}

export async function setCorrectOption(formData: FormData) {
  await verifyRole(['ADMIN'])

  const optionId = formData.get('optionId') as string
  const questionId = formData.get('questionId') as string
  const quizId = formData.get('quizId') as string
  const courseId = formData.get('courseId') as string

  await prisma.$transaction([
    prisma.questionOption.updateMany({
      where: { questionId },
      data: { isCorrect: false },
    }),
    prisma.questionOption.update({
      where: { id: optionId },
      data: { isCorrect: true },
    }),
  ])

  revalidatePath(`/admin/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`)
  redirect(`/admin/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`)
}
