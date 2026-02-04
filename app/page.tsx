import { getDirections, getInfoBoxSettings } from '@/lib/data'
import { CategorySelector } from '@/components/CategorySelector'
import PublicLayout from '@/components/PublicLayout'
import type { Direction } from '@/lib/types'

export const revalidate = 60

export default async function HomePage() {
  const [directions, infoBoxSettings] = await Promise.all([
    getDirections(),
    getInfoBoxSettings(),
  ])

  // Split directions into D&P and Mavo categories
  const dpDirections = directions.filter((d: Direction) => d.category !== 'mavo')
  const mavoDirections = directions.filter((d: Direction) => d.category === 'mavo')

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="mb-8">
        <div>
          {/* Badge */}
          <span className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-futuris-teal/10 text-futuris-teal rounded-full">
            Futuris SG
          </span>

          {/* Main heading */}
          <h1 className="text-2xl font-bold text-text mb-3">
            Ontdek jouw richting
          </h1>

          {/* Subtitle */}
          <p className="text-text-muted text-base">
            Kies hieronder een categorie om te ontdekken welke richtingen bij jou passen.
          </p>
        </div>
      </div>

      {/* Category Selector - D&P and Mavo side by side */}
      <CategorySelector
        dpDirections={dpDirections}
        mavoDirections={mavoDirections}
        infoBoxSettings={infoBoxSettings}
      />

      {/* Empty state */}
      {directions.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p>Geen richtingen gevonden.</p>
        </div>
      )}
    </PublicLayout>
  )
}
