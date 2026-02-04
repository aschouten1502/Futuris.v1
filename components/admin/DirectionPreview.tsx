'use client'

import Image from 'next/image'
import type { Direction, DirectionCompetency, DirectionTrait, Subject, Career, FurtherEducation } from '@/lib/types'
import { AdaptiveDirectionImage } from '@/components/AdaptiveDirectionImage'

interface LinkedSubject {
  subject_id: string
  type: 'required' | 'optional' | null
  is_fitting: boolean
}

interface DirectionPreviewProps {
  direction: Direction
  competencies: DirectionCompetency[]
  traits: DirectionTrait[]
  allSubjects: Subject[]
  linkedSubjects: LinkedSubject[]
  allCareers: Career[]
  linkedCareers: string[]
  allEducation: FurtherEducation[]
  linkedEducation: string[]
  onFieldClick: (fieldId: string) => void
}

// Resolve linked items to full objects
function getLinkedSubjectsWithDetails(allSubjects: Subject[], linkedSubjects: LinkedSubject[]) {
  return linkedSubjects.map(ls => ({
    ...ls,
    subject: allSubjects.find(s => s.id === ls.subject_id)!
  })).filter(ls => ls.subject)
}

function getLinkedCareers(allCareers: Career[], linkedCareers: string[]) {
  return linkedCareers.map(id => allCareers.find(c => c.id === id)).filter(Boolean) as Career[]
}

function getLinkedEducation(allEducation: FurtherEducation[], linkedEducation: string[]) {
  return linkedEducation.map(id => allEducation.find(e => e.id === id)).filter(Boolean) as FurtherEducation[]
}

// Convert YouTube URL to embed format
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null
  if (url.includes('youtube.com/embed/')) {
    return url.startsWith('http') ? url : `https://${url}`
  }
  const pattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(pattern)
  if (match) return `https://www.youtube.com/embed/${match[1]}`
  return null
}

