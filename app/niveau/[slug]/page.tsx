import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLevels, getLevelWithProfiles } from '@/lib/data'
import { ProfileCard } from '@/components/ProfileCard'
import PublicLayout from '@/components/PublicLayout'

export const revalidate = 60

export async function generateStaticParams() {
  const levels = await getLevels()
  return levels.map((level) => ({
    slug: level.slug,
  }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function LevelPage({ params }: PageProps) {
  const { slug } = await params
  const level = await getLevelWithProfiles(slug)

  if (!level) {
    notFound()
  }

  return (
    <PublicLayout>
      <Link
        href="/"
        className="inline-flex items-center text-sm text-futuris-teal hover:text-futuris-teal/80 mb-4 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Terug naar overzicht
      </Link>

      <div className="mb-6">
        <h1 className="section-title text-text mb-2">
          {level.name} Profielen
        </h1>
        <p className="text-text-muted">
          Kies een profiel om de vakken, beroepen en vervolgopleidingen te bekijken.
        </p>
      </div>

      {level.profiles.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <p>Geen profielen gevonden voor dit niveau.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {level.profiles
            .sort((a, b) => a.order - b.order)
            .map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                levelSlug={level.slug}
              />
            ))}
        </div>
      )}
    </PublicLayout>
  )
}
