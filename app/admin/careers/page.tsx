'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Career } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '', icon: '' })
  const [newForm, setNewForm] = useState({ name: '', description: '', icon: '' })
  const [showNew, setShowNew] = useState(false)
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

  const handleCreate = async () => {
    if (!newForm.name.trim()) {
      showToast('Vul een naam in', 'error')
      return
    }

    const { error } = await supabase.from('careers').insert({
      name: newForm.name,
      description: newForm.description || null,
      icon: newForm.icon || null,
      order: careers.length,
    })

    if (error) {
      showToast('Fout bij aanmaken', 'error')
    } else {
      showToast('Beroep aangemaakt', 'success')
      setNewForm({ name: '', description: '', icon: '' })
      setShowNew(false)
      fetchCareers()
    }
  }

  const startEdit = (career: Career) => {
    setEditingId(career.id)
    setEditForm({
      name: career.name,
      description: career.description || '',
      icon: career.icon || '',
    })
  }

  const handleUpdate = async () => {
    if (!editingId || !editForm.name.trim()) return

    const { error } = await supabase
      .from('careers')
      .update({
        name: editForm.name,
        description: editForm.description || null,
        icon: editForm.icon || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingId)

    if (error) {
      showToast('Fout bij opslaan', 'error')
    } else {
      showToast('Opgeslagen', 'success')
      setEditingId(null)
      fetchCareers()
    }
  }

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Beroepen</h1>
          <p className="text-sm text-gray-500 mt-1">
            Beheer alle beroepen. Koppel beroepen aan richtingen via de richting-pagina.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          + Nieuw beroep
        </button>
      </div>

      {/* New form */}
      {showNew && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Nieuw beroep</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4">
              <input
                type="text"
                value={newForm.icon}
                onChange={e => setNewForm({ ...newForm, icon: e.target.value })}
                placeholder="👤"
                className="px-3 py-2 border border-gray-300 rounded-lg text-center"
              />
              <input
                type="text"
                value={newForm.name}
                onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                placeholder="Naam"
                className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg"
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

      {careers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Nog geen beroepen toegevoegd.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Icoon</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Naam</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Beschrijving</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {careers.map((career) => (
                <tr key={career.id} className="hover:bg-gray-50">
                  {editingId === career.id ? (
                    <>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={editForm.icon}
                          onChange={e => setEditForm({ ...editForm, icon: e.target.value })}
                          placeholder="👤"
                          className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                      </td>
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
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                          placeholder="Beschrijving"
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
                        <span className="text-xl">{career.icon || '👤'}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{career.name}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm max-w-md truncate">{career.description || '-'}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => startEdit(career)}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Bewerken
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(career.id)}
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
