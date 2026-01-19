'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FurtherEducation } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'

export default function EducationPage() {
  const [education, setEducation] = useState<FurtherEducation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', type: 'mbo' as 'mbo' | 'hbo' | 'wo', description: '', institution: '' })
  const [newForm, setNewForm] = useState({ name: '', type: 'mbo' as 'mbo' | 'hbo' | 'wo', description: '', institution: '' })
  const [showNew, setShowNew] = useState(false)
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

  const handleCreate = async () => {
    if (!newForm.name.trim()) {
      showToast('Vul een naam in', 'error')
      return
    }

    const { error } = await supabase.from('further_education').insert({
      name: newForm.name,
      type: newForm.type,
      description: newForm.description || null,
      institution: newForm.institution || null,
      order: education.length,
    })

    if (error) {
      showToast('Fout bij aanmaken', 'error')
    } else {
      showToast('Opleiding aangemaakt', 'success')
      setNewForm({ name: '', type: 'mbo', description: '', institution: '' })
      setShowNew(false)
      fetchEducation()
    }
  }

  const startEdit = (edu: FurtherEducation) => {
    setEditingId(edu.id)
    setEditForm({
      name: edu.name,
      type: (edu.type as 'mbo' | 'hbo' | 'wo') || 'mbo',
      description: edu.description || '',
      institution: edu.institution || '',
    })
  }

  const handleUpdate = async () => {
    if (!editingId || !editForm.name.trim()) return

    const { error } = await supabase
      .from('further_education')
      .update({
        name: editForm.name,
        type: editForm.type,
        description: editForm.description || null,
        institution: editForm.institution || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingId)

    if (error) {
      showToast('Fout bij opslaan', 'error')
    } else {
      showToast('Opgeslagen', 'success')
      setEditingId(null)
      fetchEducation()
    }
  }

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vervolgopleidingen</h1>
          <p className="text-sm text-gray-500 mt-1">
            Beheer alle opleidingen. Koppel opleidingen aan richtingen via de richting-pagina.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          + Nieuwe opleiding
        </button>
      </div>

      {/* Filter */}
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

      {/* New form */}
      {showNew && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Nieuwe opleiding</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4">
              <input
                type="text"
                value={newForm.name}
                onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                placeholder="Naam"
                className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={newForm.type}
                onChange={e => setNewForm({ ...newForm, type: e.target.value as 'mbo' | 'hbo' | 'wo' })}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="mbo">MBO</option>
                <option value="hbo">HBO</option>
                <option value="wo">WO</option>
              </select>
              <input
                type="text"
                value={newForm.institution}
                onChange={e => setNewForm({ ...newForm, institution: e.target.value })}
                placeholder="Instelling"
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <input
              type="text"
              value={newForm.description}
              onChange={e => setNewForm({ ...newForm, description: e.target.value })}
              placeholder="Beschrijving (optioneel)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCreate}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700"
              >
                Toevoegen
              </button>
              <button
                type="button"
                onClick={() => setShowNew(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

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
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Instelling</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {education.map((edu) => (
                <tr key={edu.id} className="hover:bg-gray-50">
                  {editingId === edu.id ? (
                    <>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Naam"
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <select
                          value={editForm.type}
                          onChange={e => setEditForm({ ...editForm, type: e.target.value as 'mbo' | 'hbo' | 'wo' })}
                          className="px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="mbo">MBO</option>
                          <option value="hbo">HBO</option>
                          <option value="wo">WO</option>
                        </select>
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={editForm.institution}
                          onChange={e => setEditForm({ ...editForm, institution: e.target.value })}
                          placeholder="Instelling"
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={handleUpdate}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Opslaan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-700 font-medium"
                        >
                          Annuleren
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{edu.name}</span>
                        {edu.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{edu.description}</p>
                        )}
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
                      <td className="px-6 py-4 text-gray-500 text-sm">{edu.institution || '-'}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => startEdit(edu)}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Bewerken
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(edu.id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Verwijderen
                        </button>
                      </td>
                    </>
                  )}
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
