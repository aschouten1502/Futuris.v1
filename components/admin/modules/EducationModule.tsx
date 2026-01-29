'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { FurtherEducation } from '@/lib/types'

interface EducationModuleProps {
  allEducation: FurtherEducation[]
  linkedEducation: string[]
  onToggle: (educationId: string) => void
  onRefresh: () => void
}

export function EducationModule({ allEducation, linkedEducation, onToggle, onRefresh }: EducationModuleProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<'mbo' | 'hbo' | 'wo'>('mbo')
  const [creating, setCreating] = useState(false)
  const supabase = createClient()

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    const { error } = await supabase.from('further_education').insert({
      name: newName.trim(),
      type: newType,
      order: allEducation.length,
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
      <p className="text-sm text-gray-500 mb-3">Selecteer opleidingen die bij deze richting horen.</p>
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {allEducation.map(edu => (
          <label key={edu.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={linkedEducation.includes(edu.id)}
              onChange={() => onToggle(edu.id)}
              className="rounded text-primary-600"
            />
            <span className="text-sm">
              {edu.name}
              {edu.type && (
                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded uppercase font-medium ${
                  edu.type === 'wo' ? 'bg-purple-100 text-purple-700' :
                  edu.type === 'hbo' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {edu.type}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>

      {showCreate ? (
        <div className="flex items-center gap-2 mt-3 p-2 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Naam nieuwe opleiding"
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />
          <select
            value={newType}
            onChange={e => setNewType(e.target.value as 'mbo' | 'hbo' | 'wo')}
            className="px-2 py-1.5 border border-gray-300 rounded text-sm"
          >
            <option value="mbo">MBO</option>
            <option value="hbo">HBO</option>
            <option value="wo">WO</option>
          </select>
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
          + Nieuwe opleiding aanmaken
        </button>
      )}
    </div>
  )
}
