import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDirectionWithDetails, getDirections } from '@/lib/data'
import PublicLayout from '@/components/PublicLayout'
import type { Metadata } from 'next'

// Convert various YouTube URL formats to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null

  // Already embed format
  if (url.includes('youtube.com/embed/')) {
    return url.startsWith('http') ? url : `https://${url}`
  }

  // Extract video ID from various formats (watch, youtu.be, etc.)
  const pattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(pattern)

  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`
  }

  return null
}

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const directions = await getDirections()
  return directions.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const direction = await getDirectionWithDetails(slug)
  if (!direction) return { title: 'Richting niet gevonden' }

  return {
    title: `${direction.name} - Futuris`,
    description: direction.short_description || `Ontdek alles over ${direction.name}`,
  }
}

export default async function DirectionPage({ params }: PageProps) {
  const { slug } = await params
  const direction = await getDirectionWithDetails(slug)

  if (!direction) {
    notFound()
  }

  const typeLabels: Record<string, string> = {
    mbo: 'MBO',
    hbo: 'HBO',
    wo: 'WO',
  }

  return (
    <PublicLayout>
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
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
            style={{ backgroundColor: `${direction.color}15` }}
          >
            {direction.icon || '📚'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{direction.name}</h1>
            {direction.short_description && (
              <p className="text-text-muted">{direction.short_description}</p>
            )}
          </div>
        </div>

        {/* Video embed */}
        {direction.video_url && (() => {
          const embedUrl = getYouTubeEmbedUrl(direction.video_url)
          return embedUrl ? (
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 mb-4">
              <iframe
                src={embedUrl}
                title="Video over deze richting"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null
        })()}

        {/* Full description */}
        {direction.full_description && (
          <div className="prose prose-sm max-w-none text-text-muted">
            {direction.full_description.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>

      {/* Competencies */}
      {direction.competencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-futuris-teal/10 flex items-center justify-center">
              <span className="text-lg">💡</span>
            </span>
            Wat leer je?
          </h2>
          <div className="grid gap-3">
            {direction.competencies.map((comp) => (
              <div
                key={comp.id}
                className="bg-white rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{comp.icon || '✓'}</span>
                  <div>
                    <h3 className="font-medium text-text">{comp.title}</h3>
                    {comp.description && (
                      <p className="text-sm text-text-muted mt-1">{comp.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Traits - Past dit bij jou? */}
      {direction.traits.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-futuris-teal/10 flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </span>
            Past dit bij jou?
          </h2>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-text-muted mb-3">Deze richting past bij jou als je:</p>
            <div className="flex flex-wrap gap-2">
              {direction.traits.map((trait) => (
                <span
                  key={trait.id}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${direction.color}15`,
                    color: direction.color,
                  }}
                >
                  {trait.trait}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subjects */}
      {(direction.subjects.required.length > 0 || direction.subjects.optional.length > 0) && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-futuris-teal/10 flex items-center justify-center">
              <span className="text-lg">📚</span>
            </span>
            Vakken
          </h2>

          {/* Required subjects */}
          {direction.subjects.required.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-text-muted mb-2 uppercase tracking-wide">
                Verplichte vakken
              </h3>
              <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                {direction.subjects.required.map((ds) => (
                  <div key={ds.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{ds.subject.icon || '📖'}</span>
                      <span className="font-medium text-text">{ds.subject.name}</span>
                    </div>
                    {ds.hours_per_week > 0 && (
                      <span className="text-sm text-text-muted">
                        {ds.hours_per_week} uur/week
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional subjects */}
          {direction.subjects.optional.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-text-muted mb-2 uppercase tracking-wide">
                Keuzevakken
              </h3>
              <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                {direction.subjects.optional.map((ds) => (
                  <div key={ds.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{ds.subject.icon || '📖'}</span>
                      <span className="font-medium text-text">{ds.subject.name}</span>
                    </div>
                    {ds.hours_per_week > 0 && (
                      <span className="text-sm text-text-muted">
                        {ds.hours_per_week} uur/week
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Careers */}
      {direction.careers.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-futuris-teal/10 flex items-center justify-center">
              <span className="text-lg">💼</span>
            </span>
            Wat kun je worden?
          </h2>
          <div className="grid gap-3">
            {direction.careers.map((dc) => (
              <div
                key={dc.id}
                className="bg-white rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{dc.career.icon || '👤'}</span>
                  <div>
                    <h3 className="font-medium text-text">{dc.career.name}</h3>
                    {dc.career.description && (
                      <p className="text-sm text-text-muted mt-1">{dc.career.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {direction.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-futuris-teal/10 flex items-center justify-center">
              <span className="text-lg">🎓</span>
            </span>
            Vervolgopleidingen
          </h2>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
            {direction.education.map((de) => (
              <div key={de.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-text">{de.education.name}</h3>
                    {de.education.institution && (
                      <p className="text-sm text-text-muted">{de.education.institution}</p>
                    )}
                    {de.education.description && (
                      <p className="text-sm text-text-muted mt-1">{de.education.description}</p>
                    )}
                  </div>
                  {de.education.type && (
                    <span
                      className="shrink-0 px-2 py-1 rounded text-xs font-medium uppercase"
                      style={{
                        backgroundColor: `${direction.color}15`,
                        color: direction.color,
                      }}
                    >
                      {typeLabels[de.education.type] || de.education.type}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Documents */}
      {direction.documents.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-futuris-teal/10 flex items-center justify-center">
              <span className="text-lg">📄</span>
            </span>
            Downloads
          </h2>
          <div className="grid gap-3">
            {direction.documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-futuris-teal/30 hover:shadow-sm transition-all"
              >
                <span className="text-2xl">
                  {doc.type === 'pdf' ? '📕' : '📄'}
                </span>
                <span className="font-medium text-text">{doc.title}</span>
                <svg className="w-5 h-5 ml-auto text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <div className="mt-8 p-4 rounded-xl text-center" style={{ backgroundColor: `${direction.color}10` }}>
        <p className="text-text font-medium mb-2">Heb je vragen over deze richting?</p>
        <p className="text-sm text-text-muted">
          Vraag het aan je mentor of decaan. Zij kunnen je meer vertellen over {direction.name}.
        </p>
      </div>
    </PublicLayout>
  )
}
