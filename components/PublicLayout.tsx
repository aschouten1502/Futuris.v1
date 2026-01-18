import Link from 'next/link'

function DecorativeCircle({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-full bg-futuris-teal ${className}`}
      aria-hidden="true"
    />
  )
}

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
    <div className="min-h-screen flex flex-col bg-gray-50/30">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <DecorativeCircle className="absolute -top-20 -right-20 w-80 h-80 opacity-[0.03]" />
        <DecorativeCircle className="absolute top-1/2 -left-40 w-96 h-96 opacity-[0.02]" />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Logo mark */}
              <div className="relative w-10 h-10 bg-futuris-teal rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-bold text-lg">F</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              {/* Brand name */}
              <div className="flex flex-col">
                <span className="font-semibold text-text text-lg leading-tight">
                  Futuris
                </span>
                <span className="text-xs text-text-muted leading-tight">
                  Bovenbouw Info
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden sm:flex items-center gap-4">
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
      <main className="flex-1 max-w-lg mx-auto px-4 py-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-futuris-teal text-white mt-auto">
        <WaveDivider />
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            {/* Logo */}
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <div className="text-center">
              <p className="font-medium">Futuris Bovenbouw Info</p>
              <p className="text-sm text-white/70 mt-1">
                Hulp bij jouw studiekeuze
              </p>
            </div>
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
