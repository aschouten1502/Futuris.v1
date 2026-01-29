import { getDirections } from '@/lib/data'
import { DirectionCard } from '@/components/DirectionCard'
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
      <div className="mb-10">
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
            Welke richting past bij jou? Klik op een richting om te ontdekken
            welke vakken, beroepen en opleidingen daarbij horen.
          </p>
        </div>
      </div>

      {/* D&P Richtingen Section */}
      {dpDirections.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-futuris-teal rounded-full" />
            <h2 className="text-lg font-bold text-text">
              D&P Richtingen
            </h2>
          </div>
          <p className="text-text-muted text-sm mb-4">
            Dienstverlening &amp; Producten — kies de richting die bij jou past
          </p>
          <div className="space-y-3">
            {dpDirections.map((direction) => (
              <DirectionCard key={direction.id} direction={direction} />
            ))}
          </div>
        </section>
      )}

      {/* Mavo Routes Section */}
      {mavoDirections.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-surface-lavender rounded-full" />
            <h2 className="text-lg font-bold text-text">
              Mavo Routes
            </h2>
          </div>
          <p className="text-text-muted text-sm mb-4">
            Ontdek welke mavo-route bij jouw toekomstplannen past
          </p>
          <div className="space-y-3">
            {mavoDirections.map((direction) => (
              <DirectionCard key={direction.id} direction={direction} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {directions.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p>Geen richtingen gevonden.</p>
        </div>
      )}

      {/* Info box - Wat is D&P? */}
      <div className="mt-8 p-5 bg-surface-lavender-light rounded-2xl border border-surface-lavender/30">
        <h3 className="font-bold text-futuris-teal mb-2">Wat is D&P?</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          D&P staat voor &quot;Dienstverlening en Producten&quot;. Dit zijn de
          richtingen die je kunt kiezen in de bovenbouw. Elke richting
          bereidt je voor op specifieke vervolgopleidingen en beroepen.
        </p>
      </div>

      {/* Info box - Mavo Routes */}
      <div className="mt-4 p-5 bg-surface-sage-light rounded-2xl border border-surface-sage/30">
        <h3 className="font-bold text-futuris-teal mb-2">Mavo Routes</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          Naast D&P biedt Futuris SG ook mavo-routes aan.
          Afhankelijk van jouw plannen na de mavo kies je de route
          die het beste bij je past.
        </p>
      </div>
    </PublicLayout>
  )
}
