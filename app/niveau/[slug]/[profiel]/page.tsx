import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLevels, getProfileWithDetails } from '@/lib/data'
import PublicLayout from '@/components/PublicLayout'

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string; profiel: string }>
}

export default async function ProfilePage({ params }: PageProps) {
  const { slug, profiel } = await params
  const profile = await getProfileWithDetails(slug, profiel)

  if (!profile) {
    notFound()
  }

  const requiredSubjects = profile.subjects.filter((s) => s.type === 'required')
  const optionalSubjects = profile.subjects.filter((s) => s.type === 'optional')

  return (
    <PublicLayout>
      <Link
        href={`/niveau/${slug}`}
        className="inline-flex items-center text-sm text-futuris-teal hover:text-futuris-teal/80 mb-4 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Terug naar {profile.level.name}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: profile.color }}
          >
            {profile.short_name}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{profile.name}</h1>
            <p className="text-text-muted">{profile.level.name}</p>
          </div>
        </div>
        {profile.description && (
          <p className="text-text-muted">{profile.description}</p>
        )}
      </div>

      {/* Verplichte vakken */}
      {requiredSubjects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-text mb-3">Verplichte vakken</h2>
          <div className="card divide-y divide-gray-100">
            {requiredSubjects.map((ps) => (
              <div key={ps.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-text">{ps.variant?.subject?.name}</h3>
                    {ps.variant?.description && (
                      <p className="text-sm text-text-muted mt-1">{ps.variant.description}</p>
                    )}
                    {ps.variant?.hours_per_week > 0 && (
                      <p className="text-xs text-text-muted mt-1">{ps.variant.hours_per_week} uur per week</p>
                    )}
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Verplicht
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Keuzevakken */}
      {optionalSubjects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-text mb-3">Keuzevakken</h2>
          <div className="card divide-y divide-gray-100">
            {optionalSubjects.map((ps) => (
              <div key={ps.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-text">{ps.variant?.subject?.name}</h3>
                    {ps.variant?.description && (
                      <p className="text-sm text-text-muted mt-1">{ps.variant.description}</p>
                    )}
                    {ps.variant?.hours_per_week > 0 && (
                      <p className="text-xs text-text-muted mt-1">{ps.variant.hours_per_week} uur per week</p>
                    )}
                  </div>
                  <span className="text-xs bg-gray-100 text-text-muted px-2 py-1 rounded-full">
                    Keuze
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Beroepen */}
      {profile.careers.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-text mb-3">Wat kun je worden?</h2>
          <div className="card divide-y divide-gray-100">
            {profile.careers.map((career) => (
              <div key={career.id} className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">💼</span>
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
      )}

      {/* Vervolgopleidingen */}
      {profile.further_education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-text mb-3">Vervolgopleidingen</h2>
          <div className="card divide-y divide-gray-100">
            {profile.further_education.map((edu) => (
              <div key={edu.id} className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🎓</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-text">{edu.name}</h3>
                      {edu.type && (
                        <span className="text-xs bg-futuris-teal/10 text-futuris-teal px-2 py-0.5 rounded uppercase">
                          {edu.type}
                        </span>
                      )}
                    </div>
                    {edu.description && (
                      <p className="text-sm text-text-muted mt-1">{edu.description}</p>
                    )}
                    {edu.url && (
                      <a
                        href={edu.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-futuris-teal hover:underline mt-1 inline-block"
                      >
                        Meer informatie →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </PublicLayout>
  )
}
