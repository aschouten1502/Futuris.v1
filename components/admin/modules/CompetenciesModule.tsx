'use client'

import type { DirectionCompetency } from '@/lib/types'
import { EmojiPicker } from '@/components/admin/shared/EmojiPicker'

interface CompetenciesModuleProps {
  competencies: DirectionCompetency[]
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (index: number, updates: Partial<DirectionCompetency>) => void
}

export function CompetenciesModule({ competencies, onAdd, onRemove, onUpdate }: CompetenciesModuleProps) {
  return (
    <div className="space-y-3 mt-3">
      {competencies.map((comp, index) => (
        <div key={comp.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <EmojiPicker
            value={comp.icon || ''}
            onChange={emoji => onUpdate(index, { icon: emoji })}
            className="w-12"
          />
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={comp.title}
              onChange={e => onUpdate(index, { title: e.target.value })}
              placeholder="Titel"
              className="w-full px-3 py-1.5 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={comp.description || ''}
              onChange={e => onUpdate(index, { description: e.target.value })}
              placeholder="Beschrijving (optioneel)"
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            ✕
          </button>
        </div>
      ))}
      {competencies.length === 0 && (
        <p className="text-gray-500 text-sm">Nog geen competenties toegevoegd.</p>
      )}
      <button
        type="button"
        onClick={onAdd}
        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
      >
        + Toevoegen
      </button>
    </div>
  )
}
