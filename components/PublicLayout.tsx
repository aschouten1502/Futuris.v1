import Link from 'next/link'
import Image from 'next/image'

function WaveDivider() {
  return (
    <svg
      className="w-full h-8 text-futuris-teal"
      viewBox="0 0 1440 48"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0 48h1440V0c-120 24-360 48-720 24S120 24 0 48z"
        fill="currentColor"
        fillOpacity="0.08"
      />
    </svg>
  )
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-lavender-light">
      {/* Signature pink outline U — zoals op de Futuris posters */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Roze outline U — donker en strak, zoals op de poster */}
        <div className="absolute -top-20 -right-36 opacity-[0.8]">
          <Image
            src="/brand/u-pink-outline.png"
            alt=""
            width={420}
            height={525}
            aria-hidden="true"
            className="select-none"
          />
        </div>
        {/* Gele U linksonder */}
        <div className="absolute bottom-16 -left-20 opacity-[0.35] rotate-[135deg]">
          <Image
            src="/brand/u-yellow.png"
            alt=""
            width={200}
            height={250}
            aria-hidden="true"
            className="select-none"
          />
        </div>
        {/* Frosted-glass overlay — U-shapes zacht zichtbaar, tekst leesbaar */}
        <div className="absolute inset-0 bg-surface-lavender-light/75 backdrop-blur-[2px]" />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-surface-lavender/30 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="block">
              <Image
                src="/brand/logo-fullcolor.png"
                alt="Futuris SG"
                width={130}
                height={36}
                className="h-9 w-auto"
                priority
              />
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-4">
              <Link
                href="/ouders"
                className="text-sm text-text-muted hover:text-futuris-teal transition-colors"
              >
                Voor ouders
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-lg mx-auto px-4 py-8 w-full relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-futuris-teal text-white mt-auto relative z-10">
        <WaveDivider />
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            {/* Logo */}
            <Image
              src="/brand/logo-white.png"
              alt="Futuris SG"
              width={120}
              height={33}
              className="h-8 w-auto"
            />
            <p className="text-sm text-white/70">
              Kansen voor jouw toekomst
            </p>
            {/* Links */}
            <div className="flex gap-6 text-sm text-white/80">
              <Link href="/ouders" className="hover:text-white transition-colors">
                Voor ouders
              </Link>
              <a
                href="https://futuris.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Futuris.nl
              </a>
            </div>
            {/* Subtle admin link */}
            <Link
              href="/admin/login"
              className="mt-4 text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Beheer
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
