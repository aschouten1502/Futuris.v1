import Link from 'next/link'
import { getFurtherEducation } from '@/lib/data'
import PublicLayout from '@/components/PublicLayout'
import { PreviewClickWrapper } from '@/components/PreviewClickWrapper'
import { PreviewNavigationBlocker } from '@/components/PreviewNavigationBlocker'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Vervolgopleidingen - Futuris',
  description: 'Overzicht van vervolgopleidingen na Futuris SG',
}

const typeLabels: Record<string, string> = {
  mbo: 'MBO',
  hbo: 'HBO',
  wo: 'WO',
}

const typeColors: Record<string, string> = {
  mbo: 'bg-green-100 text-green-700 border-green-200',
  hbo: 'bg-blue-100 text-blue-700 border-blue-200',
  wo: 'bg-purple-100 text-purple-700 border-purple-200',
}

export default async function OpleidingenPage() {
  const education = await getFurtherEducation()

  // Group by type
  const grouped = education.reduce((acc, edu) => {
    const type = edu.type || 'mbo'
    if (!acc[type]) acc[type] = []
    acc[type].push(edu)
    return acc
  }, {} as Record<string, typeof education>)

  const typeOrder = ['mbo', 'hbo', 'wo']

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
          Vervolgopleidingen
        </span>
        <h1 className="text-2xl font-bold text-text mb-3">
          Waar kun je verder studeren?
        </h1>
        <p className="text-text-muted text-base">
          Na Futuris SG kun je doorstuderen op MBO, HBO of WO niveau.
        </p>
      </div>

      {/* Education grouped by type */}
      {typeOrder.map((type) => {
        const items = grouped[type]
        if (!items || items.length === 0) return null

        return (
          <div key={type} className="mb-8">
            <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${typeColors[type]}`}>
                {typeLabels[type]}
              </span>
              <span className="text-text-muted font-normal text-sm">({items.length} opleidingen)</span>
            </h2>
            <div className="space-y-3">
              {items.map((edu) => (
                <PreviewClickWrapper key={edu.id} type="education" id={edu.id}>
                  <div className="bg-white rounded-xl border border-surface-lavender/40 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text">{edu.name}</h3>
                        {edu.institution && (
                          <p className="text-sm text-futuris-teal mt-0.5">{edu.institution}</p>
                        )}
                        {edu.description && (
                          <p className="text-sm text-text-muted mt-1 line-clamp-2">{edu.description}</p>
                        )}
                      </div>
                      {edu.url && (
                        <a
                          href={edu.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Bezoek website van ${edu.name}`}
                          className="shrink-0 text-futuris-teal hover:text-futuris-teal/80 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </PreviewClickWrapper>
              ))}
            </div>
          </div>
        )
      })}

      {/* Empty state */}
      {education.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p>Geen opleidingen gevonden.</p>
        </div>
      )}

      {/* Info box */}
      <div className="mt-8 p-5 bg-surface-lavender-light rounded-2xl border border-surface-lavender/30">
        <h3 className="font-bold text-futuris-teal mb-2">Welk niveau past bij jou?</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          <strong>MBO:</strong> Praktijkgericht leren met stages. <br />
          <strong>HBO:</strong> Theorie en praktijk gecombineerd. <br />
          <strong>WO:</strong> Vooral theorie en onderzoek. <br />
          Vraag je decaan voor advies over welk niveau bij jou past.
        </p>
      </div>
    </PublicLayout>
  )
}
