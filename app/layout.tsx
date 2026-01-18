import type { Metadata, Viewport } from 'next'
import { Inter, Cardo } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const cardo = Cardo({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cardo',
})

export const metadata: Metadata = {
  title: 'Futuris - Ontdek jouw richting',
  description: 'Informatie over bovenbouw richtingen en studiekeuzes',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#003c46',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={`${inter.variable} ${cardo.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
