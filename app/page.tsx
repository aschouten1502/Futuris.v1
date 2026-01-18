import { getLevels } from '@/lib/data'
import { LevelCard } from '@/components/LevelCard'
import PublicLayout from '@/components/PublicLayout'

export const revalidate = 60

export default async function HomePage() {
  const levels = await getLevels()

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative mb-8">
        {/* Decorative gradient blob */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-futuris-teal/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-futuris-teal/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative">
          {/* Badge */}
          <span className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-futuris-teal/10 text-futuris-teal rounded-full">
            Bovenbouw Keuzegids
          </span>

          {/* Main heading */}
          <h1 className="section-title text-gradient mb-3">
            Ontdek jouw richting
          </h1>

          {/* Subtitle */}
          <p className="text-text-muted text-lg max-w-xl">
            Kies je niveau om de beschikbare profielen en vakken te bekijken.
            Ontdek welke studie- en beroepsmogelijkheden bij jou passen.
          </p>
        </div>
      </div>

      {levels.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <p>Geen niveaus gevonden.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {levels.map((level) => (
            <LevelCard key={level.id} level={level} />
          ))}
        </div>
      )}
    </PublicLayout>
  )
}
