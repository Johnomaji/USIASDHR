import { prisma } from '@/lib/prisma'

export async function maybeIssueCertificate(userId: string, courseId: string) {
  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  })
  if (existing) return existing

  const [totalLessons, completedLessons, totalQuizzes, passedQuizRows] = await Promise.all([
    prisma.lesson.count({ where: { module: { courseId } } }),
    prisma.lessonProgress.count({
      where: { userId, completed: true, lesson: { module: { courseId } } },
    }),
    prisma.quiz.count({ where: { module: { courseId } } }),
    prisma.quizAttempt.findMany({
      where: { userId, passed: true, quiz: { module: { courseId } } },
      select: { quizId: true },
      distinct: ['quizId'],
    }),
  ])

  const hasCourseContent = totalLessons > 0 || totalQuizzes > 0
  const allLessonsDone = totalLessons === 0 || completedLessons >= totalLessons
  const allQuizzesPassed = totalQuizzes === 0 || passedQuizRows.length >= totalQuizzes

  if (hasCourseContent && allLessonsDone && allQuizzesPassed) {
    return prisma.certificate.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: { userId, courseId },
    })
  }
  return null
}
