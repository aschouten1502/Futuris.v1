import Link from 'next/link'
import { getCareers } from '@/lib/data'
import PublicLayout from '@/components/PublicLayout'
import { PreviewClickWrapper } from '@/components/PreviewClickWrapper'
import { PreviewNavigationBlocker } from '@/components/PreviewNavigationBlocker'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Beroepen - Futuris',
  description: 'Overzicht van beroepen waar je naartoe kunt werken bij Futuris SG',
}

export default async function BeroepenPage() {
  const careers = await getCareers()

  return (
    <PublicLayout>
      <PreviewNavigationBlocker />
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-text-muted hover:text-futuris-teal transition-colors mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Terug naar overzicht
      </Link>

      {/* Header */}
      <div className="mb-8">
        <span className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-futuris-teal/10 text-futuris-teal rounded-full">
          Beroepen
        </span>
        <h1 className="text-2xl font-bold text-text mb-3">
          Waar kun je terechtkomen?
        </h1>
        <p className="text-text-muted text-base">
          Ontdek welke beroepen passen bij de verschillende richtingen op Futuris SG.
        </p>
      </div>

      {/* Careers grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {careers.map((career) => (
          <PreviewClickWrapper key={career.id} type="career" id={career.id}>
            <div className="bg-white rounded-xl border border-surface-lavender/40 p-4 hover:shadow-md transition-shadow h-full">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-surface-lavender-light flex items-center justify-center shrink-0">
                  <span className="text-2xl">{career.icon || '👤'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text">{career.name}</h3>
                  {career.description && (
                    <p className="text-sm text-text-muted mt-1 line-clamp-3">{career.description}</p>
                  )}
                </div>
              </div>
            </div>
          </PreviewClickWrapper>
        ))}
      </div>

      {/* Empty state */}
      {careers.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p>Geen beroepen gevonden.</p>
        </div>
      )}

      {/* Info box */}
      <div className="mt-8 p-5 bg-surface-lavender-light rounded-2xl border border-surface-lavender/30">
        <h3 className="font-bold text-futuris-teal mb-2">Hoe kies je een richting?</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          Denk na over wat je leuk vindt en waar je goed in bent. De beroepen hierboven
          geven een beeld van waar je terecht kunt komen. Vraag je mentor of decaan voor advies.
        </p>
      </div>
    </PublicLayout>
  )
}
