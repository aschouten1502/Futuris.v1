'use client'

import type { DirectionTrait } from '@/lib/types'

interface TraitsModuleProps {
  traits: DirectionTrait[]
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (index: number, trait: string) => void
}

export function TraitsModule({ traits, onAdd, onRemove, onUpdate }: TraitsModuleProps) {
  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {traits.map((trait, index) => (
          <div key={trait.id} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
            <input
              type="text"
              value={trait.trait}
              onChange={e => onUpdate(index, e.target.value)}
              placeholder="Eigenschap"
              className="bg-transparent border-none text-sm focus:outline-none w-24"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {traits.length === 0 && (
        <p className="text-gray-500 text-sm">Nog geen eigenschappen toegevoegd.</p>
      )}
      <button
        type="button"
        onClick={onAdd}
        className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-3"
      >
        + Toevoegen
      </button>
    </div>
  )
}
