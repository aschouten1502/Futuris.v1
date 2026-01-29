'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FurtherEducation } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'

interface EditModalProps {
  education: FurtherEducation | null
  isNew: boolean
  onClose: () => void
  onSave: (data: Partial<FurtherEducation>) => void
}

function EditModal({ education, isNew, onClose, onSave }: EditModalProps) {
  const [form, setForm] = useState({
    name: education?.name || '',
    type: (education?.type as 'mbo' | 'hbo' | 'wo') || 'mbo',
    description: education?.description || '',
    institution: education?.institution || '',
    url: education?.url || '',
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
            {isNew ? 'Nieuwe opleiding' : 'Opleiding bewerken'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Naam *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Naam van de opleiding"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="edu-type" className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                id="edu-type"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value as 'mbo' | 'hbo' | 'wo' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="mbo">MBO</option>
                <option value="hbo">HBO</option>
                <option value="wo">WO</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instelling</label>
            <input
              type="text"
              value={form.institution}
              onChange={e => setForm({ ...form, institution: e.target.value })}
              placeholder="Bijv. ROC Midden Nederland"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Korte beschrijving van de opleiding"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
            <input
              type="text"
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
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

export default function EducationPage() {
  const [education, setEducation] = useState<FurtherEducation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [editingEducation, setEditingEducation] = useState<FurtherEducation | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
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

  const handleCreate = async (data: Partial<FurtherEducation>) => {
    if (!data.name?.trim()) {
      showToast('Vul een naam in', 'error')
      return
    }

    const { error } = await supabase.from('further_education').insert({
      name: data.name,
      type: data.type || 'mbo',
      description: data.description || null,
      institution: data.institution || null,
      url: data.url || null,
      order: education.length,
    })

    if (error) {
      showToast('Fout bij aanmaken', 'error')
    } else {
      showToast('Opleiding aangemaakt', 'success')
      setShowNewModal(false)
      fetchEducation()
    }
  }

  const handleUpdate = async (data: Partial<FurtherEducation>) => {
    if (!editingEducation || !data.name?.trim()) {
      showToast('Vul een naam in', 'error')
      return
    }

    const { error } = await supabase
      .from('further_education')
      .update({
        name: data.name,
        type: data.type || 'mbo',
        description: data.description || null,
        institution: data.institution || null,
        url: data.url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingEducation.id)

    if (error) {
      showToast('Fout bij opslaan', 'error')
    } else {
      showToast('Opgeslagen', 'success')
      setEditingEducation(null)
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

  const typeColors: Record<string, string> = {
    mbo: 'bg-green-100 text-green-700',
    hbo: 'bg-blue-100 text-blue-700',
    wo: 'bg-purple-100 text-purple-700',
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
          onClick={() => setShowNewModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          + Nieuwe opleiding
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <label htmlFor="edu-filter" className="sr-only">Filter op type</label>
        <select
          id="edu-filter"
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
        <div className="grid gap-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{edu.name}</h3>
                    {edu.type && (
                      <span className={`text-xs px-2 py-0.5 rounded uppercase font-medium ${typeColors[edu.type] || ''}`}>
                        {edu.type.toUpperCase()}
                      </span>
                    )}
                  </div>
                  {edu.institution && (
                    <p className="text-sm text-gray-500 mt-0.5">{edu.institution}</p>
                  )}
                  {edu.description && (
                    <p className="text-sm text-gray-500 mt-1">{edu.description}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingEducation(edu)}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Bewerken
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(edu.id)}
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

      {editingEducation && (
        <EditModal
          education={editingEducation}
          isNew={false}
          onClose={() => setEditingEducation(null)}
          onSave={handleUpdate}
        />
      )}

      {showNewModal && (
        <EditModal
          education={null}
          isNew={true}
          onClose={() => setShowNewModal(false)}
          onSave={handleCreate}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
