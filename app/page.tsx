import { getDirections } from '@/lib/data'
import { CategorySelector } from '@/components/CategorySelector'
import PublicLayout from '@/components/PublicLayout'
import type { Direction } from '@/lib/types'

export const revalidate = 60

export default async function HomePage() {
  const directions = await getDirections()

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
      />

      {/* Info boxes */}
      <div className="mt-10 space-y-4">
        {/* Info box - Wat is D&P? */}
        <div className="p-5 bg-surface-lavender-light rounded-2xl border border-surface-lavender/30">
          <h3 className="font-bold text-futuris-teal mb-2">Wat is D&P?</h3>
          <p className="text-sm text-text-muted leading-relaxed">
            D&P staat voor &quot;Dienstverlening en Producten&quot;. Dit zijn de
            richtingen die je kunt kiezen in de bovenbouw. Elke richting
            bereidt je voor op specifieke vervolgopleidingen en beroepen.
          </p>
        </div>

        {/* Info box - Mavo Routes */}
        <div className="p-5 bg-surface-sage-light rounded-2xl border border-surface-sage/30">
          <h3 className="font-bold text-futuris-teal mb-2">Mavo Routes</h3>
          <p className="text-sm text-text-muted leading-relaxed">
            Naast D&P biedt Futuris SG ook mavo-routes aan.
            Afhankelijk van jouw plannen na de mavo kies je de route
            die het beste bij je past.
          </p>
        </div>
      </div>

      {/* Empty state */}
      {directions.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p>Geen richtingen gevonden.</p>
        </div>
      )}
    </PublicLayout>
  )
}
