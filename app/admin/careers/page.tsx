'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Career } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'
import Link from 'next/link'

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const { toast, showToast, hideToast } = useToast()
  const supabase = createClient()

  const fetchCareers = async () => {
    const { data, error } = await supabase
      .from('careers')
      .select('*')
      .order('order')

    if (error) {
      showToast('Fout bij laden beroepen', 'error')
    } else {
      setCareers(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCareers()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit beroep wilt verwijderen?')) return

    const { error } = await supabase.from('careers').delete().eq('id', id)

    if (error) {
      showToast('Fout bij verwijderen', 'error')
    } else {
      showToast('Beroep verwijderd', 'success')
      fetchCareers()
    }
  }

  if (loading) return <div className="text-gray-500">Laden...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Beroepen</h1>
        <Link
          href="/admin/careers/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          + Nieuw beroep
        </Link>
      </div>

      {careers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Nog geen beroepen toegevoegd.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Naam</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Beschrijving</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {careers.map((career) => (
                <tr key={career.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{career.name}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-md truncate">{career.description || '-'}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/admin/careers/${career.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                      Bewerken
                    </Link>
                    <button onClick={() => handleDelete(career.id)} className="text-red-600 hover:text-red-700 font-medium">
                      Verwijderen
                    </button>
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
