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
    update: { name: 'Maria Okafor' },
    create: {
      name: 'Maria Okafor',
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

  // ── Course 1: Human Rights (15 modules × 2 lessons = 30 lessons) ─────────────
  const vp = (id: string) =>
    `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479`

  const course1 = await prisma.course.upsert({
    where: { slug: 'human-rights' },
    update: {},
    create: {
      title: 'Human Rights',
      slug: 'human-rights',
      description:
        'A foundational course on the 30 basic human rights enshrined in the Universal Declaration of Human Rights — covering every right from equality and dignity to education, work, and cultural participation. Designed for everyone who wants to understand what their rights are and why they matter.',
      category: 'Human Rights',
      level: CourseLevel.BEGINNER,
      published: true,
      isFree: true,
      instructorId: instructor.id,
    },
  })

  // ── Module 1: Equality and Non-Discrimination (Articles 1–2) ─────────────────
  const hr_m1 = await prisma.module.upsert({
    where: { id: 'hr_m1' },
    update: {},
    create: {
      id: 'hr_m1',
      courseId: course1.id,
      title: 'Equality and Non-Discrimination',
      description: 'The foundational principles: all humans are born free and equal, and must never be discriminated against.',
      order: 1,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m1_l1',
        moduleId: hr_m1.id,
        title: 'Born Free and Equal (Article 1)',
        content:
          '# Born Free and Equal\n\nArticle 1 of the Universal Declaration of Human Rights states: *"All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood."*\n\n## What This Means\n\n- **Free**: No one is born into slavery, servitude, or subjugation\n- **Equal in dignity**: Every person deserves the same fundamental respect, regardless of background\n- **Equal in rights**: The same human rights apply to every person on earth\n\n## Why It Matters\n\nArticle 1 is the cornerstone of all human rights. It establishes that human rights are not earned or granted by governments — they belong to every human being from birth, simply because they are human.\n\nThis principle directly challenges systems of caste, class, or social hierarchy that treat some people as inherently superior to others.',
        order: 1,
      },
      {
        id: 'hr_m1_l2',
        moduleId: hr_m1.id,
        title: 'Freedom from Discrimination (Article 2)',
        content:
          '# Freedom from Discrimination\n\nArticle 2 guarantees that every person is entitled to all human rights *without distinction of any kind*, including:\n\n- Race or ethnicity\n- Sex or gender\n- Language or religion\n- Political opinion\n- National or social origin\n- Property, birth, or any other status\n\n## The Principle of Non-Discrimination\n\nNon-discrimination is one of the most fundamental principles in international human rights law. Every right in the UDHR applies equally to every person — no exceptions, no exclusions.\n\n## Forms of Discrimination\n\n- **Direct**: Refusing to hire someone because of their religion\n- **Indirect**: A policy that appears neutral but disproportionately harms a particular group\n- **Systemic**: Structures that consistently disadvantage certain groups\n\nFor autistic and disabled people, discrimination remains widespread in education, employment, and healthcare — making Article 2 especially important.',
        order: 2,
      },
    ],
  })

  const hr_m1_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m1_quiz' },
    update: {},
    create: { id: 'hr_m1_quiz', moduleId: hr_m1.id, title: 'Module 1 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m1_quiz.id, [
    {
      id: 'hr_m1_q1',
      text: 'According to Article 1, human beings are born:',
      order: 1,
      options: [
        { text: 'Free and equal in dignity and rights', isCorrect: true },
        { text: 'Equal only if they live in democratic countries', isCorrect: false },
        { text: 'Free only after reaching the age of 18', isCorrect: false },
        { text: 'Equal based on their nationality', isCorrect: false },
      ],
    },
    {
      id: 'hr_m1_q2',
      text: 'Article 2 states that human rights apply:',
      order: 2,
      options: [
        { text: 'To every person without distinction of any kind', isCorrect: true },
        { text: 'Only to citizens of countries that signed the UDHR', isCorrect: false },
        { text: 'To adults but not to children', isCorrect: false },
        { text: 'Only when a government grants them', isCorrect: false },
      ],
    },
  ])

  // ── Module 2: Life, Liberty, and Freedom from Slavery (Articles 3–4) ─────────
  const hr_m2 = await prisma.module.upsert({
    where: { id: 'hr_m2' },
    update: {},
    create: {
      id: 'hr_m2',
      courseId: course1.id,
      title: 'Life, Liberty, and Freedom from Slavery',
      description: 'Every person has the right to life and liberty, and must never be held in slavery or servitude.',
      order: 2,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m2_l1',
        moduleId: hr_m2.id,
        title: 'Right to Life, Liberty, and Security (Article 3)',
        content:
          '# Right to Life, Liberty, and Security\n\nArticle 3 states: *"Everyone has the right to life, liberty and security of person."*\n\nThese three rights form the core of what it means to be a free human being:\n\n- **Right to Life**: No one may arbitrarily take your life. Governments must protect you from being killed.\n- **Right to Liberty**: You cannot be imprisoned or detained without legal justification. Arbitrary detention is a human rights violation.\n- **Right to Security**: You are entitled to protection from threats of violence and fear.\n\n## Why This Matters for Disabled People\n\nHistorically, autistic and neurodivergent people have been detained in institutions against their will — sometimes for life — without legal safeguards. Article 3 challenges this directly. Every autistic person has the right to life, liberty, and personal security.',
        order: 1,
      },
      {
        id: 'hr_m2_l2',
        moduleId: hr_m2.id,
        title: 'Freedom from Slavery and Servitude (Article 4)',
        content:
          '# Freedom from Slavery and Servitude\n\nArticle 4 states: *"No one shall be held in slavery or servitude; slavery and the slave trade shall be prohibited in all their forms."*\n\n## Modern Forms of Slavery\n\nWhile chattel slavery has been formally abolished globally, modern slavery persists:\n\n- **Forced labour**: Being compelled to work through threats or coercion\n- **Debt bondage**: Working indefinitely to pay off a debt that never decreases\n- **Human trafficking**: Being transported and exploited for labour or sexual exploitation\n- **Forced marriage**: Being married without genuine consent\n\n## Vulnerability of Disabled People\n\nPeople with disabilities are at heightened risk of exploitation. Institutions and care settings can become sites of modern slavery when oversight is poor. Article 4 demands that these protections extend to everyone.',
        order: 2,
      },
    ],
  })

  const hr_m2_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m2_quiz' },
    update: {},
    create: { id: 'hr_m2_quiz', moduleId: hr_m2.id, title: 'Module 2 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m2_quiz.id, [
    {
      id: 'hr_m2_q1',
      text: 'Article 3 gives everyone the right to:',
      order: 1,
      options: [
        { text: 'Life, liberty, and security of person', isCorrect: true },
        { text: 'Free housing and healthcare', isCorrect: false },
        { text: 'Vote in all elections', isCorrect: false },
        { text: 'Own property in any country', isCorrect: false },
      ],
    },
    {
      id: 'hr_m2_q2',
      text: 'Which of the following is a modern form of slavery?',
      order: 2,
      options: [
        { text: 'Debt bondage — working indefinitely to repay a debt that never decreases', isCorrect: true },
        { text: 'Paying taxes to a government', isCorrect: false },
        { text: 'Working overtime voluntarily for extra pay', isCorrect: false },
        { text: 'Signing an employment contract', isCorrect: false },
      ],
    },
  ])

  // ── Module 3: Dignity and Legal Identity (Articles 5–6) ──────────────────────
  const hr_m3 = await prisma.module.upsert({
    where: { id: 'hr_m3' },
    update: {},
    create: {
      id: 'hr_m3',
      courseId: course1.id,
      title: 'Dignity and Legal Identity',
      description: 'The right to be free from torture and to be recognised as a person before the law.',
      order: 3,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m3_l1',
        moduleId: hr_m3.id,
        title: 'Freedom from Torture and Cruel Treatment (Article 5)',
        content:
          '# Freedom from Torture and Cruel Treatment\n\nArticle 5 states: *"No one shall be subjected to torture or to cruel, inhuman or degrading treatment or punishment."*\n\nThis is an **absolute right** — it cannot be suspended under any circumstances, including war or national emergency.\n\n## What Counts as Torture or Cruel Treatment?\n\n- Physical torture: causing severe physical pain to extract information or as punishment\n- Psychological torture: prolonged solitary confinement, threats, humiliation\n- Degrading treatment: treatment that severely humiliates or dehumanises a person\n\n## For Autistic and Disabled People\n\nPractices used against autistic people — including aversive therapies, physical restraints, seclusion, and forced compliance training — have been condemned by the UN Committee on the Rights of Persons with Disabilities as cruel and degrading treatment. Article 5 protects every autistic person from these practices.',
        order: 1,
      },
      {
        id: 'hr_m3_l2',
        moduleId: hr_m3.id,
        title: 'Right to Recognition Before the Law (Article 6)',
        content:
          '# Right to Recognition Before the Law\n\nArticle 6 states: *"Everyone has the right to recognition everywhere as a person before the law."*\n\n## What This Means\n\nEvery human being is a legal person — someone who exists in the eyes of the law with rights and standing. Historically many groups have been denied legal personhood:\n\n- Enslaved people were legally classified as property\n- Women in many societies could not own property or appear in court\n- Disabled people have been denied legal capacity through guardianship laws\n\n## Why It Matters Today\n\nWhen a person is denied legal personhood, others can make decisions about their life, property, and body without their consent. For autistic adults placed under full guardianship, Article 6 is directly relevant — autistic people must retain their legal personhood and decision-making rights.',
        order: 2,
      },
    ],
  })

  const hr_m3_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m3_quiz' },
    update: {},
    create: { id: 'hr_m3_quiz', moduleId: hr_m3.id, title: 'Module 3 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m3_quiz.id, [
    {
      id: 'hr_m3_q1',
      text: 'The right under Article 5 (freedom from torture) is:',
      order: 1,
      options: [
        { text: 'Absolute — it cannot be suspended under any circumstances', isCorrect: true },
        { text: 'Suspended during national emergencies', isCorrect: false },
        { text: 'Only applicable in peacetime', isCorrect: false },
        { text: 'Available only to citizens, not foreign nationals', isCorrect: false },
      ],
    },
    {
      id: 'hr_m3_q2',
      text: 'Article 6 ensures that every human being is:',
      order: 2,
      options: [
        { text: 'Recognised as a legal person with rights and standing before the law', isCorrect: true },
        { text: 'Entitled to free legal representation in all cases', isCorrect: false },
        { text: 'Immune from prosecution for minor offences', isCorrect: false },
        { text: 'Allowed to create their own legal system', isCorrect: false },
      ],
    },
  ])

  // ── Module 4: Equality and Justice (Articles 7–8) ────────────────────────────
  const hr_m4 = await prisma.module.upsert({
    where: { id: 'hr_m4' },
    update: {},
    create: {
      id: 'hr_m4',
      courseId: course1.id,
      title: 'Equality and Justice',
      description: 'All people are equal before the law and have the right to legal protection and remedy.',
      order: 4,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m4_l1',
        moduleId: hr_m4.id,
        title: 'Equality Before the Law (Article 7)',
        content:
          '# Equality Before the Law\n\nArticle 7 states: *"All are equal before the law and are entitled without any discrimination to equal protection of the law."*\n\n## What It Means\n\nThe law must treat every person the same. No individual or group should receive preferential treatment or face harsher penalties based on their identity.\n\n## Equal Protection\n\nArticle 7 also guarantees protection against **incitement to discrimination** — meaning it is a human rights violation to publicly encourage discrimination against any group.\n\n## In Practice\n\n- A court must apply the same legal standards regardless of who is on trial\n- Police must not target people based on race, religion, or disability\n\nFor autistic people, equality before the law means justice systems must make reasonable accommodations — such as communication support and accessible formats — so autistic people can fully participate in legal proceedings.',
        order: 1,
      },
      {
        id: 'hr_m4_l2',
        moduleId: hr_m4.id,
        title: 'Right to Legal Remedy (Article 8)',
        content:
          '# Right to Legal Remedy\n\nArticle 8 states: *"Everyone has the right to an effective remedy by the competent national tribunals for acts violating the fundamental rights granted him by the constitution or by law."*\n\n## What This Means\n\nIf your human rights are violated, you have the right to go to a court or tribunal and seek justice. The remedy must be:\n- **Effective**: It must actually address the violation\n- **Accessible**: You must be able to reach it without unreasonable barriers\n- **From a competent authority**: The body hearing your case must have the power to grant relief\n\n## What Counts as a Remedy?\n\n- A court order stopping a violation\n- Compensation for harm suffered\n- A declaration that your rights were violated\n\nFor autistic and disabled people, this right means you can challenge discrimination, unlawful detention, or denial of accommodations in court.',
        order: 2,
      },
    ],
  })

  const hr_m4_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m4_quiz' },
    update: {},
    create: { id: 'hr_m4_quiz', moduleId: hr_m4.id, title: 'Module 4 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m4_quiz.id, [
    {
      id: 'hr_m4_q1',
      text: 'Article 7 guarantees:',
      order: 1,
      options: [
        { text: 'Equal protection of the law for all people without discrimination', isCorrect: true },
        { text: 'Free legal advice for all citizens', isCorrect: false },
        { text: 'The right to choose your own judge', isCorrect: false },
        { text: 'Immunity from prosecution for human rights defenders', isCorrect: false },
      ],
    },
    {
      id: 'hr_m4_q2',
      text: 'An "effective remedy" under Article 8 means:',
      order: 2,
      options: [
        { text: 'A real, accessible remedy that actually addresses the human rights violation', isCorrect: true },
        { text: 'A government apology without any consequences', isCorrect: false },
        { text: 'Financial compensation only, with no other options', isCorrect: false },
        { text: 'A remedy available only in criminal cases', isCorrect: false },
      ],
    },
  ])

  // ── Module 5: Fair Treatment by the State (Articles 9–10) ────────────────────
  const hr_m5 = await prisma.module.upsert({
    where: { id: 'hr_m5' },
    update: {},
    create: {
      id: 'hr_m5',
      courseId: course1.id,
      title: 'Fair Treatment by the State',
      description: 'No one should be arbitrarily arrested, and everyone is entitled to a fair public hearing.',
      order: 5,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m5_l1',
        moduleId: hr_m5.id,
        title: 'Freedom from Arbitrary Arrest and Exile (Article 9)',
        content:
          '# Freedom from Arbitrary Arrest and Exile\n\nArticle 9 states: *"No one shall be subjected to arbitrary arrest, detention or exile."*\n\n## What "Arbitrary" Means\n\n"Arbitrary" means without legal basis, without proper procedures, or disproportionate to any legitimate aim.\n\n## Key Protections\n\n- **Habeas corpus**: The right to challenge the legality of your detention before a court\n- **Right to be informed**: You must be told why you are being arrested\n- **Prompt appearance before a judge**: You cannot be held indefinitely without judicial oversight\n- **Right to bail**: Detention pending trial should be the exception, not the rule\n\n## Exile\n\nNo government may expel its own citizens or force them to live outside their country. Exile has historically been used to silence political opponents — Article 9 prohibits it.',
        order: 1,
      },
      {
        id: 'hr_m5_l2',
        moduleId: hr_m5.id,
        title: 'Right to a Fair and Public Trial (Article 10)',
        content:
          '# Right to a Fair and Public Trial\n\nArticle 10 states: *"Everyone is entitled in full equality to a fair and public hearing by an independent and impartial tribunal, in the determination of his rights and obligations and of any criminal charge against him."*\n\n## Elements of a Fair Trial\n\n- **Independent tribunal**: The court must not be controlled by the government or any party\n- **Impartial**: Judges must have no personal interest in the outcome\n- **Public hearing**: Trials must generally be open to the public\n- **Full equality**: All parties must have the same opportunities to present their case\n\n## Accessibility and Autism\n\nFor autistic people, the right to a fair trial includes:\n- Proceedings explained in accessible formats\n- Alternative communication methods\n- Appropriate support in court\n- Not being disadvantaged by neurotypical communication expectations',
        order: 2,
      },
    ],
  })

  const hr_m5_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m5_quiz' },
    update: {},
    create: { id: 'hr_m5_quiz', moduleId: hr_m5.id, title: 'Module 5 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m5_quiz.id, [
    {
      id: 'hr_m5_q1',
      text: 'An "arbitrary" arrest means an arrest that is:',
      order: 1,
      options: [
        { text: 'Made without legal basis or proper procedure', isCorrect: true },
        { text: 'Made by police without a uniform', isCorrect: false },
        { text: 'Made at night rather than during the day', isCorrect: false },
        { text: 'Made outside of the arrested person\'s home country', isCorrect: false },
      ],
    },
    {
      id: 'hr_m5_q2',
      text: 'Article 10 requires a trial to be:',
      order: 2,
      options: [
        { text: 'Fair, public, and before an independent and impartial tribunal', isCorrect: true },
        { text: 'Always held in the capital city of the country', isCorrect: false },
        { text: 'Completed within 30 days of arrest', isCorrect: false },
        { text: 'Presided over by an elected judge', isCorrect: false },
      ],
    },
  ])

  // ── Module 6: Innocence and Privacy (Articles 11–12) ─────────────────────────
  const hr_m6 = await prisma.module.upsert({
    where: { id: 'hr_m6' },
    update: {},
    create: {
      id: 'hr_m6',
      courseId: course1.id,
      title: 'Innocence and Privacy',
      description: 'Everyone is innocent until proven guilty, and has the right to privacy in their home and life.',
      order: 6,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m6_l1',
        moduleId: hr_m6.id,
        title: 'Presumption of Innocence (Article 11)',
        content:
          '# Presumption of Innocence\n\nArticle 11 states that everyone charged with a penal offence has the right to be presumed innocent until proved guilty in a public trial with all guarantees necessary for their defence.\n\n## What This Means\n\nThe burden of proof lies entirely with the prosecution — it is not up to you to prove your innocence. You are legally innocent unless and until a court finds you guilty.\n\n## Key Protections\n\n- The right to be told what you are charged with\n- The right to prepare and present a defence\n- The right to legal representation\n- No punishment for an act that was not a crime when it was committed\n\n## Why This Matters\n\nPresumption of innocence protects against mob justice and rushed convictions. Even the most serious accusations must be proven fairly before any punishment is applied.',
        order: 1,
      },
      {
        id: 'hr_m6_l2',
        moduleId: hr_m6.id,
        title: 'Right to Privacy (Article 12)',
        content:
          '# Right to Privacy\n\nArticle 12 states: *"No one shall be subjected to arbitrary interference with his privacy, family, home or correspondence, nor to attacks upon his honour and reputation."*\n\n## What Privacy Covers\n\n- **Personal life**: Your private thoughts, health information, and personal choices\n- **Family life**: Decisions about your family and relationships\n- **Home**: Your home cannot be entered without legal authority\n- **Correspondence**: Your letters, emails, and communications are private\n- **Reputation**: You are protected from false and damaging attacks on your character\n\n## Privacy in the Digital Age\n\nGovernments and corporations must not monitor or collect personal data without legal basis and consent.\n\nFor autistic people, privacy is especially important when personal information about diagnosis, behaviour, and support needs is shared without consent.',
        videoUrl: vp('1209799381'),
        order: 2,
      },
    ],
  })

  const hr_m6_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m6_quiz' },
    update: {},
    create: { id: 'hr_m6_quiz', moduleId: hr_m6.id, title: 'Module 6 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m6_quiz.id, [
    {
      id: 'hr_m6_q1',
      text: 'The presumption of innocence means:',
      order: 1,
      options: [
        { text: 'A person is legally innocent until a court proves them guilty', isCorrect: true },
        { text: 'Police must release suspects after 24 hours', isCorrect: false },
        { text: 'Only first-time offenders are presumed innocent', isCorrect: false },
        { text: 'Innocence must be proven by the accused themselves', isCorrect: false },
      ],
    },
    {
      id: 'hr_m6_q2',
      text: 'Article 12 protects which of the following?',
      order: 2,
      options: [
        { text: 'Privacy of your home, family, correspondence, and reputation', isCorrect: true },
        { text: 'The right to keep all financial information secret from the government', isCorrect: false },
        { text: 'The right to anonymous voting in all elections', isCorrect: false },
        { text: 'Protection from paying taxes', isCorrect: false },
      ],
    },
  ])

  // ── Module 7: Movement and Asylum (Articles 13–14) ───────────────────────────
  const hr_m7 = await prisma.module.upsert({
    where: { id: 'hr_m7' },
    update: {},
    create: {
      id: 'hr_m7',
      courseId: course1.id,
      title: 'Movement and Asylum',
      description: 'Everyone has the right to move freely and to seek asylum from persecution.',
      order: 7,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m7_l1',
        moduleId: hr_m7.id,
        title: 'Freedom of Movement (Article 13)',
        content:
          '# Freedom of Movement\n\nArticle 13 states: *"Everyone has the right to freedom of movement and residence within the borders of each state. Everyone has the right to leave any country, including his own, and to return to his country."*\n\n## Two Dimensions of Movement\n\n**Within a country**: You may travel and live anywhere within your own country. Governments cannot confine citizens to specific regions without lawful justification.\n\n**Across borders**: You have the right to leave any country, including your own. No government may trap its citizens inside its borders. You also have the right to return to your home country.\n\n## Why This Matters\n\nRestrictions on movement are a tool of authoritarian control — confining dissidents, separating families, and preventing people from reaching safety. Article 13 challenges all such restrictions.',
        videoUrl: vp('1209799382'),
        order: 1,
      },
      {
        id: 'hr_m7_l2',
        moduleId: hr_m7.id,
        title: 'Right to Asylum (Article 14)',
        content:
          '# Right to Asylum\n\nArticle 14 states: *"Everyone has the right to seek and to enjoy in other countries asylum from persecution."*\n\n## What Asylum Means\n\nAsylum is protection granted by a country to someone fleeing persecution based on:\n- Race or religion\n- Nationality\n- Political opinion\n- Membership of a particular social group\n\n## Non-Refoulement\n\nInternational law establishes the principle of **non-refoulement**: no one may be returned to a country where they face serious threats to their life or freedom.\n\n## Asylum Seekers with Disabilities\n\nAutistic and disabled asylum seekers face additional barriers in asylum processes designed for neurotypical communication. Their rights under Article 14 must be fulfilled with appropriate accommodations.',
        videoUrl: vp('1209799383'),
        order: 2,
      },
    ],
  })

  const hr_m7_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m7_quiz' },
    update: {},
    create: { id: 'hr_m7_quiz', moduleId: hr_m7.id, title: 'Module 7 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m7_quiz.id, [
    {
      id: 'hr_m7_q1',
      text: 'Article 13 gives everyone the right to:',
      order: 1,
      options: [
        { text: 'Move freely within their country and leave any country, including their own', isCorrect: true },
        { text: 'Enter any country in the world without a visa', isCorrect: false },
        { text: 'Own property in any country they visit', isCorrect: false },
        { text: 'Travel without a passport within their region', isCorrect: false },
      ],
    },
    {
      id: 'hr_m7_q2',
      text: 'The principle of non-refoulement means:',
      order: 2,
      options: [
        { text: 'No one may be returned to a country where they face threats to their life or freedom', isCorrect: true },
        { text: 'Refugees must be given citizenship within one year', isCorrect: false },
        { text: 'Asylum seekers cannot be detained at the border', isCorrect: false },
        { text: 'Every country must accept unlimited asylum seekers', isCorrect: false },
      ],
    },
  ])

  // ── Module 8: Nationality and Family (Articles 15–16) ────────────────────────
  const hr_m8 = await prisma.module.upsert({
    where: { id: 'hr_m8' },
    update: {},
    create: {
      id: 'hr_m8',
      courseId: course1.id,
      title: 'Nationality and Family',
      description: 'Every person has the right to a nationality and to freely form a family.',
      order: 8,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m8_l1',
        moduleId: hr_m8.id,
        title: 'Right to a Nationality (Article 15)',
        content:
          '# Right to a Nationality\n\nArticle 15 states: *"Everyone has the right to a nationality. No one shall be arbitrarily deprived of his nationality nor denied the right to change his nationality."*\n\n## Why Nationality Matters\n\nNationality is the legal bond between a person and a state. Without it, a person becomes **stateless** — unable to vote, access public services, get a passport, or enjoy legal protection in any country.\n\n## Statelessness\n\nStatelessness affects millions of people worldwide, including children born to stateless parents, minorities stripped of citizenship, and refugees. Stateless people are among the most vulnerable in the world.\n\n## The Right to Change Nationality\n\nNo one should be trapped in a nationality they wish to change. The right to voluntarily change citizenship through legal processes is protected.',
        videoUrl: vp('1209799380'),
        order: 1,
      },
      {
        id: 'hr_m8_l2',
        moduleId: hr_m8.id,
        title: 'Right to Marriage and Family (Article 16)',
        content:
          '# Right to Marriage and Family\n\nArticle 16 states that men and women of full age have the right to marry and found a family with full and free consent, and that the family is the natural and fundamental unit of society.\n\n## Key Principles\n\n- **Free and full consent**: No one can be forced into marriage\n- **Equal rights**: Rights within marriage must be equal for both spouses\n- **The right to found a family**: This includes the right to have and raise children\n\n## Relevance for Autistic and Disabled People\n\nAutistic adults have historically been denied the right to marry or have children through guardianship laws, forced sterilisation, and institutionalisation. Article 16 affirms that autistic adults have the same rights to love, marriage, and family as anyone else. Guardianship that prevents an autistic adult from marrying is a human rights violation.',
        videoUrl: vp('1209799565'),
        order: 2,
      },
    ],
  })

  const hr_m8_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m8_quiz' },
    update: {},
    create: { id: 'hr_m8_quiz', moduleId: hr_m8.id, title: 'Module 8 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m8_quiz.id, [
    {
      id: 'hr_m8_q1',
      text: 'Statelessness means a person:',
      order: 1,
      options: [
        { text: 'Has no legal nationality and cannot enjoy protection from any state', isCorrect: true },
        { text: 'Lives in a country without a government', isCorrect: false },
        { text: 'Has chosen to renounce all national ties voluntarily', isCorrect: false },
        { text: 'Holds dual citizenship in two countries', isCorrect: false },
      ],
    },
    {
      id: 'hr_m8_q2',
      text: 'For a marriage to comply with Article 16, it must be entered into with:',
      order: 2,
      options: [
        { text: 'Free and full consent from both parties', isCorrect: true },
        { text: 'Approval from both families', isCorrect: false },
        { text: 'Government registration within 30 days', isCorrect: false },
        { text: 'A religious ceremony', isCorrect: false },
      ],
    },
  ])

  // ── Module 9: Property and Conscience (Articles 17–18) ───────────────────────
  const hr_m9 = await prisma.module.upsert({
    where: { id: 'hr_m9' },
    update: {},
    create: {
      id: 'hr_m9',
      courseId: course1.id,
      title: 'Property and Conscience',
      description: 'The right to own property and the freedom to hold and practise your own beliefs.',
      order: 9,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m9_l1',
        moduleId: hr_m9.id,
        title: 'Right to Own Property (Article 17)',
        content:
          '# Right to Own Property\n\nArticle 17 states: *"Everyone has the right to own property alone as well as in association with others. No one shall be arbitrarily deprived of his property."*\n\n## What This Means\n\nProperty ownership is a fundamental right. Governments and individuals cannot take your property without lawful justification and fair compensation.\n\n## Arbitrary Deprivation\n\nGovernments may lawfully acquire property for public purposes, but must:\n- Have a legitimate public purpose\n- Follow due process\n- Provide fair compensation\n\n## Historical Context\n\nFor centuries, women, enslaved people, and disabled people were denied the right to own property. Many autistic adults placed under full guardianship lose control over their own assets. Article 17 affirms that property rights belong to every person.',
        videoUrl: vp('1209800064'),
        order: 1,
      },
      {
        id: 'hr_m9_l2',
        moduleId: hr_m9.id,
        title: 'Freedom of Thought, Conscience, and Religion (Article 18)',
        content:
          '# Freedom of Thought, Conscience, and Religion\n\nArticle 18 states: *"Everyone has the right to freedom of thought, conscience and religion; this right includes freedom to change his religion or belief, and freedom, either alone or in community with others and in public or private, to manifest his religion or belief in teaching, practice, worship and observance."*\n\n## Three Freedoms in One\n\n- **Freedom of thought**: Your internal thoughts and beliefs are absolutely free\n- **Freedom of conscience**: The right to form and hold moral and ethical views\n- **Freedom of religion**: The right to practise, change, or abandon a religion\n\n## Absolute vs Qualified\n\nThe internal right to hold beliefs is absolute. The external right to *manifest* beliefs can be limited only when necessary to protect public safety, order, health, or the rights of others.\n\nInstitutions and care settings that impose religious observance or restrict belief expression violate Article 18.',
        videoUrl: vp('1209801480'),
        order: 2,
      },
    ],
  })

  const hr_m9_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m9_quiz' },
    update: {},
    create: { id: 'hr_m9_quiz', moduleId: hr_m9.id, title: 'Module 9 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m9_quiz.id, [
    {
      id: 'hr_m9_q1',
      text: 'Under Article 17, property can be taken by the government only if:',
      order: 1,
      options: [
        { text: 'There is a legitimate public purpose, due process, and fair compensation', isCorrect: true },
        { text: 'The government needs it and gives 30 days notice', isCorrect: false },
        { text: 'The owner has unpaid taxes', isCorrect: false },
        { text: 'A majority of parliament votes for it', isCorrect: false },
      ],
    },
    {
      id: 'hr_m9_q2',
      text: 'Which part of Article 18 is absolute and cannot be restricted?',
      order: 2,
      options: [
        { text: 'The internal freedom to hold thoughts and beliefs', isCorrect: true },
        { text: 'The right to public worship in any location', isCorrect: false },
        { text: 'The right to teach religion in all schools', isCorrect: false },
        { text: 'The right to build places of worship anywhere', isCorrect: false },
      ],
    },
  ])

  // ── Module 10: Expression and Assembly (Articles 19–20) ──────────────────────
  const hr_m10 = await prisma.module.upsert({
    where: { id: 'hr_m10' },
    update: {},
    create: {
      id: 'hr_m10',
      courseId: course1.id,
      title: 'Expression and Assembly',
      description: 'The freedom to express your views and to peacefully assemble and associate with others.',
      order: 10,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m10_l1',
        moduleId: hr_m10.id,
        title: 'Freedom of Opinion and Expression (Article 19)',
        content:
          '# Freedom of Opinion and Expression\n\nArticle 19 states: *"Everyone has the right to freedom of opinion and expression; this right includes freedom to hold opinions without interference and to seek, receive and impart information and ideas through any media and regardless of frontiers."*\n\n## Two Freedoms\n\n**Freedom of opinion**: The right to hold any view without interference. This is absolute — governments cannot punish you for what you think.\n\n**Freedom of expression**: The right to share ideas through speech, writing, art, and any other medium.\n\n## Why Expression Matters for Autistic People\n\nArticle 19 protects all forms of communication — including AAC devices, sign language, written communication, and other alternative and augmentative communication methods. The right to express yourself applies regardless of how you communicate.',
        videoUrl: vp('1209801701'),
        order: 1,
      },
      {
        id: 'hr_m10_l2',
        moduleId: hr_m10.id,
        title: 'Right to Peaceful Assembly and Association (Article 20)',
        content:
          '# Right to Peaceful Assembly and Association\n\nArticle 20 states: *"Everyone has the right to freedom of peaceful assembly and association. No one may be compelled to belong to an association."*\n\n## What This Covers\n\n- **Right to assemble**: The right to gather with others in public — for protests, celebrations, or any peaceful purpose\n- **Right to associate**: The right to form and join groups, organisations, unions, and political parties\n- **Freedom from forced association**: No one can be forced to join any organisation\n\n## Self-Advocacy and Organising\n\nFor autistic people, Article 20 underpins the right to form self-advocacy organisations, join disability rights groups, and participate in collective action for autistic rights.',
        videoUrl: vp('1209801707'),
        order: 2,
      },
    ],
  })

  const hr_m10_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m10_quiz' },
    update: {},
    create: { id: 'hr_m10_quiz', moduleId: hr_m10.id, title: 'Module 10 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m10_quiz.id, [
    {
      id: 'hr_m10_q1',
      text: 'Article 19 protects freedom of expression:',
      order: 1,
      options: [
        { text: 'Through any media, including all forms of communication', isCorrect: true },
        { text: 'Only through printed newspapers and official broadcasts', isCorrect: false },
        { text: 'Only in your home country', isCorrect: false },
        { text: 'Only for journalists and public figures', isCorrect: false },
      ],
    },
    {
      id: 'hr_m10_q2',
      text: 'Article 20 states that no one may be:',
      order: 2,
      options: [
        { text: 'Compelled to belong to any association', isCorrect: true },
        { text: 'Allowed to form political parties', isCorrect: false },
        { text: 'Permitted to hold protests near government buildings', isCorrect: false },
        { text: 'A member of more than one organisation at a time', isCorrect: false },
      ],
    },
  ])

  // ── Module 11: Democracy and Social Security (Articles 21–22) ────────────────
  const hr_m11 = await prisma.module.upsert({
    where: { id: 'hr_m11' },
    update: {},
    create: {
      id: 'hr_m11',
      courseId: course1.id,
      title: 'Democracy and Social Security',
      description: 'The right to participate in government and to receive social protection.',
      order: 11,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m11_l1',
        moduleId: hr_m11.id,
        title: 'Right to Democracy (Article 21)',
        content:
          '# Right to Democracy\n\nArticle 21 states that everyone has the right to take part in government, either directly or through freely chosen representatives, and that the will of the people is the basis of governmental authority.\n\n## What This Includes\n\n- **The right to vote**: Everyone can vote in genuine, periodic elections by secret ballot\n- **The right to stand for election**: Everyone can seek public office\n- **Equal access to public service**: No group should be excluded from public positions\n- **Government by the people**: Authority must come from the people, not from force\n\n## Barriers for Autistic and Disabled People\n\nAutistic people face many barriers to political participation — inaccessible polling stations, complex ballot designs, and guardianship laws that strip voting rights. Article 21 demands that political participation be made accessible to everyone.',
        videoUrl: vp('1209801756'),
        order: 1,
      },
      {
        id: 'hr_m11_l2',
        moduleId: hr_m11.id,
        title: 'Right to Social Security (Article 22)',
        content:
          '# Right to Social Security\n\nArticle 22 states: *"Everyone, as a member of society, has the right to social security and is entitled to realisation of the economic, social and cultural rights indispensable for his dignity and the free development of his personality."*\n\n## What Social Security Means\n\nSocial security is the system of support that protects people from economic hardship due to:\n- Unemployment or illness\n- Disability\n- Old age or poverty\n\n## For Disabled and Autistic People\n\nDisability benefits, care allowances, and support services are expressions of the right to social security. When governments cut disability benefits or impose inaccessible application processes, they risk violating Article 22.\n\nEvery autistic person is entitled to the social and economic support they need to live with dignity.',
        videoUrl: vp('1209802682'),
        order: 2,
      },
    ],
  })

  const hr_m11_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m11_quiz' },
    update: {},
    create: { id: 'hr_m11_quiz', moduleId: hr_m11.id, title: 'Module 11 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m11_quiz.id, [
    {
      id: 'hr_m11_q1',
      text: 'Article 21 states that governmental authority must come from:',
      order: 1,
      options: [
        { text: 'The will of the people, expressed through genuine elections', isCorrect: true },
        { text: 'The military as protector of the nation', isCorrect: false },
        { text: 'Religious leadership and tradition', isCorrect: false },
        { text: 'International organisations such as the United Nations', isCorrect: false },
      ],
    },
    {
      id: 'hr_m11_q2',
      text: 'The right to social security under Article 22 is intended to protect people from:',
      order: 2,
      options: [
        { text: 'Economic hardship due to unemployment, disability, illness, and old age', isCorrect: true },
        { text: 'Having to pay any form of taxation', isCorrect: false },
        { text: 'Price increases in the market economy', isCorrect: false },
        { text: 'Having to work in any job they do not choose', isCorrect: false },
      ],
    },
  ])

  // ── Module 12: Work and Rest (Articles 23–24) ─────────────────────────────────
  const hr_m12 = await prisma.module.upsert({
    where: { id: 'hr_m12' },
    update: {},
    create: {
      id: 'hr_m12',
      courseId: course1.id,
      title: 'Work and Rest',
      description: 'Everyone has the right to work with fair pay and conditions, and to rest and enjoy leisure.',
      order: 12,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m12_l1',
        moduleId: hr_m12.id,
        title: 'Right to Work and Fair Pay (Article 23)',
        content:
          '# Right to Work and Fair Pay\n\nArticle 23 covers four related rights:\n\n1. **The right to work**: Everyone has the right to work and to freely choose their employment\n2. **The right to just and favourable conditions**: Work must be safe and dignified\n3. **The right to equal pay for equal work**: Pay must not discriminate based on identity\n4. **The right to join trade unions**: Workers can organise collectively\n\n## For Autistic Workers\n\nAutistic people have the right to:\n- Work with reasonable accommodations\n- Equal pay for equal work\n- Safe, sensory-appropriate working conditions\n\nSub-minimum wage programmes that pay disabled workers less than the standard minimum wage directly violate Article 23.',
        videoUrl: vp('1209803257'),
        order: 1,
      },
      {
        id: 'hr_m12_l2',
        moduleId: hr_m12.id,
        title: 'Right to Rest and Leisure (Article 24)',
        content:
          '# Right to Rest and Leisure\n\nArticle 24 states: *"Everyone has the right to rest and leisure, including reasonable limitation of working hours and periodic holidays with pay."*\n\n## Why Rest Is a Human Right\n\nWithout rest, workers burn out and their health deteriorates. Life is not only about work — people have the right to time for themselves, their families, and their communities.\n\n## What This Includes\n\n- **Reasonable working hours**: Employers cannot demand unlimited work\n- **Regular rest periods**: Daily and weekly rest breaks\n- **Paid holidays**: Time off must not come at the cost of income\n\n## For Autistic People\n\nFor autistic workers, adequate rest is especially important. Sensory overload, masking, and navigating neurotypical workplaces can be exhausting. The right to rest helps prevent autistic burnout.',
        videoUrl: vp('1209803773'),
        order: 2,
      },
    ],
  })

  const hr_m12_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m12_quiz' },
    update: {},
    create: { id: 'hr_m12_quiz', moduleId: hr_m12.id, title: 'Module 12 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m12_quiz.id, [
    {
      id: 'hr_m12_q1',
      text: 'Sub-minimum wage programmes that pay disabled workers less than the standard minimum wage:',
      order: 1,
      options: [
        { text: 'Violate the right to equal pay for equal work under Article 23', isCorrect: true },
        { text: 'Are permitted as a reasonable accommodation for employers', isCorrect: false },
        { text: 'Are required by international labour standards', isCorrect: false },
        { text: 'Only apply in developing countries', isCorrect: false },
      ],
    },
    {
      id: 'hr_m12_q2',
      text: 'Article 24 specifically guarantees:',
      order: 2,
      options: [
        { text: 'Reasonable working hours, rest periods, and paid holidays', isCorrect: true },
        { text: 'A minimum of four weeks holiday per year for all workers', isCorrect: false },
        { text: 'The right to retire at age 60', isCorrect: false },
        { text: 'Free leisure facilities provided by the government', isCorrect: false },
      ],
    },
  ])

  // ── Module 13: Living Standards and Education (Articles 25–26) ───────────────
  const hr_m13 = await prisma.module.upsert({
    where: { id: 'hr_m13' },
    update: {},
    create: {
      id: 'hr_m13',
      courseId: course1.id,
      title: 'Living Standards and Education',
      description: 'Every person deserves an adequate standard of living and access to education.',
      order: 13,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m13_l1',
        moduleId: hr_m13.id,
        title: 'Right to an Adequate Standard of Living (Article 25)',
        content:
          '# Right to an Adequate Standard of Living\n\nArticle 25 states that everyone has the right to a standard of living adequate for the health and well-being of themselves and their family, including:\n\n- Food and clothing\n- Housing\n- Medical care\n- Necessary social services\n\nIt also specifically protects the rights of mothers and children, and states that all children — whether born in or out of wedlock — shall enjoy the same social protection.\n\n## Poverty as a Human Rights Issue\n\nWhen people cannot afford food, shelter, or healthcare, their human rights are being violated. Governments have obligations to ensure everyone can meet their basic needs.\n\n## Disability and Adequate Living Standards\n\nAutistic and disabled people often face higher costs of living while facing employment discrimination. Article 25 demands that states ensure disabled people can live with adequate resources.',
        videoUrl: vp('1209804048'),
        order: 1,
      },
      {
        id: 'hr_m13_l2',
        moduleId: hr_m13.id,
        title: 'Right to Education (Article 26)',
        content:
          '# Right to Education\n\nArticle 26 states that everyone has the right to education, and that elementary education shall be compulsory and free. Education shall be directed toward the full development of the human personality and shall promote understanding, tolerance, and friendship among all nations and groups.\n\n## Three Levels\n\n- **Elementary education**: Must be free and compulsory for all children\n- **Technical and professional education**: Must be generally available\n- **Higher education**: Must be equally accessible based on merit\n\n## Parents\' Rights\n\nParents have the right to choose the kind of education their children receive.\n\n## Inclusive Education\n\nFor autistic and disabled children, Article 26 — read alongside CRPD Article 24 — means the right to inclusive education with appropriate support, not segregation into inferior or under-resourced settings.',
        videoUrl: vp('1209804104'),
        order: 2,
      },
    ],
  })

  const hr_m13_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m13_quiz' },
    update: {},
    create: { id: 'hr_m13_quiz', moduleId: hr_m13.id, title: 'Module 13 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m13_quiz.id, [
    {
      id: 'hr_m13_q1',
      text: 'Article 25 specifically mentions the social protection of:',
      order: 1,
      options: [
        { text: 'Mothers and children, including all children regardless of birth status', isCorrect: true },
        { text: 'Only children born within marriage', isCorrect: false },
        { text: 'Only disabled people and elderly persons', isCorrect: false },
        { text: 'Workers who have contributed to social security for at least 10 years', isCorrect: false },
      ],
    },
    {
      id: 'hr_m13_q2',
      text: 'Under Article 26, elementary education must be:',
      order: 2,
      options: [
        { text: 'Free and compulsory for all children', isCorrect: true },
        { text: 'Free but optional for families to choose', isCorrect: false },
        { text: 'Compulsory but families may be charged fees', isCorrect: false },
        { text: 'Available only in government-run institutions', isCorrect: false },
      ],
    },
  ])

  // ── Module 14: Culture and World Order (Articles 27–28) ──────────────────────
  const hr_m14 = await prisma.module.upsert({
    where: { id: 'hr_m14' },
    update: {},
    create: {
      id: 'hr_m14',
      courseId: course1.id,
      title: 'Culture and World Order',
      description: 'The right to participate in cultural life and to live in a world order that protects human rights.',
      order: 14,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m14_l1',
        moduleId: hr_m14.id,
        title: 'Right to Cultural Life and Intellectual Property (Article 27)',
        content:
          '# Right to Cultural Life and Intellectual Property\n\nArticle 27 contains two rights:\n\n**The right to participate in cultural life**: Everyone has the right to freely participate in the cultural life of the community, to enjoy the arts, and to share in scientific advancement and its benefits.\n\n**The right to intellectual property**: Everyone has the right to the protection of the moral and material interests resulting from their creative work.\n\n## Cultural Participation\n\nCulture includes arts, music, literature, science, and the shared ways of life of a community. Cultural spaces, events, and activities must be accessible to everyone — including disabled and autistic people.\n\n## Autistic Culture\n\nThe autistic community has its own culture, identity, and shared experiences. Article 27 supports the right of autistic people to participate in both mainstream cultural life and their own community culture.',
        videoUrl: vp('1209804130'),
        order: 1,
      },
      {
        id: 'hr_m14_l2',
        moduleId: hr_m14.id,
        title: 'Right to a Fair and Free World Order (Article 28)',
        content:
          '# Right to a Fair and Free World Order\n\nArticle 28 states: *"Everyone is entitled to a social and international order in which the rights and freedoms set forth in this Declaration can be fully realised."*\n\n## What This Means\n\nArticle 28 recognises that individual human rights cannot be fully realised without a world order that supports them. This includes:\n\n- Peaceful international relations\n- Fair global economic systems\n- International cooperation on human rights\n- Structures that prevent war, exploitation, and oppression\n\n## The Systemic Dimension of Rights\n\nHuman rights are not just about protecting individuals from their governments — they require a global environment where justice is possible. Extreme global inequality and armed conflict undermine the realisation of human rights for billions of people.\n\nArticle 28 is a call for systemic change — not just individual protection.',
        videoUrl: vp('1209804264'),
        order: 2,
      },
    ],
  })

  const hr_m14_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m14_quiz' },
    update: {},
    create: { id: 'hr_m14_quiz', moduleId: hr_m14.id, title: 'Module 14 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m14_quiz.id, [
    {
      id: 'hr_m14_q1',
      text: 'Article 27 protects the right to:',
      order: 1,
      options: [
        { text: 'Participate in cultural life and have creative works protected', isCorrect: true },
        { text: 'Attend any cultural event free of charge', isCorrect: false },
        { text: 'Veto cultural content that offends personal values', isCorrect: false },
        { text: 'Publish creative work without government oversight', isCorrect: false },
      ],
    },
    {
      id: 'hr_m14_q2',
      text: 'Article 28 calls for:',
      order: 2,
      options: [
        { text: 'A social and international order in which all human rights can be fully realised', isCorrect: true },
        { text: 'A single world government to enforce human rights', isCorrect: false },
        { text: 'The abolition of all national borders', isCorrect: false },
        { text: 'Equal distribution of wealth across all countries', isCorrect: false },
      ],
    },
  ])

  // ── Module 15: Responsibilities and Safeguards (Articles 29–30) ──────────────
  const hr_m15 = await prisma.module.upsert({
    where: { id: 'hr_m15' },
    update: {},
    create: {
      id: 'hr_m15',
      courseId: course1.id,
      title: 'Responsibilities and Safeguards',
      description: 'Our duties to the community and the protection of rights from abuse and destruction.',
      order: 15,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'hr_m15_l1',
        moduleId: hr_m15.id,
        title: 'Duties to the Community (Article 29)',
        content:
          '# Duties to the Community\n\nArticle 29 states: *"Everyone has duties to the community in which alone the free and full development of his personality is possible."*\n\nIt also states that rights may be limited only by law, and only for the purposes of:\n- Securing due recognition and respect for the rights of others\n- Meeting the just requirements of morality, public order, and general welfare\n\n## Rights Come With Responsibilities\n\nHuman rights are not a licence for unlimited individual freedom at the expense of others. They exist in a social context — in communities where people depend on each other.\n\n## Community Belonging\n\nArticle 29 recognises something profound: human beings develop as people *within communities*. Isolation and exclusion are not just uncomfortable — they prevent the full development of our humanity.',
        videoUrl: vp('1209804287'),
        order: 1,
      },
      {
        id: 'hr_m15_l2',
        moduleId: hr_m15.id,
        title: 'Protecting Rights from Destruction (Article 30)',
        content:
          '# Protecting Rights from Destruction\n\nArticle 30 states: *"Nothing in this Declaration may be interpreted as implying for any State, group or person any right to engage in any activity or to perform any act aimed at the destruction of any of the rights and freedoms set forth herein."*\n\n## The Safeguard Clause\n\nArticle 30 is the UDHR\'s self-defence mechanism. It prevents anyone — a state, an organisation, or an individual — from using the language of human rights to justify destroying human rights.\n\n## What This Means in Practice\n\n- A state cannot claim that "national rights" justify suppressing individual rights\n- A group cannot use freedom of assembly to organise the destruction of others\' rights\n- An individual cannot claim freedom of expression to incite violence against others\n\n## The Closing Principle\n\nHuman rights exist to protect human dignity — not to provide a loophole for those who wish to destroy it. These 30 rights are the minimum standards of dignity that every human being is entitled to by virtue of being human.',
        order: 2,
      },
    ],
  })

  const hr_m15_quiz = await prisma.quiz.upsert({
    where: { id: 'hr_m15_quiz' },
    update: {},
    create: { id: 'hr_m15_quiz', moduleId: hr_m15.id, title: 'Module 15 Quiz', passingScore: 70, maxAttempts: 3 },
  })

  await seedQuestions(hr_m15_quiz.id, [
    {
      id: 'hr_m15_q1',
      text: 'According to Article 29, human rights may be limited by law only to:',
      order: 1,
      options: [
        { text: 'Protect the rights of others and meet just requirements of morality, public order, and welfare', isCorrect: true },
        { text: 'Protect the economic interests of the state', isCorrect: false },
        { text: 'Prevent criticism of the government', isCorrect: false },
        { text: 'Promote the majority culture in a society', isCorrect: false },
      ],
    },
    {
      id: 'hr_m15_q2',
      text: 'Article 30 exists to prevent:',
      order: 2,
      options: [
        { text: 'Anyone using the UDHR to justify destroying the rights it protects', isCorrect: true },
        { text: 'Countries from adding their own national rights laws', isCorrect: false },
        { text: 'Individuals from waiving their own rights voluntarily', isCorrect: false },
        { text: 'Courts from interpreting human rights broadly', isCorrect: false },
      ],
    },
  ])

  // ── Course 2: Autism Rights ───────────────────────────────────────────────────
  const course2 = await prisma.course.upsert({
    where: { slug: 'autism-rights' },
    update: {},
    create: {
      title: 'Autism Rights',
      slug: 'autism-rights',
      description:
        'Explore the rights of autistic people — from international legal protections and educational entitlements to self-advocacy and community inclusion. Empowering autistic individuals, families, and allies to understand and uphold autism rights.',
      category: 'Human Rights',
      level: CourseLevel.BEGINNER,
      published: true,
      isFree: true,
      instructorId: instructor.id,
    },
  })

  // ── Module 1: Understanding Autism Rights ────────────────────────────────────
  const ar_m1 = await prisma.module.upsert({
    where: { id: 'ar_m1' },
    update: {},
    create: {
      id: 'ar_m1',
      courseId: course2.id,
      title: 'Understanding Autism Rights',
      description: 'Explore the foundations of autism rights and why they matter.',
      order: 1,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'ar_m1_l1',
        moduleId: ar_m1.id,
        title: 'What Are Autism Rights?',
        content:
          "# What Are Autism Rights?\n\nAutism rights are the application of universal human rights principles specifically to autistic people — recognising that being autistic does not reduce a person's worth, dignity, or entitlement to full participation in society.\n\nThe autism rights movement challenges:\n- Deficit-based thinking that sees autism as only a problem to be fixed\n- Practices that aim to make autistic people appear \"normal\" at the cost of their wellbeing\n- Exclusion from education, employment, and community life\n\nInstead, it promotes:\n- The value of autistic identity and culture\n- Accommodations that allow autistic people to thrive as themselves\n- Full legal recognition and protection\n\n> **Remember:** Autism rights are not \"special privileges\" — they are the same rights everyone has, made accessible.",
        order: 1,
      },
      {
        id: 'ar_m1_l2',
        moduleId: ar_m1.id,
        title: 'The History of the Autism Rights Movement',
        content:
          '# The History of the Autism Rights Movement\n\nThe autism rights movement grew out of the broader disability rights movement of the 1970s and 1980s. Here are key milestones:\n\n**1970s–1980s**\nDisability rights activists establish the social model of disability — arguing that people are disabled by barriers in society, not by their conditions alone.\n\n**1990**\nThe Americans with Disabilities Act (ADA) is signed into law in the US, providing sweeping civil rights protections for disabled people.\n\n**1990s–2000s**\nAutistic self-advocacy organisations emerge. "Nothing About Us Without Us" becomes a rallying call — demanding that autistic people lead conversations about their own lives.\n\n**2006**\nThe UN Convention on the Rights of Persons with Disabilities (CRPD) is adopted — the most comprehensive international disability rights instrument ever created.\n\n**2007 onward**\nThe Autism Rights Movement gains global momentum. Autistic-led organisations challenge harmful practices and promote neurodiversity.\n\nToday, the movement continues to grow — advocating for presumed competence, supported decision-making, and autistic leadership at every level.',
        order: 2,
      },
      {
        id: 'ar_m1_l3',
        moduleId: ar_m1.id,
        title: 'The Social Model vs The Medical Model',
        content:
          "# The Social Model vs The Medical Model\n\nHow we understand autism shapes how we respond to it. Two dominant models have very different implications for rights.\n\n## The Medical Model\nViews autism as a disorder — a deficit within the individual that needs to be diagnosed, treated, and ideally cured. Under this model:\n- Autistic people are primarily patients\n- The goal is to make autistic behaviour more \"normal\"\n- Success is measured by how less autistic a person appears\n\n## The Social Model\nViews autism as a natural variation in human neurology. Challenges arise largely from a world designed for neurotypical people. Under this model:\n- Autistic people are citizens with rights\n- The goal is to remove barriers and provide genuine accommodations\n- Success means autistic people can live full, authentic lives on their own terms\n\n## Which Model Supports Rights?\nThe social model underpins the CRPD and the autism rights movement. It does not deny that autistic people may face genuine challenges — but it argues the solution is support and inclusion, not erasing autism.\n\n**Think about it:** A wheelchair user is not disabled by their wheelchair — they are disabled by buildings without ramps. An autistic person is often not disabled by their neurology — they are disabled by environments that refuse to accommodate them.",
        order: 3,
      },
    ],
  })

  const ar_m1_quiz = await prisma.quiz.upsert({
    where: { id: 'ar_m1_quiz' },
    update: {},
    create: {
      id: 'ar_m1_quiz',
      moduleId: ar_m1.id,
      title: 'Module 1 Quiz',
      passingScore: 70,
      maxAttempts: 3,
    },
  })

  await seedQuestions(ar_m1_quiz.id, [
    {
      id: 'ar_m1_q1',
      text: 'The rallying call "Nothing About Us Without Us" means:',
      order: 1,
      options: [
        {
          text: 'Autistic people must lead decisions that affect their lives',
          isCorrect: true,
        },
        { text: 'Autistic people should be left alone without support', isCorrect: false },
        { text: 'No laws should mention autism without legal consent', isCorrect: false },
        { text: 'Families should decide everything for autistic individuals', isCorrect: false },
      ],
    },
    {
      id: 'ar_m1_q2',
      text: 'The social model of disability argues that:',
      order: 2,
      options: [
        {
          text: "Barriers in society — not the individual's neurology — create much of the disability experience",
          isCorrect: true,
        },
        { text: 'Autism is a disease that must be cured before rights apply', isCorrect: false },
        { text: 'Disabled people need to adapt to society, not the other way around', isCorrect: false },
        { text: 'Social media is the main cause of autism', isCorrect: false },
      ],
    },
    {
      id: 'ar_m1_q3',
      text: 'Which US law passed in 1990 provided major civil rights protections for disabled people?',
      order: 3,
      options: [
        { text: 'The Americans with Disabilities Act (ADA)', isCorrect: true },
        { text: 'The Individuals with Disabilities Education Act (IDEA)', isCorrect: false },
        { text: 'The Rehabilitation Act', isCorrect: false },
        { text: 'The Civil Rights Act', isCorrect: false },
      ],
    },
  ])

  // ── Module 2: Legal Rights and Protections ───────────────────────────────────
  const ar_m2 = await prisma.module.upsert({
    where: { id: 'ar_m2' },
    update: {},
    create: {
      id: 'ar_m2',
      courseId: course2.id,
      title: 'Legal Rights and Protections',
      description: 'Understand the laws and international agreements that protect autistic people.',
      order: 2,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'ar_m2_l1',
        moduleId: ar_m2.id,
        title: 'The UN CRPD and Autism',
        content:
          "# The UN CRPD and Autism\n\nThe UN Convention on the Rights of Persons with Disabilities (CRPD), adopted in 2006, is the landmark international human rights treaty for disabled people — including autistic people.\n\n## Key Articles for Autistic People\n\n**Article 5 – Equality and Non-Discrimination**\nAutistic people must not be discriminated against in any area of life.\n\n**Article 7 – Children with Disabilities**\nAutistic children have the same rights as all children, with their best interests as a primary consideration.\n\n**Article 12 – Equal Recognition Before the Law**\nAutistic adults have full legal capacity. Supported decision-making must replace forced guardianship wherever possible.\n\n**Article 19 – Living Independently and Being Included in the Community**\nAutistic people have the right to live in the community with the support they need — not to be institutionalised.\n\n**Article 24 – Education**\nAutistic children have the right to inclusive education in their local community with reasonable accommodations.\n\n**Article 27 – Work and Employment**\nAutistic people have the right to work with reasonable accommodations, in open employment on equal terms.\n\nOver 180 countries have ratified the CRPD. Ratification means governments commit to implementing these rights in national law.",
        order: 1,
      },
      {
        id: 'ar_m2_l2',
        moduleId: ar_m2.id,
        title: 'The Right to Inclusive Education',
        content:
          "# The Right to Inclusive Education\n\nEducation is one of the most contested areas of autism rights. Around the world, autistic children are disproportionately excluded from mainstream schools, placed in segregated settings, or denied quality education altogether.\n\n## The International Standard\nCRPD Article 24 requires **inclusive education** — meaning autistic children learn alongside their peers with appropriate support, not in separate institutions.\n\n## Key Principles\n\n**Free Appropriate Public Education (FAPE)**\nAutistic students are entitled to an education specifically designed to meet their individual needs at no cost to the family.\n\n**Least Restrictive Environment (LRE)**\nAutistic students should be educated in the most inclusive setting possible — with support, not removal.\n\n**Individual Education Plans (IEPs)**\nAutistic students should have tailored learning plans developed with input from the student and family — not imposed on them.\n\n**Reasonable Accommodations**\nSchools must provide accommodations such as:\n- Extra time on assessments\n- Quiet exam rooms\n- Alternative communication methods\n- Sensory-friendly environments\n- Visual schedules and structured routines\n\n## What To Do If a School Refuses\nIf a school is refusing to accommodate an autistic child or pushing for exclusion:\n1. Request everything in writing\n2. Request an IEP meeting\n3. Involve a disability rights advocate or lawyer\n4. Escalate to education authorities and national human rights bodies if needed",
        order: 2,
      },
      {
        id: 'ar_m2_l3',
        moduleId: ar_m2.id,
        title: 'Employment Rights and Workplace Accommodations',
        content:
          "# Employment Rights and Workplace Accommodations\n\nAutistic people have the right to work. Employment discrimination against autistic people is a human rights violation.\n\n## Common Workplace Barriers\nAutistic employees often face:\n- Bias in traditional interview processes (e.g. eye contact, small talk)\n- Sensory challenges in open-plan offices\n- Unclear or unwritten social rules of workplace culture\n- Burnout from masking autistic traits for long periods\n- Lack of understanding from managers and colleagues\n\n## Legal Protections\nUnder most national disability rights laws and the CRPD, employers must provide **reasonable accommodations**. These may include:\n- Written instructions rather than verbal-only briefings\n- Flexible hours or remote work options\n- A quieter workspace or noise-cancelling headphones\n- Clear, direct communication of expectations\n- Job coaching or structured onboarding\n\n## The Business Case\nResearch shows neurodivergent employees bring unique strengths: pattern recognition, deep focus, attention to detail, and creative problem-solving. Major organisations have neurodiversity hiring programmes because of the value autistic employees bring.\n\n## If You Face Discrimination\n1. Document the discrimination in writing with dates\n2. Request reasonable accommodations formally in writing\n3. Speak with your HR department\n4. Contact your national disability rights commission\n5. Seek legal advice if the employer refuses to accommodate",
        order: 3,
      },
    ],
  })

  const ar_m2_quiz = await prisma.quiz.upsert({
    where: { id: 'ar_m2_quiz' },
    update: {},
    create: {
      id: 'ar_m2_quiz',
      moduleId: ar_m2.id,
      title: 'Module 2 Quiz',
      passingScore: 70,
      maxAttempts: 3,
    },
  })

  await seedQuestions(ar_m2_quiz.id, [
    {
      id: 'ar_m2_q1',
      text: 'CRPD Article 19 guarantees autistic people the right to:',
      order: 1,
      options: [
        {
          text: 'Live independently in the community with necessary support',
          isCorrect: true,
        },
        { text: 'Be placed in specialist institutions for their safety', isCorrect: false },
        { text: 'Receive a universal income regardless of employment', isCorrect: false },
        { text: 'Attend university free of charge', isCorrect: false },
      ],
    },
    {
      id: 'ar_m2_q2',
      text: 'An Individual Education Plan (IEP) is:',
      order: 2,
      options: [
        {
          text: 'A tailored learning plan for a student with specific educational needs',
          isCorrect: true,
        },
        { text: 'A court document ordering school inclusion', isCorrect: false },
        { text: 'A government certificate proving autism diagnosis', isCorrect: false },
        { text: 'A training plan for teachers only', isCorrect: false },
      ],
    },
    {
      id: 'ar_m2_q3',
      text: 'Which of the following is a reasonable workplace accommodation for an autistic employee?',
      order: 3,
      options: [
        {
          text: 'Providing written instructions instead of verbal-only briefings',
          isCorrect: true,
        },
        { text: 'Paying the employee less because they have autism', isCorrect: false },
        { text: 'Removing the employee from all team projects', isCorrect: false },
        { text: 'Requiring the employee to work overtime to prove themselves', isCorrect: false },
      ],
    },
  ])

  // ── Module 3: Self-Advocacy and Community Power ──────────────────────────────
  const ar_m3 = await prisma.module.upsert({
    where: { id: 'ar_m3' },
    update: {},
    create: {
      id: 'ar_m3',
      courseId: course2.id,
      title: 'Self-Advocacy and Community Power',
      description: 'Learn how to advocate for yourself and support the autism rights community.',
      order: 3,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'ar_m3_l1',
        moduleId: ar_m3.id,
        title: 'What Is Self-Advocacy?',
        content:
          "# What Is Self-Advocacy?\n\nSelf-advocacy is the ability to speak up for yourself — to communicate your needs, make your own choices, and stand up for your rights.\n\nFor autistic people, self-advocacy is especially powerful because for so long, decisions about autistic lives were made by non-autistic parents, doctors, and policymakers — often without consulting autistic people themselves.\n\n## Core Self-Advocacy Skills\n\n**Know your rights**\nYou cannot advocate effectively if you don't know what you're entitled to. That's what this course is here for.\n\n**Know your needs**\nIdentify what accommodations, support, and environments help you thrive. You are the expert on your own experience.\n\n**Communicate clearly**\nSelf-advocacy does not require being loud or confrontational. It can be a calmly written email, a clear statement of needs, or a formal complaint.\n\n**Document everything**\nKeep records of requests made, responses received, and any incidents. A paper trail is powerful.\n\n**Build your network**\nSelf-advocacy is stronger when allies — family, friends, colleagues, or advocates — support and amplify your voice.\n\n> **Remember:** Nobody knows your experience of autism better than you do. Your voice matters. Your needs are valid. You have the right to be heard.",
        order: 1,
      },
      {
        id: 'ar_m3_l2',
        moduleId: ar_m3.id,
        title: 'Supported Decision-Making vs Guardianship',
        content:
          "# Supported Decision-Making vs Guardianship\n\nOne of the most important autism rights issues for adults is who makes decisions about an autistic person's life.\n\n## Traditional Guardianship\nWhen an autistic adult is deemed to lack \"capacity,\" a guardian (usually a family member or court appointee) is given legal authority to make decisions on their behalf — about where they live, how money is spent, who they can marry, even what medical treatment they receive.\n\n**The problem:** Guardianship removes legal personhood. The autistic person becomes a legal non-entity in their own life.\n\n## Supported Decision-Making\nThe CRPD (Article 12) calls for supported decision-making as an alternative. This means:\n- The autistic person retains their legal rights and decision-making authority\n- Trusted supporters help them understand options, weigh consequences, and communicate decisions\n- The decision remains theirs to make\n\n## Why This Matters\nGuardianship has been used to:\n- Force autistic people into institutions against their will\n- Allow non-consensual medical procedures\n- Prevent autistic adults from marrying or having children\n- Enable financial abuse by controlling access to money\n\nSupported decision-making respects autonomy while ensuring people have the help they genuinely need. The default must always be the least restrictive option.",
        order: 2,
      },
      {
        id: 'ar_m3_l3',
        moduleId: ar_m3.id,
        title: 'Fighting Stigma and Building Allies',
        content:
          "# Fighting Stigma and Building Allies\n\nAutism rights cannot be achieved in isolation. Fighting stigma and building alliances is essential for systemic change.\n\n## Forms of Stigma\n- **Stereotyping:** Assuming all autistic people are the same\n- **Pity:** Treating autistic people as tragic or broken\n- **Fear:** Falsely linking autism to violence or danger\n- **Invisibility:** Ignoring autistic voices in decisions that affect autistic lives\n\n## How Stigma Causes Real Harm\n- Exclusion from schools, workplaces, and public life\n- Families hiding their autistic children out of shame\n- Autistic people masking to survive — causing serious mental health consequences\n- Under-reporting of abuse and neglect of autistic people\n\n## How to Fight Stigma\n1. Use accurate, evidence-based information about autism\n2. Amplify content created by autistic people themselves\n3. Challenge harmful language calmly but firmly\n4. Share personal stories — human stories shift more hearts than statistics alone\n5. Support autistic-led organisations with your time, money, and platform\n\n## Being a Good Ally\nIf you are not autistic, you can still be a powerful ally:\n- Listen to autistic people about their own experience — don't speak over them\n- Advocate for accommodations in your workplace, school, or community\n- Challenge exclusion when you see it\n- Presume competence — never underestimate an autistic person",
        order: 3,
      },
    ],
  })

  const ar_m3_quiz = await prisma.quiz.upsert({
    where: { id: 'ar_m3_quiz' },
    update: {},
    create: {
      id: 'ar_m3_quiz',
      moduleId: ar_m3.id,
      title: 'Module 3 Quiz',
      passingScore: 70,
      maxAttempts: 3,
    },
  })

  await seedQuestions(ar_m3_quiz.id, [
    {
      id: 'ar_m3_q1',
      text: 'Self-advocacy means:',
      order: 1,
      options: [
        { text: 'Speaking up for your own needs and rights', isCorrect: true },
        { text: 'Hiring a lawyer to represent you at all times', isCorrect: false },
        { text: 'Refusing to accept any support from others', isCorrect: false },
        { text: 'Only communicating through formal written documents', isCorrect: false },
      ],
    },
    {
      id: 'ar_m3_q2',
      text: 'Supported decision-making differs from guardianship because:',
      order: 2,
      options: [
        {
          text: 'The autistic person retains their legal rights and makes their own decisions with support',
          isCorrect: true,
        },
        { text: 'A guardian makes all decisions on behalf of the autistic person', isCorrect: false },
        { text: 'Courts are always required to approve supported decisions', isCorrect: false },
        { text: 'Supported decision-making only applies to financial matters', isCorrect: false },
      ],
    },
    {
      id: 'ar_m3_q3',
      text: 'Autistic masking refers to:',
      order: 3,
      options: [
        {
          text: 'Hiding or suppressing autistic traits to appear neurotypical, often causing serious mental health harm',
          isCorrect: true,
        },
        { text: 'Wearing face coverings for sensory reasons', isCorrect: false },
        { text: 'Exaggerating disability for financial benefits', isCorrect: false },
        { text: 'A technique used in drama therapy', isCorrect: false },
      ],
    },
  ])

  // ── Module 4: Taking Action ──────────────────────────────────────────────────
  const ar_m4 = await prisma.module.upsert({
    where: { id: 'ar_m4' },
    update: {},
    create: {
      id: 'ar_m4',
      courseId: course2.id,
      title: 'Taking Action: Resources and Next Steps',
      description: 'Put your knowledge into practice and connect with the autism rights community.',
      order: 4,
    },
  })

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'ar_m4_l1',
        moduleId: ar_m4.id,
        title: 'Key Organizations and Resources',
        content:
          "# Key Organizations and Resources\n\nKnowing where to turn for help, community, and information is essential for anyone engaged in autism rights.\n\n## Autistic-Led Organizations\n- **Autistic Self Advocacy Network (ASAN)** — policy, advocacy, and resources led entirely by autistic people\n- **Autism Women & Nonbinary Network (AWN)** — centering multiply-marginalised autistic people\n- **International Autistic People's Organization (IAPO)** — global autistic-led advocacy\n\n## Human Rights Bodies\n- **UN Committee on the Rights of Persons with Disabilities** — monitors CRPD implementation worldwide\n- **African Commission on Human and Peoples' Rights** — handles complaints from African nations\n- **Your National Human Rights Commission** — usually the first point of call for domestic complaints\n\n## Practical Advocacy Tools\n- Keep written records of every rights violation or discrimination incident with dates and details\n- Photograph inaccessible environments as evidence\n- Collect witness statements from those who observed incidents\n- Use Freedom of Information requests to access government documents\n- Partner with legal aid clinics and disability rights lawyers\n\n## Online Communities\nOnline spaces have been transformative for autistic people who may not have access to local communities. Look for autistic-led spaces — communities where autistic people find each other, share experiences, and organise together.",
        order: 1,
      },
      {
        id: 'ar_m4_l2',
        moduleId: ar_m4.id,
        title: 'How USIASDHR Supports Autism Rights',
        content:
          "# How USIASDHR Supports Autism Rights\n\nThe United States Institute of Autism Spectrum Disorder and Human Rights (USIASDHR) was founded on a belief that every human being deserves dignity, respect, and justice — and that autistic people are no exception.\n\n## Our Approach\nUSIASDHR combines human rights principles with autism education to:\n- Train families, caregivers, and professionals in rights-based approaches\n- Provide accessible, high-quality learning on autism and disability rights\n- Advocate for policy change that supports autistic people's full inclusion in society\n- Amplify autistic voices in everything we do\n\n## Our Commitment to Every Learner\nWhether you are an autistic person learning about your rights, a parent navigating an education system, a teacher building an inclusive classroom, or a professional seeking ethical practice — USIASDHR is here to support you.\n\nEvery course we offer is designed with:\n- Clear, plain language accessible to all\n- Calm, accessible design\n- Evidence-based content\n- A rights-affirming, neurodiversity-positive perspective\n\n## What Comes Next?\nThis course is one step in your rights journey. Share what you have learned. Take action in your community. And remember: the fight for autism rights is a human rights fight — for justice, dignity, and belonging for everyone.",
        order: 2,
      },
    ],
  })

  const ar_m4_quiz = await prisma.quiz.upsert({
    where: { id: 'ar_m4_quiz' },
    update: {},
    create: {
      id: 'ar_m4_quiz',
      moduleId: ar_m4.id,
      title: 'Final Quiz',
      passingScore: 70,
      maxAttempts: 3,
    },
  })

  await seedQuestions(ar_m4_quiz.id, [
    {
      id: 'ar_m4_q1',
      text: 'Which of the following is an autistic-led organisation?',
      order: 1,
      options: [
        { text: 'Autistic Self Advocacy Network (ASAN)', isCorrect: true },
        { text: 'Autism Speaks', isCorrect: false },
        { text: 'World Health Organization', isCorrect: false },
        { text: 'UNICEF', isCorrect: false },
      ],
    },
    {
      id: 'ar_m4_q2',
      text: "USIASDHR's approach to autism education is best described as:",
      order: 2,
      options: [
        { text: 'Rights-based, inclusive, and evidence-informed', isCorrect: true },
        { text: 'Medical model focused on treatment and cure', isCorrect: false },
        { text: 'Charity-based with a focus on sympathy', isCorrect: false },
        { text: 'Academic only, not applicable to everyday life', isCorrect: false },
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
  console.log('─────────────────────────────────────────────────────')
  console.log('  Admin      admin@usiasdhr.org          /  Admin1234!')
  console.log('  Instructor instructor@usiasdhr.org     /  Instructor1234!')
  console.log('             (Maria Okafor)')
  console.log('  Student    student@usiasdhr.org        /  Student1234!')
  console.log('─────────────────────────────────────────────────────')
  console.log('  Course 1:  Human Rights   → /courses/human-rights')
  console.log('  Course 2:  Autism Rights  → /courses/autism-rights')
  console.log('─────────────────────────────────────────────────────')
  console.log('  NOTE: If old placeholder courses appear, run:')
  console.log('  npx prisma migrate reset  (clears all data + re-seeds)')
  console.log('─────────────────────────────────────────────────────')
}

// ── helpers ───────────────────────────────────────────────────────────────────
type OptionSeed = { text: string; isCorrect: boolean }
type QuestionSeed = { id: string; text: string; order: number; options: OptionSeed[] }

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