export function DirectionPreview({
  direction,
  competencies,
  traits,
  allSubjects,
  linkedSubjects,
  allCareers,
  linkedCareers,
  allEducation,
  linkedEducation,
  onFieldClick,
}: DirectionPreviewProps) {
  const color = direction.color || '#003c46'
  const isDp = direction.category === 'dp'

  // Process linked data
  const subjectsWithDetails = getLinkedSubjectsWithDetails(allSubjects, linkedSubjects)
  const fittingSubjects = subjectsWithDetails.filter(s => s.is_fitting)
  const generalRequired = subjectsWithDetails.filter(s => !s.is_fitting && s.type === 'required')
  const generalOptional = subjectsWithDetails.filter(s => !s.is_fitting && s.type === 'optional')
  const careers = getLinkedCareers(allCareers, linkedCareers)
  const education = getLinkedEducation(allEducation, linkedEducation)

  const embedUrl = direction.video_url ? getYouTubeEmbedUrl(direction.video_url) : null

  const typeLabels: Record<string, string> = {
    mbo: 'MBO',
    hbo: 'HBO',
    wo: 'WO',
  }

  // Clickable wrapper component
  const ClickableArea = ({
    fieldId,
    children,
    className = ''
  }: {
    fieldId: string
    children: React.ReactNode
    className?: string
  }) => (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onFieldClick(fieldId)
      }}
      className={`cursor-pointer hover:ring-2 hover:ring-primary-400 hover:ring-offset-2 rounded-xl transition-all ${className}`}
    >
      {children}
    </div>
  )

  return (
    <div className="bg-surface-lavender-light rounded-xl overflow-hidden border border-gray-200">
      {/* Preview header bar */}
      <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 text-xs text-gray-600 border-b border-gray-200">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className="font-medium">Live preview</span>
        <span className="text-gray-500 ml-auto">Klik op een sectie om te bewerken</span>
      </div>

      {/* Actual page content - same as public page */}
      <div className="relative max-h-[calc(100vh-180px)] overflow-y-auto bg-surface-lavender-light">
        {/* Decorative U shapes - same as PublicLayout */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Pink outline U - top right */}
          <div className="absolute -top-8 -right-16 opacity-[0.8]">
            <Image
              src="/brand/u-pink-outline.png"
              alt=""
              width={180}
              height={225}
              aria-hidden="true"
              className="select-none"
            />
          </div>
          {/* Yellow U - bottom left */}
          <div className="absolute bottom-8 -left-8 opacity-[0.35] rotate-[135deg]">
            <Image
              src="/brand/u-yellow.png"
              alt=""
              width={90}
              height={112}
              aria-hidden="true"
              className="select-none"
            />
          </div>
          {/* Frosted-glass overlay */}
          <div className="absolute inset-0 bg-surface-lavender-light/75 backdrop-blur-[2px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6">
        {/* Header */}
        <ClickableArea fieldId="header" className="relative mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
              style={{ backgroundColor: `${color}15` }}
            >
              {direction.icon || '📚'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text">{direction.name || 'Naam richting'}</h1>
              {direction.short_description && (
                <p className="text-text-muted">{direction.short_description}</p>
              )}
            </div>
          </div>

          {/* Color accent bar */}
          <div
            className="w-full h-1 rounded-full mt-4"
            style={{ backgroundColor: color }}
          />
        </ClickableArea>

        {/* Image with description - layout adapts to orientation */}
        {direction.image_url ? (
          <ClickableArea fieldId="header" className="mb-6">
            <AdaptiveDirectionImage
              src={direction.image_url}
              alt={`Afbeelding van ${direction.name}`}
              orientation={direction.image_orientation}
              color={color}
            >
              {/* For portrait/square: description appears next to image */}
              {direction.image_orientation !== 'landscape' && direction.full_description && (
                <div className="prose prose-sm max-w-none text-text-muted">
                  {direction.full_description.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              )}
            </AdaptiveDirectionImage>
            {/* For landscape: description appears below image */}
            {direction.image_orientation === 'landscape' && direction.full_description && (
              <div className="prose prose-sm max-w-none text-text-muted mt-6">
                {direction.full_description.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )}
          </ClickableArea>
        ) : (
          <>
            {/* Video fallback */}
            {embedUrl && (
              <ClickableArea fieldId="header" className="mb-6">
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 relative">
                  <iframe
                    src={embedUrl}
                    title="Video over deze richting"
                    className="w-full h-full pointer-events-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                  <div className="absolute inset-0 bg-transparent" />
                </div>
              </ClickableArea>
            )}
            {/* Description when no image */}
            {direction.full_description && (
              <ClickableArea fieldId="full-description" className="mb-8">
                <div className="prose prose-sm max-w-none text-text-muted">
                  {direction.full_description.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </ClickableArea>
            )}
          </>
        )}

        {/* === D&P LAYOUT === */}
        {isDp ? (
          <>
            {/* D&P Modules */}
            {competencies.length > 0 && (
              <ClickableArea fieldId="modules" className="mb-4">
                <section>
                  <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <span className="text-lg">📋</span>
                    </span>
                    Hoe de vier verplichte modules van D&P hier tot leven komen
                  </h2>
                  <div className="grid gap-3">
                    {competencies.map((mod, i) => (
                      <div
                        key={mod.id || i}
                        className="bg-white rounded-xl border border-surface-lavender/40 p-4"
                      >
                        <h3 className="font-medium text-text mb-2">{mod.icon} {mod.title}</h3>
                        {mod.description && (
                          <ul className="space-y-1 ml-1">
                            {mod.description.split(',').map((item, j) => (
                              <li key={j} className="text-sm text-text-muted flex items-start gap-2">
                                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                                {item.trim()}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </ClickableArea>
            )}

            {/* Link naar D&P modules pagina */}
            {competencies.length > 0 && (
              <ClickableArea fieldId="linkteksten" className="mb-8">
                <div className="flex items-center gap-2 text-sm text-futuris-teal hover:text-futuris-teal/80 font-medium transition-colors group cursor-pointer">
                  <span>{direction.dp_modules_link_text || 'Lees meer over de vier D&P modules'}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </ClickableArea>
            )}

            {/* Past dit bij jou? (Traits) */}
            {traits.length > 0 && (
              <ClickableArea fieldId="traits" className="mb-8">
                <section>
                  <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <span className="text-lg">🎯</span>
                    </span>
                    Past dit bij jou?
                  </h2>
                  <div className="bg-white rounded-xl border border-surface-lavender/40 p-4">
                    <p className="text-text-muted mb-3">Deze richting past bij jou als je:</p>
                    <div className="flex flex-wrap gap-2">
                      {traits.map((trait, i) => (
                        <span
                          key={trait.id || i}
                          className="px-3 py-1.5 rounded-full text-sm font-medium text-text border"
                          style={{
                            backgroundColor: `${color}12`,
                            borderColor: `${color}40`,
                          }}
                        >
                          {trait.trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              </ClickableArea>
            )}

            {/* Passende vakken bij deze richting */}
            {fittingSubjects.length > 0 && (
              <ClickableArea fieldId="subjects" className="mb-4">
                <section>
                  <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <span className="text-lg">✨</span>
                    </span>
                    Passende vakken bij {direction.name}
                  </h2>
                  <div className="bg-surface-lavender-light/60 rounded-xl border border-surface-lavender/30 p-4 mb-4">
                    <p className="text-sm text-text-muted leading-relaxed">
                      Naast de twee verplichte onderdelen mag je twee keuzevakken kiezen vanuit alle
                      richtingen. Hieronder worden de vakken benoemd die bij {direction.name} aansluiten.
                    </p>
                  </div>
                  <div
                    className="bg-white rounded-xl border-2 divide-y divide-surface-lavender/20"
                    style={{ borderColor: `${color}40` }}
                  >
                    {fittingSubjects.map((ds) => (
                      <div key={ds.subject_id} className="p-4 flex items-center gap-3">
                        <span className="text-lg">{ds.subject.icon || '📖'}</span>
                        <span className="font-medium text-text">{ds.subject.name}</span>
                        {ds.type && (
                          <span
                            className="text-xs ml-auto px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: `${color}15`,
                              color: color,
                            }}
                          >
                            {ds.type === 'required' ? 'verplicht' : 'keuze'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </ClickableArea>
            )}

            {/* Link naar keuzevakken */}
            {fittingSubjects.length > 0 && (
              <ClickableArea fieldId="linkteksten" className="mb-8">
                <div className="flex items-center gap-2 text-sm text-futuris-teal hover:text-futuris-teal/80 font-medium transition-colors group cursor-pointer">
                  <span>{direction.keuzevakken_link_text || 'Bekijk alle beschikbare keuzevakken'}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </ClickableArea>
            )}

            {/* Algemene verplichte vakken - compact chips */}
            {generalRequired.length > 0 && (
              <ClickableArea fieldId="subjects" className="mb-8">
                <section>
                  <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <span className="text-lg">📚</span>
                    </span>
                    Algemene verplichte vakken
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {generalRequired.map((ds) => (
                      <button
                        key={ds.subject_id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                      >
                        <span>{ds.subject.icon || '📖'}</span>
                        <span className="text-text-muted">{ds.subject.name}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </ClickableArea>
            )}

            {/* Algemene keuzevakken - compact chips */}
            {generalOptional.length > 0 && (
              <ClickableArea fieldId="subjects" className="mb-8">
                <section>
                  <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <span className="text-lg">🎯</span>
                    </span>
                    Algemene keuzevakken
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {generalOptional.map((ds) => (
                      <button
                        key={ds.subject_id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                      >
                        <span>{ds.subject.icon || '📖'}</span>
                        <span className="text-text-muted">{ds.subject.name}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </ClickableArea>
            )}

            {/* Wat kun je later doen of worden? */}
            {(careers.length > 0 || education.length > 0) && (
              <ClickableArea fieldId="careers" className="mb-8">
                <section>
                  <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <span className="text-lg">💼</span>
                    </span>
                    Wat kun je later doen of worden?
                  </h2>

                  {/* CMS-editable intro text */}
                  {direction.careers_intro && (
                    <div
                      className="bg-surface-lavender-light/60 rounded-xl border border-surface-lavender/30 p-4 mb-4 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        onFieldClick('careers-intro')
                      }}
                    >
                      <p className="text-sm text-text-muted leading-relaxed">
                        {direction.careers_intro}
                      </p>
                    </div>
                  )}

                  {/* Beroepen */}
                  {careers.length > 0 && (
                    <div className="bg-white rounded-xl border border-surface-lavender/40 p-4 mb-4">
                      <p className="text-text-muted text-sm mb-3 font-medium">
                        Denk aan beroepen zoals:
                      </p>
                      <div className="grid gap-2 mb-4">
                        {careers.map((career) => (
                          <div key={career.id} className="flex items-center gap-3">
                            <span className="text-lg">{career.icon || '👤'}</span>
                            <span className="font-medium text-text">{career.name}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-text-muted italic">
                        Er zijn talloze plekken en manieren om je creativiteit te gebruiken!
                      </p>
                    </div>
                  )}

                  {/* Vervolgopleidingen */}
                  {education.length > 0 && (
                    <div
                      className="bg-white rounded-xl border border-surface-lavender/40 divide-y divide-surface-lavender/20 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        onFieldClick('education')
                      }}
                    >
                      <div className="p-4 pb-2">
                        <p className="text-text-muted text-sm font-medium">Vervolgopleidingen:</p>
                      </div>
                      {education.map((edu) => (
                        <div key={edu.id} className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-medium text-text">{edu.name}</h3>
                              {edu.institution && (
                                <p className="text-sm text-text-muted">{edu.institution}</p>
                              )}
                              {edu.description && (
                                <p className="text-sm text-text-muted mt-1">{edu.description}</p>
                              )}
                            </div>
                            {edu.type && (
                              <span
                                className="shrink-0 px-2 py-1 rounded text-xs font-medium uppercase"
                                style={{
                                  backgroundColor: `${color}15`,
                                  color: color,
                                }}
                              >
                                {typeLabels[edu.type] || edu.type}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </ClickableArea>
            )}
          </>
        ) : (
          <>
            {/* === MAVO LAYOUT === */}
            {/* Competencies */}
            {competencies.length > 0 && (
              <ClickableArea fieldId="modules" className="mb-8">
                <section>
                  <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <span className="text-lg">💡</span>
                    </span>
                    Wat leer je?
                  </h2>
                  <div className="grid gap-3">
                    {competencies.map((comp, i) => (
                      <div
                        key={comp.id || i}
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
              </ClickableArea>
            )}

            {/* Traits */}
            {traits.length > 0 && (
              <ClickableArea fieldId="traits" className="mb-8">
                <section>
                  <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <span className="text-lg">🎯</span>
                    </span>
                    Past dit bij jou?
                  </h2>
                  <div className="bg-white rounded-xl border border-surface-lavender/40 p-4">
                    <p className="text-text-muted mb-3">Deze richting past bij jou als je:</p>
                    <div className="flex flex-wrap gap-2">
                      {traits.map((trait, i) => (
                        <span
                          key={trait.id || i}
                          className="px-3 py-1.5 rounded-full text-sm font-medium text-text border"
                          style={{
                            backgroundColor: `${color}12`,
                            borderColor: `${color}40`,
                          }}
                        >
                          {trait.trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              </ClickableArea>
            )}

            {/* Subjects */}
            {subjectsWithDetails.length > 0 && (
              <ClickableArea fieldId="subjects" className="mb-4">
                <section>
                  <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <span className="text-lg">📚</span>
                    </span>
                    Vakken
                  </h2>
                  <div className="bg-white rounded-xl border border-surface-lavender/40 divide-y divide-surface-lavender/20">
                    {subjectsWithDetails.map((ds) => (
                      <div key={ds.subject_id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{ds.subject.icon || '📖'}</span>
                          <span className="font-medium text-text">{ds.subject.name}</span>
                        </div>
                        {ds.type && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: `${color}15`,
                              color: color,
                            }}
                          >
                            {ds.type === 'required' ? 'verplicht' : 'keuze'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </ClickableArea>
            )}

            {/* Link naar keuzevakken - Mavo */}
            {subjectsWithDetails.length > 0 && (
              <ClickableArea fieldId="linkteksten" className="mb-8">
                <div className="flex items-center gap-2 text-sm text-futuris-teal hover:text-futuris-teal/80 font-medium transition-colors group cursor-pointer">
                  <span>{direction.keuzevakken_link_text || 'Bekijk alle beschikbare keuzevakken'}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </ClickableArea>
            )}

            {/* Careers */}
            {careers.length > 0 && (
              <ClickableArea fieldId="careers" className="mb-8">
                <section>
                  <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <span className="text-lg">💼</span>
                    </span>
                    Wat kun je worden?
                  </h2>
                  <div className="grid gap-3">
                    {careers.map((career) => (
                      <div
                        key={career.id}
                        className="bg-white rounded-xl border border-surface-lavender/40 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl">{career.icon || '👤'}</span>
                          <div>
                            <h3 className="font-medium text-text">{career.name}</h3>
                            {career.description && (
                              <p className="text-sm text-text-muted mt-1">{career.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </ClickableArea>
            )}

            {/* Education */}
            {education.length > 0 && (
              <ClickableArea fieldId="education" className="mb-8">
                <section>
                  <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <span className="text-lg">🎓</span>
                    </span>
                    Vervolgopleidingen
                  </h2>
                  <div className="bg-white rounded-xl border border-surface-lavender/40 divide-y divide-surface-lavender/20">
                    {education.map((edu) => (
                      <div key={edu.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-medium text-text">{edu.name}</h3>
                            {edu.institution && (
                              <p className="text-sm text-text-muted">{edu.institution}</p>
                            )}
                            {edu.description && (
                              <p className="text-sm text-text-muted mt-1">{edu.description}</p>
                            )}
                          </div>
                          {edu.type && (
                            <span
                              className="shrink-0 px-2 py-1 rounded text-xs font-medium uppercase"
                              style={{
                                backgroundColor: `${color}15`,
                                color: color,
                              }}
                            >
                              {typeLabels[edu.type] || edu.type}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </ClickableArea>
            )}
          </>
        )}

        {/* Bottom CTA */}
        <div
          className="mt-8 p-5 rounded-2xl text-center"
          style={{ backgroundColor: `${color}10` }}
        >
          <p className="text-text font-bold mb-2">Heb je vragen over deze richting?</p>
          <p className="text-sm text-text-muted">
            Vraag het aan je mentor of decaan. Zij kunnen je meer vertellen over {direction.name || 'deze richting'}.
          </p>
        </div>
        </div>
      </div>
    </div>
  )
}
