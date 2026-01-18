'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Level } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'
import Link from 'next/link'

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const { toast, showToast, hideToast } = useToast()
  const supabase = createClient()

  const fetchLevels = async () => {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .order('order')

    if (error) {
      showToast('Fout bij laden niveaus', 'error')
    } else {
      setLevels(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLevels()
  }, [])

  if (loading) return <div className="text-gray-500">Laden...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Niveaus</h1>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          Niveaus zijn vast ingesteld (VMBO, HAVO, VWO) en kunnen niet worden toegevoegd of verwijderd.
          Je kunt wel de beschrijving en het aantal leerjaren aanpassen.
        </p>
      </div>

      {levels.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Geen niveaus gevonden.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Naam</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Leerjaren</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Beschrijving</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {levels.map((level) => (
                <tr key={level.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{level.name}</td>
                  <td className="px-6 py-4 text-gray-500">{level.years} jaar</td>
                  <td className="px-6 py-4 text-gray-500 max-w-md truncate">{level.description || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/levels/${level.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                      Bewerken
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
