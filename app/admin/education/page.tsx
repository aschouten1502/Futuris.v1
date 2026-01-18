'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FurtherEducation } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'
import Link from 'next/link'

export default function EducationPage() {
  const [education, setEducation] = useState<FurtherEducation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const { toast, showToast, hideToast } = useToast()
  const supabase = createClient()

  const fetchEducation = async () => {
    let query = supabase
      .from('further_education')
      .select('*')
      .order('type')
      .order('order')

    if (filter !== 'all') {
      query = query.eq('type', filter)
    }

    const { data, error } = await query

    if (error) {
      showToast('Fout bij laden opleidingen', 'error')
    } else {
      setEducation(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEducation()
  }, [filter])

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze opleiding wilt verwijderen?')) return

    const { error } = await supabase.from('further_education').delete().eq('id', id)

    if (error) {
      showToast('Fout bij verwijderen', 'error')
    } else {
      showToast('Opleiding verwijderd', 'success')
      fetchEducation()
    }
  }

  const typeLabels: Record<string, string> = {
    mbo: 'MBO',
    hbo: 'HBO',
    wo: 'WO',
  }

  if (loading) return <div className="text-gray-500">Laden...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Vervolgopleidingen</h1>
        <Link
          href="/admin/education/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          + Nieuwe opleiding
        </Link>
      </div>

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        >
          <option value="all">Alle types</option>
          <option value="mbo">MBO</option>
          <option value="hbo">HBO</option>
          <option value="wo">WO</option>
        </select>
      </div>

      {education.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Nog geen opleidingen voor dit type.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Naam</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Beschrijving</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {education.map((edu) => (
                <tr key={edu.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-medium text-gray-900">{edu.name}</span>
                      {edu.url && (
                        <a
                          href={edu.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-xs text-primary-600 hover:underline"
                        >
                          Link
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded uppercase font-medium ${
                      edu.type === 'wo' ? 'bg-purple-100 text-purple-700' :
                      edu.type === 'hbo' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {edu.type ? (typeLabels[edu.type] || edu.type) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-md truncate">{edu.description || '-'}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/admin/education/${edu.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                      Bewerken
                    </Link>
                    <button onClick={() => handleDelete(edu.id)} className="text-red-600 hover:text-red-700 font-medium">
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
