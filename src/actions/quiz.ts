'use server'

import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function submitQuiz(formData: FormData) {
  const session = await verifySession()
  const quizId = formData.get('quizId') as string
  const courseSlug = formData.get('courseSlug') as string

  if (!quizId || !courseSlug) return

  // Load quiz with correct answers server-side only
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      passingScore: true,
      maxAttempts: true,
      questions: {
        select: {
          id: true,
          options: { select: { id: true, isCorrect: true } },
        },
      },
    },
  })
  if (!quiz) redirect('/dashboard')

  // Guard against exceeding attempt limit
  const existingCount = await prisma.quizAttempt.count({
    where: { userId: session.user.id, quizId },
  })
  if (existingCount >= quiz.maxAttempts) {
    redirect(`/learn/${courseSlug}/quiz/${quizId}`)
  }

  // Score the submission
  let correct = 0
  const answers: { questionId: string; optionId: string }[] = []

  for (const question of quiz.questions) {
    const selectedId = formData.get(`q-${question.id}`) as string | null
    if (selectedId) {
      answers.push({ questionId: question.id, optionId: selectedId })
      if (question.options.find((o) => o.id === selectedId)?.isCorrect) {
        correct++
      }
    }
  }

  const score =
    quiz.questions.length > 0 ? Math.round((correct / quiz.questions.length) * 100) : 0
  const passed = score >= quiz.passingScore

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: session.user.id,
      quizId,
      score,
      passed,
      answers: {
        create: answers.map((a) => ({ questionId: a.questionId, optionId: a.optionId })),
      },
    },
  })

  redirect(`/learn/${courseSlug}/quiz/${quizId}?attempt=${attempt.id}`)
}
