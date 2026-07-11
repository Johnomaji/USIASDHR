import { PrismaClient, Role, CourseLevel } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
  // ── Users ────────────────────────────────────────────────────────────────────
  const [adminHash, instructorHash, studentHash] = await Promise.all([
    bcrypt.hash('Admin1234!', 12),
    bcrypt.hash('Instructor1234!', 12),
    bcrypt.hash('Student1234!', 12),
  ])

  const admin = await prisma.user.upsert({
    where: { email: 'admin@usiasdhr.org' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@usiasdhr.org',
      hashedPassword: adminHash,
      role: Role.ADMIN,
    },
  })

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@usiasdhr.org' },
    update: {},
    create: {
      name: 'Dr. Maya Chen',
      email: 'instructor@usiasdhr.org',
      hashedPassword: instructorHash,
      role: Role.INSTRUCTOR,
    },
  })

  const student = await prisma.user.upsert({
    where: { email: 'student@usiasdhr.org' },
    update: {},
    create: {
      name: 'Alex Rivera',
      email: 'student@usiasdhr.org',
      hashedPassword: studentHash,
      role: Role.STUDENT,
    },
  })

  void admin

  // ── Course 1: Understanding ASD ──────────────────────────────────────────────
  const course1 = await prisma.course.upsert({
    where: { slug: 'understanding-autism-spectrum-disorder' },
    update: {},
    create: {
      title: 'Understanding Autism Spectrum Disorder',
      slug: 'understanding-autism-spectrum-disorder',
      description:
        'A comprehensive introduction to autism spectrum disorder — covering history, characteristics, diagnosis, and the neurodiversity perspective. Designed for families, caregivers, and anyone who wants to learn.',
      category: 'Foundations',
      level: CourseLevel.BEGINNER,
      published: true,
      instructorId: instructor.id,
    },
  })

  const c1m1 = await prisma.module.upsert({
    where: { id: 'c1m1' },
    update: {},
    create: {
      id: 'c1m1',
      courseId: course1.id,
      title: 'What Is Autism?',
      description: 'Explore the history and definition of autism spectrum disorder.',
      order: 1,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'c1m1l1',
        moduleId: c1m1.id,
        title: 'A Brief History of Autism',
        content:
          '# A Brief History of Autism\n\nAutism spectrum disorder (ASD) was first described by psychiatrist Leo Kanner in 1943 based on observations of eleven children...\n\nAround the same time, Hans Asperger independently described similar traits in Austrian children. Over decades the understanding has evolved significantly, moving away from deficit-based models toward recognition of neurodiversity.',
        order: 1,
      },
      {
        id: 'c1m1l2',
        moduleId: c1m1.id,
        title: 'The Spectrum: Understanding Variability',
        content:
          '# The Spectrum: Understanding Variability\n\nASD manifests differently in every individual. The term "spectrum" reflects the wide range of presentations, from those who need significant daily support to those who live fully independently.',
        videoUrl: 'https://example.com/video/spectrum-variability',
        order: 2,
      },
      {
        id: 'c1m1l3',
        moduleId: c1m1.id,
        title: 'The Neurodiversity Perspective',
        content:
          '# The Neurodiversity Perspective\n\nNeurodiversity is the concept that neurological differences — including autism, ADHD, dyslexia, and others — are natural variations of the human genome rather than disorders to be cured.',
        order: 3,
      },
    ],
  })

  const c1m1quiz = await prisma.quiz.upsert({
    where: { id: 'c1m1quiz' },
    update: {},
    create: {
      id: 'c1m1quiz',
      moduleId: c1m1.id,
      title: 'Module 1 Check',
      passingScore: 70,
      maxAttempts: 3,
    },
  })

  await seedQuestions(c1m1quiz.id, [
    {
      id: 'c1m1q1',
      text: 'Who first formally described autism spectrum disorder in 1943?',
      order: 1,
      options: [
        { text: 'Leo Kanner', isCorrect: true },
        { text: 'Hans Asperger', isCorrect: false },
        { text: 'Sigmund Freud', isCorrect: false },
        { text: 'Jean Piaget', isCorrect: false },
      ],
    },
    {
      id: 'c1m1q2',
      text: 'The "spectrum" in ASD refers to:',
      order: 2,
      options: [
        { text: 'The wide range of ways autism presents across individuals', isCorrect: true },
        { text: 'A severity scale from 1 to 10', isCorrect: false },
        { text: 'Light sensitivity specific to autism', isCorrect: false },
        { text: 'The age range at which autism appears', isCorrect: false },
      ],
    },
    {
      id: 'c1m1q3',
      text: 'Neurodiversity frames autism as:',
      order: 3,
      options: [
        { text: 'A natural variation in human neurology', isCorrect: true },
        { text: 'A disease that requires a cure', isCorrect: false },
        { text: 'A purely environmental condition', isCorrect: false },
        { text: 'A childhood phase that resolves with age', isCorrect: false },
      ],
    },
  ])

  const c1m2 = await prisma.module.upsert({
    where: { id: 'c1m2' },
    update: {},
    create: {
      id: 'c1m2',
      courseId: course1.id,
      title: 'Diagnosis and Assessment',
      description: 'Learn about diagnostic criteria and assessment processes for ASD.',
      order: 2,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'c1m2l1',
        moduleId: c1m2.id,
        title: 'DSM-5-TR Diagnostic Criteria',
        content:
          '# DSM-5-TR Diagnostic Criteria\n\nThe DSM-5-TR outlines two core domains for ASD diagnosis:\n\n1. **Social communication and interaction** — persistent difficulties across multiple contexts.\n2. **Restricted, repetitive patterns of behavior** — including sensory sensitivities.',
        order: 1,
      },
      {
        id: 'c1m2l2',
        moduleId: c1m2.id,
        title: 'The Assessment Process',
        content:
          '# The Assessment Process\n\nA comprehensive ASD assessment typically involves multiple specialists including developmental pediatricians, psychologists, speech-language pathologists, and occupational therapists.',
        order: 2,
      },
    ],
  })

  const c1m2quiz = await prisma.quiz.upsert({
    where: { id: 'c1m2quiz' },
    update: {},
    create: {
      id: 'c1m2quiz',
      moduleId: c1m2.id,
      title: 'Module 2 Check',
      passingScore: 70,
      maxAttempts: 3,
    },
  })

  await seedQuestions(c1m2quiz.id, [
    {
      id: 'c1m2q1',
      text: 'How many core diagnostic domains does DSM-5-TR identify for ASD?',
      order: 1,
      options: [
        { text: 'Two', isCorrect: true },
        { text: 'Three', isCorrect: false },
        { text: 'Four', isCorrect: false },
        { text: 'One', isCorrect: false },
      ],
    },
    {
      id: 'c1m2q2',
      text: 'A comprehensive ASD assessment typically:',
      order: 2,
      options: [
        { text: 'Involves multiple specialists across several disciplines', isCorrect: true },
        { text: 'Can be completed with a single blood test', isCorrect: false },
        { text: 'Only requires a parent questionnaire', isCorrect: false },
        { text: 'Is only available for children under 5', isCorrect: false },
      ],
    },
  ])

  // ── Course 2: Supporting Autistic Learners ───────────────────────────────────
  const course2 = await prisma.course.upsert({
    where: { slug: 'supporting-autistic-learners-classroom' },
    update: {},
    create: {
      title: 'Supporting Autistic Learners in the Classroom',
      slug: 'supporting-autistic-learners-classroom',
      description:
        'Evidence-based strategies for educators to create inclusive, supportive learning environments where autistic students thrive.',
      category: 'Education',
      level: CourseLevel.INTERMEDIATE,
      published: true,
      instructorId: instructor.id,
    },
  })

  const c2m1 = await prisma.module.upsert({
    where: { id: 'c2m1' },
    update: {},
    create: {
      id: 'c2m1',
      courseId: course2.id,
      title: 'Creating an Inclusive Classroom',
      description: 'Strategies to make your classroom welcoming for all learners.',
      order: 1,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'c2m1l1',
        moduleId: c2m1.id,
        title: 'Universal Design for Learning',
        content:
          '# Universal Design for Learning\n\nUDL is a framework that guides educators to design flexible learning experiences and environments that accommodate all learners from the outset — rather than retrofitting accommodation.',
        order: 1,
      },
      {
        id: 'c2m1l2',
        moduleId: c2m1.id,
        title: 'Sensory-Friendly Environments',
        content:
          '# Sensory-Friendly Environments\n\nMany autistic learners experience sensory differences that can affect concentration and comfort. Practical adjustments include lighting changes, quiet zones, and flexible seating.',
        order: 2,
      },
      {
        id: 'c2m1l3',
        moduleId: c2m1.id,
        title: 'Predictability and Routine',
        content:
          '# Predictability and Routine\n\nConsistent routines and clear expectations significantly reduce anxiety for many autistic students, freeing up cognitive resources for learning.',
        videoUrl: 'https://example.com/video/routine-classroom',
        order: 3,
      },
    ],
  })

  const c2m1quiz = await prisma.quiz.upsert({
    where: { id: 'c2m1quiz' },
    update: {},
    create: {
      id: 'c2m1quiz',
      moduleId: c2m1.id,
      title: 'Module 1 Check',
      passingScore: 75,
      maxAttempts: 3,
    },
  })

  await seedQuestions(c2m1quiz.id, [
    {
      id: 'c2m1q1',
      text: 'UDL stands for:',
      order: 1,
      options: [
        { text: 'Universal Design for Learning', isCorrect: true },
        { text: 'Unified Developmental Learning', isCorrect: false },
        { text: 'Universal Disability Legislation', isCorrect: false },
        { text: 'Unique Design for Learners', isCorrect: false },
      ],
    },
    {
      id: 'c2m1q2',
      text: 'Predictable routines benefit autistic learners primarily because they:',
      order: 2,
      options: [
        { text: 'Reduce anxiety and free up cognitive resources for learning', isCorrect: true },
        { text: 'Make the teacher\'s job easier', isCorrect: false },
        { text: 'Prevent students from asking off-topic questions', isCorrect: false },
        { text: 'Eliminate the need for transition warnings', isCorrect: false },
      ],
    },
  ])

  // ── Course 3: Sensory Processing ─────────────────────────────────────────────
  const course3 = await prisma.course.upsert({
    where: { slug: 'sensory-processing-and-autism' },
    update: {},
    create: {
      title: 'Sensory Processing and Autism',
      slug: 'sensory-processing-and-autism',
      description:
        'A deep dive into sensory processing differences in autism — what they are, why they occur, and practical strategies for caregivers and professionals.',
      category: 'Caregiving',
      level: CourseLevel.INTERMEDIATE,
      published: true,
      instructorId: instructor.id,
    },
  })

  const c3m1 = await prisma.module.upsert({
    where: { id: 'c3m1' },
    update: {},
    create: {
      id: 'c3m1',
      courseId: course3.id,
      title: 'Understanding Sensory Processing',
      description: 'Learn the fundamentals of sensory processing differences.',
      order: 1,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'c3m1l1',
        moduleId: c3m1.id,
        title: 'The Eight Sensory Systems',
        content:
          '# The Eight Sensory Systems\n\nMost people learn about five senses. Occupational therapists recognise eight — adding proprioception (body position), vestibular (balance and movement), and interoception (internal body signals).',
        order: 1,
      },
      {
        id: 'c3m1l2',
        moduleId: c3m1.id,
        title: 'Hyper- and Hyposensitivity',
        content:
          '# Hyper- and Hyposensitivity\n\nAutistic individuals may be over-sensitive (hypersensitive) or under-sensitive (hyposensitive) to sensory input — sometimes both, in different systems. This is not a behaviour choice but a neurological difference.',
        videoUrl: 'https://example.com/video/sensory-sensitivity',
        order: 2,
      },
    ],
  })

  const c3m1quiz = await prisma.quiz.upsert({
    where: { id: 'c3m1quiz' },
    update: {},
    create: {
      id: 'c3m1quiz',
      moduleId: c3m1.id,
      title: 'Module 1 Check',
      passingScore: 70,
      maxAttempts: 3,
    },
  })

  await seedQuestions(c3m1quiz.id, [
    {
      id: 'c3m1q1',
      text: 'How many sensory systems do occupational therapists recognise?',
      order: 1,
      options: [
        { text: 'Eight', isCorrect: true },
        { text: 'Five', isCorrect: false },
        { text: 'Six', isCorrect: false },
        { text: 'Ten', isCorrect: false },
      ],
    },
    {
      id: 'c3m1q2',
      text: 'Hypersensitivity means:',
      order: 2,
      options: [
        { text: 'Being over-sensitive to sensory input', isCorrect: true },
        { text: 'Being under-sensitive to sensory input', isCorrect: false },
        { text: 'Experiencing no sensory reactions', isCorrect: false },
        { text: 'A form of hearing impairment', isCorrect: false },
      ],
    },
  ])

  // ── Demo enrollment ───────────────────────────────────────────────────────────
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: student.id, courseId: course1.id } },
    update: {},
    create: { userId: student.id, courseId: course1.id, progress: 33 },
  })

  console.log('\n✅  Seed complete!')
  console.log('─────────────────────────────────────────')
  console.log('  Admin      admin@usiasdhr.org    /  Admin1234!')
  console.log('  Instructor instructor@usiasdhr.org  /  Instructor1234!')
  console.log('  Student    student@usiasdhr.org  /  Student1234!')
  console.log('─────────────────────────────────────────')
}

// ── helpers ───────────────────────────────────────────────────────────────────
type OptionSeed = { text: string; isCorrect: boolean }
type QuestionSeed = {
  id: string
  text: string
  order: number
  options: OptionSeed[]
}

async function seedQuestions(quizId: string, questions: QuestionSeed[]) {
  for (const q of questions) {
    const question = await prisma.question.upsert({
      where: { id: q.id },
      update: {},
      create: { id: q.id, quizId, text: q.text, order: q.order },
      include: { options: true },
    })
    if (question.options.length === 0) {
      await prisma.questionOption.createMany({
        data: q.options.map((opt) => ({
          questionId: question.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      })
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
