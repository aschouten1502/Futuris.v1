import Link from 'next/link'
import { getAllDirections } from '@/lib/data'

export default async function AdminDirectionsPage() {
  const directions = await getAllDirections()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Richtingen</h1>
          <p className="text-gray-600">Beheer de D&P richtingen</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Richting
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acties
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {directions.map((direction) => (
              <tr key={direction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${direction.color}15` }}
                    >
                      {direction.icon || '📚'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{direction.name}</div>
                      <div className="text-sm text-gray-500">{direction.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      direction.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {direction.is_active ? 'Actief' : 'Inactief'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/directions/${direction.id}`}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    Bewerken
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-800 text-sm">
          <strong>Tip:</strong> Klik op &quot;Bewerken&quot; om een richting aan te passen. Je kunt daar
          de naam, beschrijving, video, competenties, eigenschappen, vakken, beroepen en opleidingen beheren.
        </p>
      </div>
    </div>
  )
}
