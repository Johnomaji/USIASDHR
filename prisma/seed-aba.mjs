import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, CourseLevel } from '@prisma/client'

const adapter = new PrismaPg(process.env.DATABASE_URL)
const prisma = new PrismaClient({ adapter })

async function run() {
  const instructor = await prisma.user.findFirst({ where: { role: 'INSTRUCTOR' }, select: { id: true, name: true } })
  console.log('Instructor:', instructor.name)

  const course = await prisma.course.upsert({
    where: { slug: 'applied-behavior-analysis' },
    update: {},
    create: {
      title: 'Applied Behavior Analysis (ABA)',
      slug: 'applied-behavior-analysis',
      description: 'A beginner-friendly introduction to Applied Behavior Analysis — covering the core principles of behavior science, reinforcement, data collection, skill teaching, and ethical practice. Ideal for parents, caregivers, educators, and support workers who want practical, evidence-based strategies for supporting autistic individuals.',
      category: 'ABA',
      level: CourseLevel.BEGINNER,
      published: true,
      isFree: true,
      instructorId: instructor.id,
    },
  })
  console.log('Course:', course.title, course.id)

  const modules = [
    { id: 'aba_m1', order: 1, title: 'Introduction to ABA',        description: 'What ABA is, where it came from, and why it matters for autism support.' },
    { id: 'aba_m2', order: 2, title: 'Understanding Behavior',      description: 'How ABA defines behavior and the ABC model that explains why behaviors occur.' },
    { id: 'aba_m3', order: 3, title: 'Reinforcement',               description: 'The science of reinforcement — the engine behind all behavior change in ABA.' },
    { id: 'aba_m4', order: 4, title: 'Behavior Reduction',          description: 'Ethical, evidence-based strategies for reducing challenging behaviors.' },
    { id: 'aba_m5', order: 5, title: 'Teaching New Skills',         description: 'How ABA is used to systematically build communication, social, and daily living skills.' },
    { id: 'aba_m6', order: 6, title: 'Measurement and Data',        description: 'Why data collection is central to ABA and the key methods practitioners use.' },
    { id: 'aba_m7', order: 7, title: 'Generalization and Maintenance', description: 'Ensuring skills learned in therapy transfer to everyday life and are retained over time.' },
    { id: 'aba_m8', order: 8, title: 'Ethics in ABA',               description: 'The ethical principles that guide responsible ABA practice, including the autistic rights perspective.' },
  ]

  for (const m of modules) {
    await prisma.module.upsert({ where: { id: m.id }, update: {}, create: { ...m, courseId: course.id } })
    console.log('  Module:', m.title)
  }

  const lessons = [
    // ── Module 1 ─────────────────────────────────────────────────────────────────
    {
      id: 'aba_m1_l1', moduleId: 'aba_m1', order: 1,
      title: 'What Is Applied Behavior Analysis?',
      content: `# What Is Applied Behavior Analysis?

Applied Behavior Analysis (ABA) is a scientific discipline that uses principles of learning and behavior to improve socially significant behaviors. The word *applied* distinguishes it from basic research — ABA focuses on real-world skills and challenges.

## The Seven Dimensions of ABA

In 1968, Baer, Wolf, and Risley defined seven characteristics that define ABA practice:

1. **Applied** — targets behaviors that matter to the individual and society
2. **Behavioral** — focuses on observable, measurable actions
3. **Analytic** — demonstrates a clear relationship between intervention and behavior change
4. **Technological** — procedures are described precisely enough for anyone to replicate
5. **Conceptually Systematic** — techniques are grounded in behavioral principles
6. **Effective** — produces meaningful, practical change
7. **Generality** — behavior changes carry over to new settings and situations

## Who Uses ABA?

ABA is used with autistic individuals, children with developmental delays, and in many other contexts including education, organizational behavior management, and sports psychology. It is most widely known as an intervention approach for autism.`,
    },
    {
      id: 'aba_m1_l2', moduleId: 'aba_m1', order: 2,
      title: 'History and Foundations of ABA',
      content: `# History and Foundations of ABA

## Origins in Behaviorism

ABA grew from behaviorism, a school of psychology founded by John B. Watson in the early 20th century. Behaviorists argued that psychology should study observable behavior, not internal mental states.

## B.F. Skinner and Operant Conditioning

B.F. Skinner's work in the 1930s–1950s was foundational. He demonstrated that behavior is shaped by its consequences — a process he called **operant conditioning**. His research introduced key concepts still used in ABA today:

- **Reinforcement**: Consequences that increase behavior
- **Punishment**: Consequences that decrease behavior
- **Extinction**: Removing reinforcement to reduce behavior

## ABA and Autism

In the 1960s, Dr. O. Ivar Lovaas applied these principles to autism, showing that intensive behavioral intervention could produce significant developmental gains. His work led to the widespread adoption of ABA as an autism intervention.

## Modern ABA

Contemporary ABA has moved far from its early forms. Modern practitioners emphasize:

- Positive reinforcement over punishment
- Child-led and naturalistic approaches
- Building on strengths and interests
- Collaboration with autistic individuals and their families
- Respect for neurodiversity`,
    },
    // ── Module 2 ─────────────────────────────────────────────────────────────────
    {
      id: 'aba_m2_l1', moduleId: 'aba_m2', order: 1,
      title: 'Defining Behavior in ABA',
      content: `# Defining Behavior in ABA

In everyday language, "behavior" can mean anything from a habit to a personality trait. In ABA, the definition is much more precise.

## ABA's Definition of Behavior

A **behavior** is any observable and measurable action performed by a living organism. To count as a behavior in ABA:

- It must be **observable** — someone can see or hear it happening
- It must be **measurable** — it can be counted, timed, or otherwise quantified

## Why This Matters

This precise definition ensures that everyone working with an individual is measuring the same thing. Vague descriptions like "has a bad attitude" are not behaviors — "yells when asked to transition to a new activity" is.

## Dead Man's Test

A useful check: if a dead person can do it, it is not a behavior. "Sits quietly" passes — a dead person can sit quietly. "Stays on task for 10 minutes" does not, because a dead person cannot stay on task.

## Types of Behavior

- **Respondent behavior**: Automatic responses triggered by stimuli (e.g., flinching at a loud noise)
- **Operant behavior**: Voluntary actions influenced by their consequences (e.g., asking for a snack)

ABA primarily focuses on operant behavior because it is most influenced by the environment and most amenable to change.`,
    },
    {
      id: 'aba_m2_l2', moduleId: 'aba_m2', order: 2,
      title: 'The ABC Model',
      content: `# The ABC Model

The ABC model is the cornerstone of behavioral analysis. It describes the three-part sequence that explains why behaviors occur.

## A — Antecedent

The **antecedent** is what happens immediately *before* a behavior. It sets the occasion for the behavior to occur.

Examples:
- A teacher gives an instruction
- A loud noise begins
- A preferred item is taken away

## B — Behavior

The **behavior** is the observable action the person performs in response to the antecedent.

Examples:
- The child complies with the instruction
- The child covers their ears
- The child cries

## C — Consequence

The **consequence** is what happens immediately *after* the behavior. Consequences determine whether a behavior will occur more or less often in the future.

Examples:
- The child receives praise (likely to comply again)
- The noise stops (covering ears worked — likely to repeat)
- The item is returned (crying worked — likely to repeat)

## Using ABC in Practice

By carefully observing and recording ABCs, practitioners can identify *why* a behavior is happening. This is called a **functional assessment**, and it guides all behavior intervention planning. You cannot effectively change a behavior without first understanding its function.`,
    },
    // ── Module 3 ─────────────────────────────────────────────────────────────────
    {
      id: 'aba_m3_l1', moduleId: 'aba_m3', order: 1,
      title: 'Positive and Negative Reinforcement',
      content: `# Positive and Negative Reinforcement

Reinforcement is any consequence that *increases* the future frequency of a behavior. It is the most important concept in ABA.

## Positive Reinforcement

**Positive reinforcement** means *adding* something desirable after a behavior, which increases the likelihood the behavior will happen again.

Examples:
- A child asks for a break → they receive a 5-minute break → they ask for breaks more often
- A student completes their work → the teacher gives verbal praise → the student completes work more consistently

## Negative Reinforcement

**Negative reinforcement** means *removing* something aversive after a behavior, which increases the likelihood of that behavior occurring again.

> **Common misconception**: Negative reinforcement is NOT punishment. Both forms of reinforcement *increase* behavior.

Examples:
- A child engages in self-injury → the demand is removed → self-injury increases (escape-maintained behavior)
- A person takes pain medication → their headache goes away → they take medication more readily in the future

## Individual Reinforcers

What works as a reinforcer is entirely individual. A sticker that motivates one child may mean nothing to another. Effective ABA practitioners conduct **preference assessments** to identify what is truly motivating for each person.

## Schedules of Reinforcement

How often reinforcement is delivered matters:
- **Continuous**: Every correct response is reinforced (best for teaching new skills)
- **Intermittent**: Only some responses are reinforced (best for maintaining established skills)`,
    },
    {
      id: 'aba_m3_l2', moduleId: 'aba_m3', order: 2,
      title: 'Punishment and Extinction',
      content: `# Punishment and Extinction

## Punishment in ABA

In ABA, **punishment** is any consequence that *decreases* the future frequency of a behavior. Like reinforcement, it has two forms.

### Positive Punishment
*Adding* something aversive after a behavior to decrease it.
- Example: A child touches a hot stove → experiences pain → touches hot stoves less often

### Negative Punishment
*Removing* something desirable after a behavior to decrease it.
- Example: A student is disruptive → loses 5 minutes of free time → disruption decreases

## Ethical Cautions Around Punishment

Modern ABA ethics strongly discourage the use of aversive or painful punishment procedures. Best practice is to:

1. Always try reinforcement-based strategies first
2. Use the least intrusive effective procedure
3. Obtain informed consent
4. Monitor carefully for side effects (aggression, avoidance, emotional responses)

## Extinction

**Extinction** means withholding the reinforcer that has been maintaining a behavior, causing the behavior to decrease over time.

Example: A child cries to get snacks → caregivers stop providing snacks when the child cries → crying gradually decreases

### Extinction Burst

When extinction is first implemented, behavior often gets *worse* before it gets better — this is called an **extinction burst**. Caregivers must be prepared for this and maintain consistency. Giving in during an extinction burst makes the behavior stronger.`,
    },
    // ── Module 4 ─────────────────────────────────────────────────────────────────
    {
      id: 'aba_m4_l1', moduleId: 'aba_m4', order: 1,
      title: 'Understanding the Function of Behavior',
      content: `# Understanding the Function of Behavior

Every challenging behavior serves a purpose for the person doing it. ABA calls this the **function** of the behavior.

## The Four Functions of Behavior

Research has identified four main reasons why behaviors occur:

### 1. Attention
The behavior gets the person social attention — from parents, teachers, peers, or support workers.
- Example: A child knocks things off a desk → an adult immediately comes over → the behavior was attention-seeking

### 2. Escape / Avoidance
The behavior allows the person to escape or avoid a demand, activity, person, or sensory experience.
- Example: A child throws materials → is sent out of the classroom → the behavior avoided an unpleasant task

### 3. Access to Tangibles
The behavior produces access to a desired item, activity, or place.
- Example: A child grabs a tablet → an adult gives it to stop the grabbing → the behavior accessed a preferred item

### 4. Automatic / Sensory
The behavior produces sensory stimulation that is reinforcing in itself — no social response is needed.
- Example: Rocking, hand-flapping, or humming that the person engages in regardless of who is present

## Why Function Matters

Two people can engage in the same behavior for completely different reasons. Hitting might be escape-motivated for one child and attention-motivated for another. The intervention must match the function — otherwise it will not work, and may make things worse.`,
    },
    {
      id: 'aba_m4_l2', moduleId: 'aba_m4', order: 2,
      title: 'Evidence-Based Reduction Strategies',
      content: `# Evidence-Based Behavior Reduction Strategies

Once the function of a behavior is identified, ABA offers a range of strategies to reduce it.

## Functional Communication Training (FCT)

Teach the person a more appropriate way to get the same outcome.
- If a child bites to escape demands → teach them to say or sign "break please"
- If a child screams for attention → teach them to tap a caregiver's arm

FCT is one of the most effective and ethical strategies in ABA because it replaces the challenging behavior with a useful skill.

## Differential Reinforcement

- **DRA** (Differential Reinforcement of Alternative behavior): Reinforce a specific alternative behavior
- **DRI** (Differential Reinforcement of Incompatible behavior): Reinforce a behavior that physically cannot occur at the same time as the target behavior
- **DRO** (Differential Reinforcement of Other behavior): Reinforce the absence of the target behavior for a set period

## Antecedent Modifications

Change the environment to prevent the behavior from occurring in the first place:
- Offer choices to increase sense of control
- Build in regular sensory breaks
- Use visual schedules to reduce anxiety around transitions
- Simplify task demands and provide clearer instructions

## Non-Contingent Reinforcement (NCR)

Provide the reinforcer on a time-based schedule regardless of behavior. If a child seeks attention, give them regular attention proactively — the behavior loses its function.`,
    },
    // ── Module 5 ─────────────────────────────────────────────────────────────────
    {
      id: 'aba_m5_l1', moduleId: 'aba_m5', order: 1,
      title: 'Prompting and Prompt Fading',
      content: `# Prompting and Prompt Fading

Prompts are cues or assistance provided to help a learner perform a skill they cannot yet do independently.

## Types of Prompts (Most to Least Intrusive)

1. **Full Physical** — hand-over-hand guidance to complete the entire action
2. **Partial Physical** — a light touch or gentle guide at the wrist or elbow
3. **Modeling** — demonstrating the action for the learner to imitate
4. **Gestural** — pointing, nodding, or other non-verbal cues
5. **Positional** — placing the correct item closer to the learner
6. **Visual** — a written word, picture, or symbol cue
7. **Verbal** — a spoken instruction or partial instruction

## Prompt Fading

The goal is always independence — prompts are a temporary scaffold, not a permanent support. **Prompt fading** is the systematic process of reducing prompts over time.

### Most-to-Least Prompting
Begin with the most intrusive prompt and gradually fade to less intrusive ones as the learner succeeds.

### Least-to-Most Prompting
Begin with no prompt or the least intrusive prompt, and add more support only if the learner does not respond within a few seconds.

## Prompt Dependency

A common error in ABA is failing to fade prompts, which creates **prompt dependency** — the learner only performs the skill when prompted and cannot do it independently. Systematic fading prevents this.`,
    },
    {
      id: 'aba_m5_l2', moduleId: 'aba_m5', order: 2,
      title: 'Discrete Trial Training and Naturalistic Teaching',
      content: `# Discrete Trial Training and Naturalistic Teaching

ABA uses two broad teaching approaches, each suited to different goals and learners.

## Discrete Trial Training (DTT)

DTT is a structured, adult-directed teaching method that breaks skills into small components and teaches them one at a time through repeated practice.

### The DTT Structure
1. **Discriminative Stimulus (SD)**: A clear instruction or cue — "Touch nose"
2. **Learner Response**: The learner performs the behavior (or not)
3. **Consequence**: Correct → reinforcement; Incorrect → corrective prompt and try again
4. **Inter-trial interval**: A brief pause before the next trial

### When to Use DTT
- Teaching foundational skills (matching, imitation, basic receptive language)
- When a skill needs many repetitions to be acquired
- When the learner needs a highly structured environment

## Naturalistic Teaching

Naturalistic approaches embed skill teaching into everyday activities and follow the learner's interests.

### Pivotal Response Training (PRT)
- Child-led: teaching happens during play and preferred activities
- Targets pivotal behaviors (motivation, self-management) that produce broad improvements

### Natural Environment Teaching (NET)
- Opportunities to practice skills arise from the natural flow of the day
- Reinforcers are natural (getting the ball after asking for it, rather than a token)

## Combining Both Approaches

Most effective ABA programs blend DTT for initial skill acquisition with naturalistic approaches to build fluency and promote generalization.`,
    },
    // ── Module 6 ─────────────────────────────────────────────────────────────────
    {
      id: 'aba_m6_l1', moduleId: 'aba_m6', order: 1,
      title: 'Why Data Collection Matters',
      content: `# Why Data Collection Matters

Data collection is what separates ABA from guesswork. It is the foundation of evidence-based practice.

## The Role of Data in ABA

- **Tracks progress**: Objectively shows whether a skill is improving or a behavior is decreasing
- **Guides decisions**: Tells practitioners when to move forward, adjust, or change an approach entirely
- **Ensures accountability**: Documents that interventions are being implemented as designed
- **Detects problems early**: A plateau or regression is visible in data before it becomes obvious to observers

## Data vs. Intuition

Humans are not reliable observers of gradual change. We tend to remember dramatic incidents and discount slow improvement. Data provides an objective record that overrides these biases.

Example: A parent may feel a behavior is "not improving at all" while data shows a 40% reduction over six weeks.

## What Gets Measured

Common dimensions of behavior that ABA measures:

- **Frequency**: How many times the behavior occurs
- **Duration**: How long the behavior lasts
- **Latency**: How long after a cue before the behavior begins
- **Intensity**: How severe the behavior is (often rated on a scale)
- **Percentage correct**: For skill acquisition programs`,
    },
    {
      id: 'aba_m6_l2', moduleId: 'aba_m6', order: 2,
      title: 'Methods of Behavioral Measurement',
      content: `# Methods of Behavioral Measurement

## Event Recording (Frequency / Rate)

Count every instance of the behavior during an observation period.

- **Best for**: Behaviors with a clear beginning and end (e.g., hitting, requesting, tantrums)
- **Rate** = frequency ÷ time (useful when observation periods vary in length)

## Duration Recording

Measure how long the behavior lasts from start to finish.

- **Best for**: Behaviors where length matters (e.g., time on task, duration of crying, length of a tantrum)

## Interval Recording

Divide the observation period into equal intervals and record whether the behavior occurred.

- **Whole interval**: Mark only if behavior occurred throughout the entire interval (underestimates)
- **Partial interval**: Mark if behavior occurred at any point during the interval (overestimates)
- **Momentary time sampling**: Check only at the end of each interval — did the behavior occur at that exact moment?

**Best for**: Behaviors that are continuous or difficult to count discretely.

## Permanent Product Recording

Measure the outcome or result of behavior rather than the behavior itself.

- **Best for**: Academic work (number of problems completed), assignments turned in, items assembled

## Graphing Data

Data is always graphed in ABA. A line graph with session number on the x-axis and behavior on the y-axis lets practitioners see trends, make visual decisions, and share progress with families.`,
    },
    // ── Module 7 ─────────────────────────────────────────────────────────────────
    {
      id: 'aba_m7_l1', moduleId: 'aba_m7', order: 1,
      title: 'Generalization of Skills',
      content: `# Generalization of Skills

A skill is not truly learned until it generalizes — until the person can use it beyond the specific context in which it was taught.

## Types of Generalization

### Stimulus Generalization
The behavior occurs in the presence of stimuli similar to, but not identical to, the original training stimuli.
- Example: A child learns to identify "dog" using three training pictures and can now identify dogs in photos, cartoons, and real life

### Response Generalization
Variations of the trained behavior emerge without direct teaching.
- Example: A child is taught to say "I want juice" and begins independently saying "I want cookie" and "I want milk"

### Maintenance
The behavior persists over time, even when direct training and reinforcement are reduced.

## Planning for Generalization

Generalization should be programmed deliberately, not hoped for. Strategies include:

- **Train with multiple examples**: Use many different people, settings, and materials during training
- **Train in natural settings**: Conduct some trials in real environments (kitchen, playground, classroom)
- **Use natural reinforcers**: Fade artificial reinforcers in favor of those that occur naturally
- **Involve multiple people**: Include parents, siblings, teachers — not just therapists
- **Vary instructions**: Use different phrasings of the same instruction so the learner responds to the concept, not the exact words`,
    },
    {
      id: 'aba_m7_l2', moduleId: 'aba_m7', order: 2,
      title: 'Maintenance and Fluency',
      content: `# Maintenance and Fluency

## What Is Maintenance?

Maintenance refers to the persistence of a behavior over time after the intensive teaching phase has ended. A skill that disappears when therapy stops was never truly maintained.

## Building Maintenance into Programs

- **Thin the reinforcement schedule** gradually — from continuous to intermittent reinforcement
- **Conduct maintenance probes**: Periodically test previously mastered skills to check they are retained
- **Embed skills in daily routines**: Skills practiced in real life are maintained more reliably than those drilled only in therapy

## Fluency

**Fluency** is the combination of accuracy *and* speed. A fluent skill is performed correctly, quickly, and effortlessly — it has become automatic.

Example: A child can correctly identify letters (accuracy) but takes 10 seconds per letter. A fluent reader identifies each letter within 1–2 seconds.

## Why Fluency Matters

- Fluent skills are more likely to generalize and be maintained
- Fluent foundational skills free up cognitive resources for more complex tasks
- Fluency is the difference between a skill a child has learned and a skill they actually use

## Building Fluency

- **Timed practice**: Set a timer and count correct responses in 1-minute sprints
- **Celeration**: Track the rate of improvement over time, not just accuracy
- **High-repetition, short-session practice**: Multiple short sessions per day outperform one long session`,
    },
    // ── Module 8 ─────────────────────────────────────────────────────────────────
    {
      id: 'aba_m8_l1', moduleId: 'aba_m8', order: 1,
      title: 'Ethical Guidelines for ABA Practitioners',
      content: `# Ethical Guidelines for ABA Practitioners

The Behavior Analyst Certification Board (BACB) publishes the **Ethics Code for Behavior Analysts**, which all certified practitioners must follow.

## Core Ethical Principles

### Beneficence and Non-Maleficence
Practitioners must act in the best interests of clients and avoid causing harm. This includes:
- Selecting the least restrictive, least aversive effective intervention
- Monitoring for side effects
- Discontinuing ineffective procedures

### Informed Consent
Clients and their families must be fully informed about:
- The proposed intervention and its rationale
- Alternative approaches
- Potential risks and benefits

Consent must be voluntary, ongoing, and can be withdrawn at any time.

### Confidentiality
Client information is private. Data, videos, and case details may only be shared with appropriate permission.

### Competence
Practitioners must only work within their scope of training and experience. They must seek supervision or refer out when a case exceeds their competence.

### Dignity and Respect
Every client has the right to be treated with dignity. Demeaning language, unnecessary restraint, and degrading procedures are prohibited.

## Supervision Requirements

ABA has a tiered certification structure:
- **BCBA** (Board Certified Behavior Analyst): Master's or doctoral level, designs programs
- **BCaBA** (Associate): Bachelor's level, implements under BCBA supervision
- **RBT** (Registered Behavior Technician): Direct therapy provider, supervised by BCBA`,
    },
    {
      id: 'aba_m8_l2', moduleId: 'aba_m8', order: 2,
      title: 'ABA and the Autistic Rights Perspective',
      content: `# ABA and the Autistic Rights Perspective

ABA has a complex relationship with the autistic community. Understanding this history and the ongoing debate is essential for ethical practice.

## Criticisms from Autistic Adults

Many autistic self-advocates have shared negative experiences with early ABA approaches:

- **Suppression of natural behaviors**: Programs historically targeted stimming (e.g., hand-flapping) as behaviors to eliminate, even when they caused no harm and served sensory or emotional regulation functions
- **Compliance-focused goals**: Critics argue that making autistic children "indistinguishable from peers" prioritizes the comfort of neurotypical observers over the wellbeing of the autistic child
- **Intensive hours**: Programs of 40 hours per week have been described by some autistic adults as overwhelming and traumatic
- **Lack of autistic voice**: Historically, programs were designed without meaningful input from autistic people

## What Ethical Modern ABA Looks Like

The field has evolved. Ethical contemporary ABA:

- **Follows the autistic person's lead** — builds on interests and intrinsic motivation
- **Teaches skills that serve the individual** — not skills designed purely to appear neurotypical
- **Respects and accommodates sensory needs** — does not pathologize harmless autistic traits
- **Prioritizes assent** — checks that the individual is willing and comfortable, not just compliant
- **Includes autistic voices** — consults with autistic adults and advocates in program design

## A Balanced View

ABA techniques, used ethically, have strong evidence for teaching communication, daily living skills, and reducing behaviors that cause harm. The goal of every program should be a richer, more self-determined life for the autistic individual — not conformity.`,
    },
  ]

  await prisma.lesson.createMany({ skipDuplicates: true, data: lessons })
  console.log('Lessons created:', lessons.length)
}

run().catch(console.error).finally(() => prisma.$disconnect())
