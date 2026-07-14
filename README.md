# USIASDHR LMS

A neurodivergent-friendly Learning Management System for the **United States Institute of Autism Spectrum Disorder and Human Rights (USIASDHR)**.

Designed with WCAG 2.1 AA compliance, calm visual palette, predictable layouts, and reduced-motion support to ensure an accessible learning experience for all users.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.10 (App Router) |
| UI | React 19, Tailwind CSS v4, Lucide React |
| Language | TypeScript 5 |
| Database | PostgreSQL via Prisma 7 + `@prisma/adapter-pg` |
| Auth | NextAuth v5 (beta) — credentials provider, JWT sessions |
| Forms | react-hook-form + Zod v4 |
| Content | marked (Markdown rendering) |
| Crypto | bcryptjs, jose |

---

## Features

- **Role-based access** — `ADMIN`, `INSTRUCTOR`, and `STUDENT` roles
- **Course catalog** — browsable public course listing with slug-based detail pages
- **Structured curriculum** — Courses → Modules → Lessons with ordered content and attachments
- **Lesson player** — text and video lessons with progress tracking
- **Quizzes** — per-module quizzes with configurable passing scores and attempt limits
- **Certificates** — auto-issued on course completion with unique certificate codes
- **Enrollment system** — per-user enrollment with progress percentage tracking
- **Dashboard** — student dashboard showing enrolled courses and progress

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/         # Login and register pages
│   ├── (public)/       # Public site: home, course catalog, course detail
│   ├── dashboard/      # Student dashboard
│   └── learn/          # Lesson player and quiz pages
├── actions/            # Server actions (auth, enrollment, progress, quiz)
├── components/         # Shared UI components (SiteHeader, SiteFooter, CourseCard, etc.)
├── lib/                # Prisma client, DAL (verifySession)
└── types/              # NextAuth type augmentation

prisma/
├── schema.prisma       # Database schema
└── seed.ts             # Database seed script
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file at the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
AUTH_SECRET="your-nextauth-secret"
```

### Database Setup

```bash
# Push schema to the database
npx prisma db push

# Seed with sample data
npx prisma db seed
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Commands

```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Database Schema Overview

```
User ──< Enrollment >── Course ──< Module ──< Lesson ──< Attachment
                                           └──< Quiz  ──< Question ──< QuestionOption
User ──< LessonProgress
User ──< QuizAttempt ──< QuizAttemptAnswer
User ──< Certificate
```

---

## Accessibility

This platform is built with neurodivergent users in mind:

- WCAG 2.1 AA target compliance
- Calm, low-contrast palette to reduce visual fatigue
- Predictable, consistent page layouts
- `prefers-reduced-motion` support throughout
