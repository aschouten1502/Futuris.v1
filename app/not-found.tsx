import Link from 'next/link'
import PublicLayout from '@/components/PublicLayout'

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="text-center py-12">
      <div className="w-16 h-16 bg-futuris-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl font-bold text-futuris-teal">404</span>
      </div>
      <h2 className="text-xl font-semibold text-text mb-2">
        Pagina niet gevonden
      </h2>
      <p className="text-text-muted mb-6">
        De pagina die je zoekt bestaat niet.
      </p>
      <Link
        href="/"
        className="btn-pill-teal"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Naar startpagina
      </Link>
      </div>
    </PublicLayout>
  )
}
