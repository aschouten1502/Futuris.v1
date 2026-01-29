'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Career } from '@/lib/types'

interface CareersModuleProps {
  allCareers: Career[]
  linkedCareers: string[]
  onToggle: (careerId: string) => void
  onRefresh: () => void
}

export function CareersModule({ allCareers, linkedCareers, onToggle, onRefresh }: CareersModuleProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const supabase = createClient()

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    const { error } = await supabase.from('careers').insert({
      name: newName.trim(),
      order: allCareers.length,
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
      <p className="text-sm text-gray-500 mb-3">Selecteer beroepen die bij deze richting horen.</p>
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {allCareers.map(career => (
          <label key={career.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={linkedCareers.includes(career.id)}
              onChange={() => onToggle(career.id)}
              className="rounded text-primary-600"
            />
            <span className="text-sm">{career.icon || '👤'} {career.name}</span>
          </label>
        ))}
      </div>

      {showCreate ? (
        <div className="flex items-center gap-2 mt-3 p-2 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Naam nieuw beroep"
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
          + Nieuw beroep aanmaken
        </button>
      )}
    </div>
  )
}
