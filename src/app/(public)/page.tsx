import Link from 'next/link'
import type { Metadata } from 'next'
import { BookOpen, Users, Award, Heart, GraduationCap, Briefcase, HandHelping, Star } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import CourseCard from '@/components/CourseCard'
import HeroVideo from './_components/HeroVideo'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'USIASDHR Academy — evidence-based online courses on autism education for families, caregivers, educators, and professionals.',
}

const testimonials = [
  {
    quote:
      "This course completely changed how I approach my son's education. The neurodiversity perspective was eye-opening.",
    name: 'Sarah M.',
    role: 'Parent',
    initials: 'SM',
  },
  {
    quote:
      'The classroom strategies module gave me practical tools I could use the very next day.',
    name: 'James K.',
    role: 'Special Education Teacher',
    initials: 'JK',
  },
  {
    quote:
      'Clear, compassionate, and evidence-based. This is the training I wish I had when I started.',
    name: 'Priya L.',
    role: 'Support Worker',
    initials: 'PL',
  },
]

const audiences = [
  {
    icon: Heart,
    title: 'Parents & Families',
    description:
      "Understand your child's world with evidence-based knowledge designed to build deeper connection and effective support.",
  },
  {
    icon: GraduationCap,
    title: 'Educators & Teachers',
    description:
      'Gain classroom-ready strategies to create inclusive, supportive learning environments for every student.',
  },
  {
    icon: HandHelping,
    title: 'Caregivers & Support Workers',
    description:
      'Develop the skills and confidence to provide compassionate, rights-based care for the individuals you support.',
  },
  {
    icon: Briefcase,
    title: 'Clinicians & Professionals',
    description:
      'Deepen your professional understanding of autism through a human rights lens backed by current research.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Browse our courses',
    description:
      'Explore our growing library of expert-led courses across foundations, education, and caregiving.',
  },
  {
    number: '02',
    title: 'Enroll in minutes',
    description:
      'Create a free account and enroll instantly — no prior knowledge or prerequisites required.',
  },
  {
    number: '03',
    title: 'Earn your certificate',
    description:
      'Complete lessons and quizzes at your own pace, then download your verified certificate of completion.',
  },
]

