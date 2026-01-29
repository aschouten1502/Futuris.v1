import Link from 'next/link'
import { getAllDirections } from '@/lib/data'
import DirectionsTable from '@/components/admin/DirectionsTable'

export default async function AdminDirectionsPage() {
  const directions = await getAllDirections()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Richtingen</h1>
          <p className="text-gray-600">Beheer de D&P richtingen en Mavo routes</p>
        </div>
        <Link
          href="/admin/directions/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm"
        >
          + Nieuwe richting
        </Link>
      </div>

      <DirectionsTable directions={directions} />

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-800 text-sm">
          <strong>Tip:</strong> Klik op &quot;Bewerken&quot; om een richting aan te passen. Je kunt daar
          de naam, beschrijving, video, competenties, eigenschappen, vakken, beroepen en opleidingen beheren.
          Gebruik &quot;Nieuwe richting&quot; om een nieuwe D&P richting of Mavo route aan te maken.
        </p>
      </div>
    </div>
  )
}
