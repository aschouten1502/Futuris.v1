'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FurtherEducation } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'
import { UndoToast } from '@/components/ui/UndoToast'

interface UndoState {
  type: 'delete' | 'edit'
  item: FurtherEducation
  previousData?: Partial<FurtherEducation>
}

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
  const [previewKey, setPreviewKey] = useState(() => Date.now())
  const [undoState, setUndoState] = useState<UndoState | null>(null)
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

  const refreshPreview = () => {
    setPreviewKey(Date.now())
  }

  useEffect(() => {
    fetchEducation()
  }, [filter])

  // Listen for click events from the preview iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'edit-education') {
        const edu = education.find(e => e.id === event.data.id)
        if (edu) setEditingEducation(edu)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [education])

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
      refreshPreview()
    }
  }

  const handleUpdate = async (data: Partial<FurtherEducation>) => {
    if (!editingEducation || !data.name?.trim()) {
      showToast('Vul een naam in', 'error')
      return
    }

    // Store previous data for undo
    const previousData: Partial<FurtherEducation> = {
      name: editingEducation.name,
      type: editingEducation.type,
      description: editingEducation.description,
      institution: editingEducation.institution,
      url: editingEducation.url,
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
      setUndoState({ type: 'edit', item: editingEducation, previousData })
      setEditingEducation(null)
      fetchEducation()
      refreshPreview()
    }
  }

  const handleDelete = async (id: string) => {
    const educationToDelete = education.find(e => e.id === id)
    if (!educationToDelete) return

    const { error } = await supabase.from('further_education').delete().eq('id', id)

    if (error) {
      showToast('Fout bij verwijderen', 'error')
    } else {
      setUndoState({ type: 'delete', item: educationToDelete })
      fetchEducation()
      refreshPreview()
    }
  }

  const handleUndo = useCallback(async () => {
    if (!undoState) return

    if (undoState.type === 'delete') {
      const { error } = await supabase.from('further_education').insert({
        id: undoState.item.id,
        name: undoState.item.name,
        type: undoState.item.type,
        description: undoState.item.description,
        institution: undoState.item.institution,
        url: undoState.item.url,
        order: undoState.item.order,
        created_at: undoState.item.created_at,
        updated_at: undoState.item.updated_at,
      })

      if (error) {
        showToast('Fout bij herstellen', 'error')
      } else {
        showToast('Opleiding hersteld', 'success')
        fetchEducation()
        refreshPreview()
      }
    } else if (undoState.type === 'edit' && undoState.previousData) {
      const { error } = await supabase
        .from('further_education')
        .update({
          ...undoState.previousData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', undoState.item.id)

      if (error) {
        showToast('Fout bij herstellen', 'error')
      } else {
        showToast('Wijziging ongedaan gemaakt', 'success')
        fetchEducation()
        refreshPreview()
      }
    }

    setUndoState(null)
  }, [undoState, supabase, showToast])

  const typeColors: Record<string, string> = {
    mbo: 'bg-green-100 text-green-700',
    hbo: 'bg-blue-100 text-blue-700',
    wo: 'bg-purple-100 text-purple-700',
  }

  if (loading) return <div className="text-gray-500">Laden...</div>

  return (
    <div className="flex gap-6">
      {/* Left side - Education list */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
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
        <div className="mb-4">
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
          <div className="grid gap-3 max-h-[calc(100vh-260px)] overflow-y-auto pr-2">
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
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{edu.description}</p>
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
      </div>

      {/* Right side - Live Preview */}
      <div className="w-[380px] shrink-0">
        <div className="sticky top-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Preview header */}
            <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-medium">Live preview</span>
                <span className="text-gray-400 ml-1">• Klik om te bewerken</span>
              </div>
              <button
                type="button"
                onClick={refreshPreview}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Vernieuw
              </button>
            </div>
            {/* Preview iframe */}
            <div className="h-[600px] overflow-hidden">
              <iframe
                key={previewKey}
                src={`/opleidingen?_t=${previewKey}`}
                title="Preview Opleidingen"
                className="w-full h-full border-0"
                style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', height: '182%' }}
              />
            </div>
          </div>
        </div>
      </div>

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

      {/* Undo Toast */}
      {undoState && (
        <UndoToast
          message={undoState.type === 'delete' ? `"${undoState.item.name}" verwijderd` : `"${undoState.item.name}" bijgewerkt`}
          onUndo={handleUndo}
          onDismiss={() => setUndoState(null)}
        />
      )}
    </div>
  )
}
