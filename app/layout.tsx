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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Futuris',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#003c46',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={`${inter.variable} ${cardo.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Futuris" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registered:', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed:', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