export default async function LandingPage() {
  const featuredCourses = await prisma.course.findMany({
    where: { published: true },
    take: 3,
    orderBy: { createdAt: 'asc' },
    select: {
      slug: true,
      title: true,
      description: true,
      category: true,
      level: true,
      isFree: true,
      price: true,
      coverImage: true,
      instructor: { select: { name: true } },
      _count: { select: { enrollments: true } },
    },
  })

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 pt-5 pb-10">
        <div className="relative rounded-2xl overflow-hidden min-h-140 not-first:flex items-center justify-center max-w-6xl mx-auto">

          <HeroVideo />

          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

          <div className="relative z-10 text-center px-6 py-20 max-w-3xl mx-auto w-full">
            <p className="text-xs font-bold tracking-[0.28em] uppercase text-white/65 mb-5">
              Autism &amp; Human Rights Academy
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Education rooted in dignity, equality, and justice
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-10 max-w-xl mx-auto">
              Choose an online video course to watch and gain certification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
              >
                Browse courses →
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/50 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Create free account
              </Link>
            </div>
          </div>

          <div className="absolute bottom-5 right-5 hidden sm:flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3.5 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xs pl-0.5" aria-hidden="true">▶</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900 leading-tight">Start learning today</p>
              <p className="text-xs text-slate-500 mt-0.5">Free certifications available</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="mission-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary-600 mb-3">
              Our Foundation
            </p>
            <h2
              id="mission-heading"
              className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight"
            >
              Built on dignity, equality, and justice
            </h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              We created a space where every human being is respected, heard, and empowered. Our
              courses translate the latest research into practical knowledge that transforms lives.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                stat: '3+',
                label: 'Expert-led courses',
                iconClass: 'bg-primary-50 text-primary-600',
              },
              {
                icon: Award,
                stat: 'WCAG 2.1 AA',
                label: 'Accessibility standard',
                iconClass: 'bg-emerald-50 text-emerald-600',
              },
              {
                icon: Users,
                stat: 'Free',
                label: 'To start learning',
                iconClass: 'bg-amber-50 text-amber-600',
              },
            ].map(({ icon: Icon, stat, label, iconClass }, i) => (
              <div key={label} className="card-glow-border">
                <div
                  className="card-glow-spin"
                  style={{ animationDelay: `${-i}s` }}
                  aria-hidden="true"
                />
                <div className="card-glow-inner p-8 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${iconClass}`}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{stat}</p>
                  <p className="mt-1.5 text-sm text-slate-600">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Serve ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600" aria-labelledby="audience-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary-200 mb-3">
              Who We Serve
            </p>
            <h2
              id="audience-heading"
              className="text-3xl sm:text-4xl font-bold text-white leading-tight"
            >
              Learning designed for everyone in the autism community
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {audiences.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white/10 border border-white/20 rounded-2xl p-6 text-white"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 shrink-0">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-base mb-2">{title}</h3>
                <p className="text-sm text-primary-100 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50" aria-labelledby="how-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary-600 mb-3">
              How It Works
            </p>
            <h2
              id="how-heading"
              className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight"
            >
              Start learning in three simple steps
            </h2>
          </div>

          <div className="snap-carousel flex overflow-x-auto snap-x snap-mandatory gap-6 pb-5 sm:grid sm:grid-cols-3 sm:gap-10 sm:overflow-visible sm:pb-0">
            {steps.map(({ number, title, description }, i) => (
              <div key={number} className="card-glow-border w-[78vw] shrink-0 snap-start sm:w-auto sm:min-w-0 sm:shrink">
                <div
                  className="card-glow-spin"
                  style={{ animationDelay: `${-i}s` }}
                  aria-hidden="true"
                />
                <div className="card-glow-inner p-7">
                  <div
                    className="text-7xl font-black text-slate-100 leading-none mb-4 select-none"
                    aria-hidden="true"
                  >
                    {number}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              Get started for free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Courses ──────────────────────────────────────────────────── */}
      {featuredCourses.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="featured-heading">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary-600 mb-2">
                  Featured Courses
                </p>
                <h2 id="featured-heading" className="text-3xl font-bold text-slate-900">
                  Start learning today
                </h2>
                <p className="mt-2 text-slate-600">No prior knowledge required.</p>
              </div>
              <Link
                href="/courses"
                className="hidden sm:inline-flex items-center text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors shrink-0"
              >
                View all courses →
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.slug} course={course} headingLevel="h3" />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/courses"
                className="inline-flex items-center text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
              >
                View all courses →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50" aria-labelledby="testimonials-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary-600 mb-3">
              Testimonials
            </p>
            <h2
              id="testimonials-heading"
              className="text-3xl sm:text-4xl font-bold text-slate-900"
            >
              What our learners say
            </h2>
          </div>

          <div className="snap-carousel flex overflow-x-auto snap-x snap-mandatory gap-5 pb-5 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="w-[82vw] shrink-0 snap-start sm:w-auto sm:min-w-0 sm:shrink bg-white rounded-2xl p-7 shadow-sm border border-slate-100 flex flex-col gap-5"
              >
                <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <p className="text-slate-700 leading-relaxed text-sm flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <footer className="flex items-center gap-3 mt-auto">
                  <div
                    className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0"
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-700 relative overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-600 opacity-40 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-primary-800 opacity-40 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary-300 mb-4">
            Get Started
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Ready to start learning?
          </h2>
          <p className="mt-4 text-primary-100 leading-relaxed text-lg">
            Join families, educators, and professionals deepening their understanding of autism —
            at your own pace, from anywhere.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
            >
              Create your free account
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
