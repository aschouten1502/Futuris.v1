import Link from 'next/link'
import { getSubjects } from '@/lib/data'
import PublicLayout from '@/components/PublicLayout'
import { PreviewClickWrapper } from '@/components/PreviewClickWrapper'
import { PreviewNavigationBlocker } from '@/components/PreviewNavigationBlocker'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Keuzevakken - Futuris',
  description: 'Overzicht van alle keuzevakken bij Futuris SG',
}

export default async function VakkenPage() {
  const subjects = await getSubjects()

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
          Keuzevakken
        </span>
        <h1 className="text-2xl font-bold text-text mb-3">
          Alle keuzevakken
        </h1>
        <p className="text-text-muted text-base">
          Hieronder vind je alle keuzevakken die je kunt kiezen bij Futuris SG.
        </p>
      </div>

      {/* Subjects grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjects.map((subject) => (
          <PreviewClickWrapper key={subject.id} type="subject" id={subject.id}>
            <div className="bg-white rounded-xl border border-surface-lavender/40 p-4 hover:shadow-md transition-shadow h-full">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-lavender-light flex items-center justify-center shrink-0">
                  <span className="text-xl">{subject.icon || '📖'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text">{subject.name}</h3>
                  {subject.description && (
                    <p className="text-sm text-text-muted mt-1 line-clamp-2">{subject.description}</p>
                  )}
                </div>
              </div>
              {(subject.learning_goals || subject.topics) && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  {subject.learning_goals && (
                    <div>
                      <p className="text-xs font-medium text-futuris-teal mb-0.5">Wat leer je</p>
                      <p className="text-sm text-text-muted line-clamp-2">{subject.learning_goals}</p>
                    </div>
                  )}
                  {subject.topics && (
                    <div>
                      <p className="text-xs font-medium text-futuris-teal mb-0.5">Onderwerpen</p>
                      <p className="text-sm text-text-muted line-clamp-2">{subject.topics}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </PreviewClickWrapper>
        ))}
      </div>

      {/* Empty state */}
      {subjects.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p>Geen keuzevakken gevonden.</p>
        </div>
      )}

      {/* Info box */}
      <div className="mt-8 p-5 bg-surface-lavender-light rounded-2xl border border-surface-lavender/30">
        <h3 className="font-bold text-futuris-teal mb-2">Hoe werkt het kiezen?</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          Naast de verplichte onderdelen mag je twee keuzevakken kiezen.
          Vraag je mentor of decaan voor advies over welke vakken het beste bij jou passen.
        </p>
      </div>
    </PublicLayout>
  )
}
