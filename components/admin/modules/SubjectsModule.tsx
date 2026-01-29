'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Subject } from '@/lib/types'

interface LinkedSubject {
  subject_id: string
  type: 'required' | 'optional' | null
  is_fitting: boolean
}

interface SubjectsModuleProps {
  allSubjects: Subject[]
  linkedSubjects: LinkedSubject[]
  onToggle: (subjectId: string, type: 'required' | 'optional' | null) => void
  onToggleFitting: (subjectId: string) => void
  onRefresh: () => void
}

export function SubjectsModule({ allSubjects, linkedSubjects, onToggle, onToggleFitting, onRefresh }: SubjectsModuleProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const supabase = createClient()

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    const { error } = await supabase.from('subjects').insert({
      name: newName.trim(),
      order: allSubjects.length,
    })
    if (!error) {
      setNewName('')
      setShowCreate(false)
      onRefresh()
    }
    setCreating(false)
  }

  return (
    <div className="mt-3">
      <p className="text-sm text-gray-500 mb-3">Selecteer vakken, geef aan of ze verplicht of keuze zijn, en markeer passende vakken.</p>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {allSubjects.map(subject => {
          const linked = linkedSubjects.find(s => s.subject_id === subject.id)
          return (
            <div key={subject.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center gap-2 min-w-0">
                <span>{subject.icon || '📖'}</span>
                <span className="text-sm truncate">{subject.name}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onToggleFitting(subject.id)}
                  className={`px-2 py-1 text-xs rounded ${linked?.is_fitting ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  Passend
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(subject.id, linked?.type === 'required' ? null : 'required')}
                  className={`px-2 py-1 text-xs rounded ${linked?.type === 'required' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  Verplicht
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(subject.id, linked?.type === 'optional' ? null : 'optional')}
                  className={`px-2 py-1 text-xs rounded ${linked?.type === 'optional' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  Keuze
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showCreate ? (
        <div className="flex items-center gap-2 mt-3 p-2 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Naam nieuw vak"
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating}
            className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 disabled:opacity-50"
          >
            Toevoegen
          </button>
          <button
            type="button"
            onClick={() => { setShowCreate(false); setNewName('') }}
            className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            Annuleren
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-3"
        >
          + Nieuw vak aanmaken
        </button>
      )}
    </div>
  )
}
