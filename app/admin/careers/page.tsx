'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Career } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'
import { UndoToast } from '@/components/ui/UndoToast'
import { EmojiPicker } from '@/components/admin/shared/EmojiPicker'

interface UndoState {
  type: 'delete' | 'edit'
  item: Career
  previousData?: Partial<Career>
}

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
  const [previewKey, setPreviewKey] = useState(() => Date.now())
  const [undoState, setUndoState] = useState<UndoState | null>(null)
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

  const refreshPreview = () => {
    setPreviewKey(Date.now())
  }

  useEffect(() => {
    fetchCareers()
  }, [])

  // Listen for click events from the preview iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'edit-career') {
        const career = careers.find(c => c.id === event.data.id)
        if (career) setEditingCareer(career)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [careers])

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
      refreshPreview()
    }
  }

  const handleUpdate = async (data: Partial<Career>) => {
    if (!editingCareer || !data.name?.trim()) {
      showToast('Vul een naam in', 'error')
      return
    }

    // Store previous data for undo
    const previousData: Partial<Career> = {
      name: editingCareer.name,
      description: editingCareer.description,
      icon: editingCareer.icon,
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
      setUndoState({ type: 'edit', item: editingCareer, previousData })
      setEditingCareer(null)
      fetchCareers()
      refreshPreview()
    }
  }

  const handleDelete = async (id: string) => {
    const careerToDelete = careers.find(c => c.id === id)
    if (!careerToDelete) return

    const { error } = await supabase.from('careers').delete().eq('id', id)

    if (error) {
      showToast('Fout bij verwijderen', 'error')
    } else {
      setUndoState({ type: 'delete', item: careerToDelete })
      fetchCareers()
      refreshPreview()
    }
  }

  const handleUndo = useCallback(async () => {
    if (!undoState) return

    if (undoState.type === 'delete') {
      const { error } = await supabase.from('careers').insert({
        id: undoState.item.id,
        name: undoState.item.name,
        description: undoState.item.description,
        icon: undoState.item.icon,
        order: undoState.item.order,
        created_at: undoState.item.created_at,
        updated_at: undoState.item.updated_at,
      })

      if (error) {
        showToast('Fout bij herstellen', 'error')
      } else {
        showToast('Beroep hersteld', 'success')
        fetchCareers()
        refreshPreview()
      }
    } else if (undoState.type === 'edit' && undoState.previousData) {
      const { error } = await supabase
        .from('careers')
        .update({
          ...undoState.previousData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', undoState.item.id)

      if (error) {
        showToast('Fout bij herstellen', 'error')
      } else {
        showToast('Wijziging ongedaan gemaakt', 'success')
        fetchCareers()
        refreshPreview()
      }
    }

    setUndoState(null)
  }, [undoState, supabase, showToast])

  if (loading) return <div className="text-gray-500">Laden...</div>

  return (
    <div className="flex gap-6">
      {/* Left side - Career list */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
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
          <div className="grid gap-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {careers.map((career) => (
              <div
                key={career.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{career.icon || '👤'}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{career.name}</h3>
                    {career.description && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{career.description}</p>
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
                src={`/beroepen?_t=${previewKey}`}
                title="Preview Beroepen"
                className="w-full h-full border-0"
                style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', height: '182%' }}
              />
            </div>
          </div>
        </div>
      </div>

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
