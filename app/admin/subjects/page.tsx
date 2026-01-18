'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SubjectMaster } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'
import Link from 'next/link'

type SubjectWithCount = SubjectMaster & { variant_count: number }

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const { toast, showToast, hideToast } = useToast()
  const supabase = createClient()

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from('subjects_master')
      .select(`
        *,
        variants:subject_variants (id)
      `)
      .order('order', { ascending: true })

    if (error) {
      showToast('Fout bij laden vakken', 'error')
    } else {
      const subjectsWithCount = (data || []).map(subject => ({
        ...subject,
        variant_count: subject.variants?.length || 0,
        variants: undefined
      })) as SubjectWithCount[]
      setSubjects(subjectsWithCount)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit vak wilt verwijderen? Dit verwijdert ook alle niveau-varianten.')) return

    const { error } = await supabase.from('subjects_master').delete().eq('id', id)

    if (error) {
      showToast('Fout bij verwijderen', 'error')
    } else {
      showToast('Vak verwijderd', 'success')
      fetchSubjects()
    }
  }

  if (loading) return <div className="text-gray-500">Laden...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vakken</h1>
          <p className="text-sm text-gray-500 mt-1">
            Beheer vakken en hun niveau-specifieke varianten
          </p>
        </div>
        <Link
          href="/admin/subjects/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          + Nieuw vak
        </Link>
      </div>

      {subjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Nog geen vakken aangemaakt.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Vak</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actieve niveaus</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {subject.icon && (
                        <span className="text-xl">{subject.icon}</span>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{subject.name}</div>
                        <div className="text-xs text-gray-500">{subject.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm px-2 py-1 rounded ${
                      subject.variant_count === 0
                        ? 'bg-gray-100 text-gray-500'
                        : subject.variant_count === 5
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {subject.variant_count} {subject.variant_count === 1 ? 'niveau' : 'niveaus'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/subjects/${subject.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Bewerken
                    </Link>
                    <button
                      onClick={() => handleDelete(subject.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
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
