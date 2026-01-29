'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Career } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'
import { EmojiPicker } from '@/components/admin/shared/EmojiPicker'

interface EditModalProps {
  career: Career | null
  isNew: boolean
  onClose: () => void
  onSave: (data: Partial<Career>) => void
}

function EditModal({ career, isNew, onClose, onSave }: EditModalProps) {
  const [form, setForm] = useState({
    name: career?.name || '',
    description: career?.description || '',
    icon: career?.icon || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isNew ? 'Nieuw beroep' : 'Beroep bewerken'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icoon</label>
              <EmojiPicker
                value={form.icon}
                onChange={emoji => setForm({ ...form, icon: emoji })}
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Naam *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Naam van het beroep"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Korte beschrijving van het beroep"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700"
            >
              {isNew ? 'Toevoegen' : 'Opslaan'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCareer, setEditingCareer] = useState<Career | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
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

  const handleCreate = async (data: Partial<Career>) => {
    if (!data.name?.trim()) {
      showToast('Vul een naam in', 'error')
      return
    }

    const { error } = await supabase.from('careers').insert({
      name: data.name,
      description: data.description || null,
      icon: data.icon || null,
      order: careers.length,
    })

    if (error) {
      showToast('Fout bij aanmaken', 'error')
    } else {
      showToast('Beroep aangemaakt', 'success')
      setShowNewModal(false)
      fetchCareers()
    }
  }

  const handleUpdate = async (data: Partial<Career>) => {
    if (!editingCareer || !data.name?.trim()) {
      showToast('Vul een naam in', 'error')
      return
    }

    const { error } = await supabase
      .from('careers')
      .update({
        name: data.name,
        description: data.description || null,
        icon: data.icon || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingCareer.id)

    if (error) {
      showToast('Fout bij opslaan', 'error')
    } else {
      showToast('Opgeslagen', 'success')
      setEditingCareer(null)
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
          onClick={() => setShowNewModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          + Nieuw beroep
        </button>
      </div>

      {careers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Nog geen beroepen toegevoegd.
        </div>
      ) : (
        <div className="grid gap-4">
          {careers.map((career) => (
            <div
              key={career.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{career.icon || '👤'}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{career.name}</h3>
                  {career.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{career.description}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingCareer(career)}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Bewerken
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(career.id)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingCareer && (
        <EditModal
          career={editingCareer}
          isNew={false}
          onClose={() => setEditingCareer(null)}
          onSave={handleUpdate}
        />
      )}

      {showNewModal && (
        <EditModal
          career={null}
          isNew={true}
          onClose={() => setShowNewModal(false)}
          onSave={handleCreate}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
