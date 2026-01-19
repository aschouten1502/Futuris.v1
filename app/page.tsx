import { getDirections } from '@/lib/data'
import { DirectionCard } from '@/components/DirectionCard'
import PublicLayout from '@/components/PublicLayout'

export const revalidate = 60

export default async function HomePage() {
  const directions = await getDirections()

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
            D&P Bovenbouw
          </span>

          {/* Main heading */}
          <h1 className="section-title text-gradient mb-3">
            Ontdek jouw richting
          </h1>

          {/* Subtitle */}
          <p className="text-text-muted text-lg max-w-xl">
            Welke D&P richting past bij jou? Klik op een richting om te ontdekken
            welke vakken, beroepen en opleidingen daarbij horen.
          </p>
        </div>
      </div>

      {directions.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <p>Geen richtingen gevonden.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {directions.map((direction) => (
            <DirectionCard key={direction.id} direction={direction} />
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="mt-8 p-4 bg-futuris-teal/5 rounded-xl border border-futuris-teal/10">
        <h3 className="font-medium text-futuris-teal mb-2">Wat is D&P?</h3>
        <p className="text-sm text-text-muted">
          D&P staat voor &quot;Dienstverlening en Producten&quot;. Dit zijn de
          vier richtingen die je kunt kiezen in de bovenbouw. Elke richting
          bereidt je voor op specifieke vervolgopleidingen en beroepen.
        </p>
      </div>
    </PublicLayout>
  )
}
