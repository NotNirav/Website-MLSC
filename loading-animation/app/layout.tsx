import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'MLSC PCCoE — The Next Chapter',
  description: 'Curiosity brings us together. Step inside Microsoft Learn Student Chapter at PCCoE — a community of curious minds, building what comes next.',
  icons: { icon: '/images/mlsc-icon.png', apple: '/images/mlsc-icon.png' },
  openGraph: {
    title: 'MLSC PCCoE — The Next Chapter',
    description: 'Breaking norms. Setting standards. Discover Microsoft Learn Student Chapter at PCCoE.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0c0a08',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${geist.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
