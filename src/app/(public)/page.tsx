import Link from 'next/link'
import type { Metadata } from 'next'
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
  },
  {
    quote:
      'The classroom strategies module gave me practical tools I could use the very next day.',
    name: 'James K.',
    role: 'Special Education Teacher',
  },
  {
    quote:
      'Clear, compassionate, and evidence-based. This is the training I wish I had when I started.',
    name: 'Priya L.',
    role: 'Support Worker',
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
      instructor: { select: { name: true } },
      _count: { select: { enrollments: true } },
    },
  })

  return (
    <>
      {/* Hero */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 pt-5 pb-10">
        <div className="relative rounded-2xl overflow-hidden min-h-140 not-first:flex items-center justify-center max-w-6xl mx-auto">

          {/* Autoplaying background video */}
          <HeroVideo />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

          {/* Main content */}
          <div className="relative z-10 text-center px-6 py-20 max-w-3xl mx-auto w-full">
            <p className="text-xs font-bold tracking-[0.28em] uppercase text-white/65 mb-5">
              Autism &amp; Human Right Academy
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

          {/* Floating card — bottom right (Vimeo-style) */}
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

      {/* Mission */}
      <section className="py-16 px-4 bg-white" aria-labelledby="mission-heading">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="mission-heading" className="text-2xl font-bold text-slate-900">
            Our mission
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Our story began with a simple desire: to create a space where every human being is
            respected, heard, and empowered — a place rooted in dignity, equality, and justice
            for all.
          </p>
        </div>

        <div className="mt-12 max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { stat: '3+', label: 'Expert-led courses' },
            { stat: 'WCAG 2.1 AA', label: 'Accessibility standard' },
            { stat: 'Free', label: 'To start learning' },
          ].map(({ stat, label }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-6">
              <p className="text-3xl font-bold text-primary-600">{stat}</p>
              <p className="mt-1 text-sm text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      {featuredCourses.length > 0 && (
        <section className="py-16 px-4 bg-slate-50" aria-labelledby="featured-heading">
          <div className="max-w-6xl mx-auto">
            <h2 id="featured-heading" className="text-2xl font-bold text-slate-900">
              Featured courses
            </h2>
            <p className="mt-2 text-slate-600">
              Start learning today — no prior knowledge required.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.slug} course={course} headingLevel="h3" />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/courses"
                className="inline-flex items-center text-primary-700 font-semibold hover:text-primary-800 transition-colors"
              >
                View all courses →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white" aria-labelledby="testimonials-heading">
        <div className="max-w-6xl mx-auto">
          <h2 id="testimonials-heading" className="text-2xl font-bold text-slate-900 text-center">
            What learners say
          </h2>
          <div className="mt-8 grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="bg-slate-50 rounded-xl p-6 flex flex-col gap-4"
              >
                <p className="text-slate-700 leading-relaxed text-sm">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-auto">
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-primary-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold">Ready to start learning?</h2>
          <p className="mt-3 text-primary-100 leading-relaxed">
            Join families, educators, and professionals deepening their understanding of autism.
          </p>
          <div className="mt-6">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
            >
              Create your free account
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
