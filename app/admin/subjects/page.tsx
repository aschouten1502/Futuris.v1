'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Subject } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'
import { EmojiPicker } from '@/components/admin/shared/EmojiPicker'

interface EditModalProps {
  subject: Subject | null
  isNew: boolean
  onClose: () => void
  onSave: (data: Partial<Subject>) => void
}

function EditModal({ subject, isNew, onClose, onSave }: EditModalProps) {
  const [form, setForm] = useState({
    name: subject?.name || '',
    description: subject?.description || '',
    icon: subject?.icon || '',
    learning_goals: subject?.learning_goals || '',
    topics: subject?.topics || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isNew ? 'Nieuw vak' : 'Vak bewerken'}
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
                placeholder="Naam van het vak"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Korte beschrijving</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Een korte beschrijving van het vak"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wat leer je bij dit vak?
            </label>
            <textarea
              value={form.learning_goals}
              onChange={e => setForm({ ...form, learning_goals: e.target.value })}
              placeholder="• Leerdoel 1&#10;• Leerdoel 2&#10;• Leerdoel 3"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Gebruik bullet points (•) voor een mooie lijst</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Onderwerpen die aan bod komen
            </label>
            <textarea
              value={form.topics}
              onChange={e => setForm({ ...form, topics: e.target.value })}
              placeholder="Onderwerp 1, Onderwerp 2, Onderwerp 3"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Komma-gescheiden of op aparte regels</p>
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

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const { toast, showToast, hideToast } = useToast()
  const supabase = createClient()

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
      showToast('Fout bij laden vakken', 'error')
    } else {
      setSubjects(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  const handleCreate = async (data: Partial<Subject>) => {
    if (!data.name?.trim()) {
      showToast('Vul een naam in', 'error')
      return
    }

    const { error } = await supabase.from('subjects').insert({
      name: data.name,
      description: data.description || null,
      icon: data.icon || null,
      learning_goals: data.learning_goals || null,
      topics: data.topics || null,
      order: subjects.length,
    })

    if (error) {
      showToast('Fout bij aanmaken', 'error')
    } else {
      showToast('Vak aangemaakt', 'success')
      setShowNewModal(false)
      fetchSubjects()
    }
  }

  const handleUpdate = async (data: Partial<Subject>) => {
    if (!editingSubject || !data.name?.trim()) {
      showToast('Vul een naam in', 'error')
      return
    }

    const { error } = await supabase
      .from('subjects')
      .update({
        name: data.name,
        description: data.description || null,
        icon: data.icon || null,
        learning_goals: data.learning_goals || null,
        topics: data.topics || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingSubject.id)

    if (error) {
      showToast('Fout bij opslaan', 'error')
    } else {
      showToast('Opgeslagen', 'success')
      setEditingSubject(null)
      fetchSubjects()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit vak wilt verwijderen?')) return

    const { error } = await supabase.from('subjects').delete().eq('id', id)

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
            Beheer alle vakken met leerdoelen en onderwerpen.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          + Nieuw vak
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Nog geen vakken aangemaakt.
        </div>
      ) : (
        <div className="grid gap-4">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{subject.icon || '📖'}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                  {subject.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{subject.description}</p>
                  )}

                  {subject.learning_goals && (
                    <div className="mt-3">
                      <span className="text-xs font-medium text-gray-500 uppercase">Wat leer je:</span>
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{subject.learning_goals}</p>
                    </div>
                  )}

                  {subject.topics && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-gray-500 uppercase">Onderwerpen:</span>
                      <p className="text-sm text-gray-700 mt-1">{subject.topics}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingSubject(subject)}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Bewerken
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(subject.id)}
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

      {/* Edit Modal */}
      {editingSubject && (
        <EditModal
          subject={editingSubject}
          isNew={false}
          onClose={() => setEditingSubject(null)}
          onSave={handleUpdate}
        />
      )}

      {/* New Modal */}
      {showNewModal && (
        <EditModal
          subject={null}
          isNew={true}
          onClose={() => setShowNewModal(false)}
          onSave={handleCreate}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
