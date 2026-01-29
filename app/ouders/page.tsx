import Link from 'next/link'
import Image from 'next/image'
import PublicLayout from '@/components/PublicLayout'

export default function OudersPage() {
  return (
    <PublicLayout>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-futuris-teal transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Terug naar overzicht
      </Link>

      <div className="relative mb-8">
        <div className="absolute -top-4 -right-6 pointer-events-none opacity-[0.1] rotate-180">
          <Image
            src="/brand/u-pink.png"
            alt=""
            width={48}
            height={58}
            aria-hidden="true"
          />
        </div>
        <h1 className="text-2xl font-bold text-text mb-3">
          Informatie voor ouders
        </h1>
        <p className="text-text-muted leading-relaxed">
          Hier vindt u binnenkort informatie speciaal voor ouders en verzorgers.
        </p>
      </div>

      {/* Placeholder content */}
      <div className="bg-surface-sage-light border border-surface-sage/30 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-futuris-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-futuris-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-text mb-2">
          Pagina in ontwikkeling
        </h2>
        <p className="text-text-muted text-sm">
          Deze pagina wordt binnenkort aangevuld met informatie over ouderavonden,
          voorlichtingsbijeenkomsten en veelgestelde vragen.
        </p>
      </div>

      {/* Future sections preview */}
      <div className="mt-8 space-y-3">
        <div className="p-4 bg-surface-lavender-light rounded-xl border border-surface-lavender/30">
          <h3 className="font-medium text-text mb-1">Voorlichtingsavonden</h3>
          <p className="text-sm text-text-muted">Data en tijden worden binnenkort toegevoegd.</p>
        </div>
        <div className="p-4 bg-surface-lavender-light rounded-xl border border-surface-lavender/30">
          <h3 className="font-medium text-text mb-1">Veelgestelde vragen</h3>
          <p className="text-sm text-text-muted">FAQ sectie wordt binnenkort toegevoegd.</p>
        </div>
        <div className="p-4 bg-surface-lavender-light rounded-xl border border-surface-lavender/30">
          <h3 className="font-medium text-text mb-1">Contact</h3>
          <p className="text-sm text-text-muted">Contactgegevens worden binnenkort toegevoegd.</p>
        </div>
      </div>
    </PublicLayout>
  )
}
