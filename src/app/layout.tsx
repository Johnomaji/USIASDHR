import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const siteUrl = process.env.APP_URL ?? 'http://localhost:3000'
const siteDescription =
  'Online learning for autism education — courses for families, caregivers, educators, and professionals.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'USIASDHR Academy',
    template: '%s — USIASDHR Academy',
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    siteName: 'USIASDHR Academy',
    title: 'USIASDHR Academy',
    description: siteDescription,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'USIASDHR Academy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'USIASDHR Academy',
    description: siteDescription,
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'USIASDHR Academy',
  url: siteUrl,
  logo: `${siteUrl}/android-chrome-512x512.png`,
  description: siteDescription,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* Accessible skip link — hidden until focused by keyboard */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
