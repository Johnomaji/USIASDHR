import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import CourseCard from '@/components/CourseCard'

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
      instructor: { select: { name: true } },
      _count: { select: { enrollments: true } },
    },
  })

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Learn to support and understand{' '}
            <span className="text-primary-600">autistic people</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Evidence-based courses for families, caregivers, educators, and professionals.
            Built with accessibility and neurodiversity at the heart of every lesson.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              Browse courses
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
            >
              Create free account
            </Link>
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
            The United States Institute of Autism Spectrum Disorder and Human Rights exists to
            advance understanding, acceptance, and rights for autistic people through accessible,
            high-quality education. Every course is designed with neurodiversity in mind —
            predictable layouts, calm colours, and no flashing media.
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
