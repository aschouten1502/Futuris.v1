import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getDirectionWithDetails, getDirections } from '@/lib/data'
import PublicLayout from '@/components/PublicLayout'
import { SubjectChip } from '@/components/SubjectChip'
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
      <div className="relative mb-8">
        {/* Decorative U-shape */}
        <div className="absolute -top-4 -right-6 pointer-events-none opacity-[0.12] rotate-180">
          <Image
            src="/brand/u-aqua.png"
            alt=""
            width={48}
            height={58}
            aria-hidden="true"
          />
        </div>

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

        {/* Color accent bar */}
        <div
          className="w-full h-1 rounded-full mt-4"
          style={{ backgroundColor: direction.color }}
        />

        {/* Video embed */}
        {direction.video_url && (() => {
          const embedUrl = getYouTubeEmbedUrl(direction.video_url)
          return embedUrl ? (
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 mt-6">
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
          <div className="prose prose-sm max-w-none text-text-muted mt-6">
            {direction.full_description.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>

      {/* === D&P LAYOUT === */}
      {direction.category === 'dp' ? (
        <>
          {/* D&P Modules */}
          {direction.competencies.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
                  <span className="text-lg">📋</span>
                </span>
                Hoe de vier verplichte modules van D&P hier tot leven komen
              </h2>
              <div className="grid gap-3">
                {direction.competencies.map((mod) => (
                  <div
                    key={mod.id}
                    className="bg-white rounded-xl border border-surface-lavender/40 p-4"
                  >
                    <h3 className="font-medium text-text mb-2">{mod.icon} {mod.title}</h3>
                    {mod.description && (
                      <ul className="space-y-1 ml-1">
                        {mod.description.split(/[,;]/).map((item, i) => (
                          <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: direction.color }} />
                            {item.trim()}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Past dit bij jou? (Traits) */}
          {direction.traits.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
                  <span className="text-lg">🎯</span>
                </span>
                Past dit bij jou?
              </h2>
              <div className="bg-white rounded-xl border border-surface-lavender/40 p-4">
                <p className="text-text-muted mb-3">Deze richting past bij jou als je:</p>
                <div className="flex flex-wrap gap-2">
                  {direction.traits.map((trait) => (
                    <span
                      key={trait.id}
                      className="px-3 py-1.5 rounded-full text-sm font-medium text-text border"
                      style={{
                        backgroundColor: `${direction.color}12`,
                        borderColor: `${direction.color}40`,
                      }}
                    >
                      {trait.trait}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Passende vakken bij deze richting */}
          {direction.subjects.fitting.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
                  <span className="text-lg">✨</span>
                </span>
                Passende vakken bij {direction.name}
              </h2>
              <div className="bg-surface-lavender-light/60 rounded-xl border border-surface-lavender/30 p-4 mb-4">
                <p className="text-sm text-text-muted leading-relaxed">
                  Naast de twee verplichte onderdelen mag je twee keuzevakken kiezen vanuit alle
                  richtingen. Hieronder worden de vakken benoemd die bij {direction.name} aansluiten,
                  maar spreken deze je niet aan? Dan kun je ook kiezen uit keuzevakken van andere
                  richtingen. Je mag twee vakken kiezen uit alle beschikbare keuzevakken.
                </p>
              </div>
              <div
                className="bg-white rounded-xl border-2 divide-y divide-surface-lavender/20"
                style={{ borderColor: `${direction.color}40` }}
              >
                {direction.subjects.fitting.map((ds) => (
                  <div key={ds.id} className="p-4 flex items-center gap-3">
                    <span className="text-lg">{ds.subject.icon || '📖'}</span>
                    <span className="font-medium text-text">{ds.subject.name}</span>
                    {ds.type && (
                      <span
                        className="text-xs ml-auto px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: `${direction.color}15`,
                          color: direction.color,
                        }}
                      >
                        {ds.type === 'required' ? 'verplicht' : 'keuze'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Algemene verplichte vakken - compact chips */}
          {direction.subjects.generalRequired.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
                  <span className="text-lg">📚</span>
                </span>
                Algemene verplichte vakken
              </h2>
              <div className="flex flex-wrap gap-2">
                {direction.subjects.generalRequired.map((ds) => (
                  <SubjectChip key={ds.id} subject={ds.subject} color={direction.color} />
                ))}
              </div>
            </section>
          )}

          {/* Algemene keuzevakken - compact chips */}
          {direction.subjects.generalOptional.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
                  <span className="text-lg">🎯</span>
                </span>
                Algemene keuzevakken
              </h2>
              <div className="flex flex-wrap gap-2">
                {direction.subjects.generalOptional.map((ds) => (
                  <SubjectChip key={ds.id} subject={ds.subject} color={direction.color} />
                ))}
              </div>
            </section>
          )}

          {/* Wat kun je later doen of worden? */}
          {(direction.careers.length > 0 || direction.education.length > 0) && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
                  <span className="text-lg">💼</span>
                </span>
                Wat kun je later doen of worden?
              </h2>

              {/* CMS-editable intro text */}
              {direction.careers_intro && (
                <div className="bg-surface-lavender-light/60 rounded-xl border border-surface-lavender/30 p-4 mb-4">
                  <p className="text-sm text-text-muted leading-relaxed">
                    {direction.careers_intro}
                  </p>
                </div>
              )}

              {/* Beroepen */}
              {direction.careers.length > 0 && (
                <div className="bg-white rounded-xl border border-surface-lavender/40 p-4 mb-4">
                  <p className="text-text-muted text-sm mb-3 font-medium">
                    Denk aan beroepen zoals:
                  </p>
                  <div className="grid gap-2 mb-4">
                    {direction.careers.map((dc) => (
                      <div key={dc.id} className="flex items-center gap-3">
                        <span className="text-lg">{dc.career.icon || '👤'}</span>
                        <span className="font-medium text-text">{dc.career.name}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-text-muted italic">
                    Er zijn talloze plekken en manieren om je creativiteit te gebruiken!
                  </p>
                </div>
              )}

              {/* Vervolgopleidingen */}
              {direction.education.length > 0 && (
                <div className="bg-white rounded-xl border border-surface-lavender/40 divide-y divide-surface-lavender/20">
                  <div className="p-4 pb-2">
                    <p className="text-text-muted text-sm font-medium">Vervolgopleidingen:</p>
                  </div>
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
              )}
            </section>
          )}

          {/* Documents (D&P) */}
          {direction.documents.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
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
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-surface-lavender/40 hover:border-surface-lavender hover:shadow-sm transition-all"
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
        </>
      ) : (
        <>
          {/* === DEFAULT LAYOUT (Mavo / overig) === */}

          {/* Competencies */}
          {direction.competencies.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
                  <span className="text-lg">💡</span>
                </span>
                Wat leer je?
              </h2>
              <div className="grid gap-3">
                {direction.competencies.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-white rounded-xl border border-surface-lavender/40 p-4"
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

          {/* Traits */}
          {direction.traits.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
                  <span className="text-lg">🎯</span>
                </span>
                Past dit bij jou?
              </h2>
              <div className="bg-white rounded-xl border border-surface-lavender/40 p-4">
                <p className="text-text-muted mb-3">Deze richting past bij jou als je:</p>
                <div className="flex flex-wrap gap-2">
                  {direction.traits.map((trait) => (
                    <span
                      key={trait.id}
                      className="px-3 py-1.5 rounded-full text-sm font-medium text-text border"
                      style={{
                        backgroundColor: `${direction.color}12`,
                        borderColor: `${direction.color}40`,
                      }}
                    >
                      {trait.trait}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Subjects — Mavo layout uses same 3-group structure */}
          {direction.subjects.fitting.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
                  <span className="text-lg">✨</span>
                </span>
                Passende vakken
              </h2>
              <div
                className="bg-white rounded-xl border-2 divide-y divide-surface-lavender/20"
                style={{ borderColor: `${direction.color}40` }}
              >
                {direction.subjects.fitting.map((ds) => (
                  <div key={ds.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{ds.subject.icon || '📖'}</span>
                      <span className="font-medium text-text">{ds.subject.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {ds.hours_per_week > 0 && (
                        <span className="text-sm text-text-muted">
                          {ds.hours_per_week} uur/week
                        </span>
                      )}
                      {ds.type && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `${direction.color}15`,
                            color: direction.color,
                          }}
                        >
                          {ds.type === 'required' ? 'verplicht' : 'keuze'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {direction.subjects.generalRequired.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
                  <span className="text-lg">📚</span>
                </span>
                Verplichte vakken
              </h2>
              <div className="bg-white rounded-xl border border-surface-lavender/40 divide-y divide-surface-lavender/20">
                {direction.subjects.generalRequired.map((ds) => (
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
            </section>
          )}

          {direction.subjects.generalOptional.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
                  <span className="text-lg">🎯</span>
                </span>
                Keuzevakken
              </h2>
              <div className="bg-white rounded-xl border border-surface-lavender/40 divide-y divide-surface-lavender/20">
                {direction.subjects.generalOptional.map((ds) => (
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
            </section>
          )}

          {/* Careers */}
          {direction.careers.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
                  <span className="text-lg">💼</span>
                </span>
                Wat kun je worden?
              </h2>
              <div className="grid gap-3">
                {direction.careers.map((dc) => (
                  <div
                    key={dc.id}
                    className="bg-white rounded-xl border border-surface-lavender/40 p-4"
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
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
                  <span className="text-lg">🎓</span>
                </span>
                Vervolgopleidingen
              </h2>
              <div className="bg-white rounded-xl border border-surface-lavender/40 divide-y divide-surface-lavender/20">
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
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${direction.color}15` }}
                >
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
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-surface-lavender/40 hover:border-surface-lavender hover:shadow-sm transition-all"
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
        </>
      )}

      {/* Bottom CTA */}
      <div
        className="mt-8 p-5 rounded-2xl text-center"
        style={{ backgroundColor: `${direction.color}10` }}
      >
        <p className="text-text font-bold mb-2">Heb je vragen over deze richting?</p>
        <p className="text-sm text-text-muted">
          Vraag het aan je mentor of decaan. Zij kunnen je meer vertellen over {direction.name}.
        </p>
      </div>
    </PublicLayout>
  )
}
