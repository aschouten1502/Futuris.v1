'use client'

import type { Direction } from '@/lib/types'
import { EmojiPicker } from '@/components/admin/shared/EmojiPicker'
import { ImageUpload } from '@/components/ImageUpload'

interface DirectionBasicInfoProps {
  direction: Direction
  onChange: (updates: Partial<Direction>) => void
}

export function DirectionBasicInfo({ direction, onChange }: DirectionBasicInfoProps) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Algemene informatie</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
            <input
              type="text"
              value={direction.name}
              onChange={e => onChange({ name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={direction.slug}
              onChange={e => onChange({ slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Korte beschrijving</label>
          <input
            type="text"
            value={direction.short_description || ''}
            onChange={e => onChange({ short_description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Uitgebreide beschrijving</label>
          <textarea
            value={direction.full_description || ''}
            onChange={e => onChange({ full_description: e.target.value })}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Afbeelding
            <span className="font-normal text-gray-500 ml-1">(optioneel)</span>
          </label>
          <ImageUpload
            value={direction.image_url}
            onChange={(url) => onChange({ image_url: url })}
            onOrientationDetect={(orientation) => onChange({ image_orientation: orientation })}
            folder="directions"
            aspectRatio="landscape"
          />
          {direction.image_orientation && (
            <p className="mt-2 text-xs text-gray-500">
              Gedetecteerde oriëntatie: <span className="font-medium">{direction.image_orientation}</span>
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kleur</label>
            <input
              type="color"
              value={direction.color}
              onChange={e => onChange({ color: e.target.value })}
              className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icoon</label>
            <EmojiPicker
              value={direction.icon || ''}
              onChange={emoji => onChange({ icon: emoji })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Intro tekst beroepen/opleidingen
            <span className="font-normal text-gray-500 ml-1">(optioneel, voor D&P sectie)</span>
          </label>
          <textarea
            value={direction.careers_intro || ''}
            onChange={e => onChange({ careers_intro: e.target.value || null })}
            rows={3}
            placeholder="Bijv: Je kunt kiezen voor een vervolgopleiding die te maken heeft met..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Linkteksten sectie */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Linkteksten op richtingspagina</h3>
          <div className={`grid gap-4 ${direction.category === 'dp' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {direction.category === 'dp' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  D&P Modules linktekst
                </label>
                <input
                  type="text"
                  value={direction.dp_modules_link_text || ''}
                  onChange={e => onChange({ dp_modules_link_text: e.target.value || null })}
                  placeholder="Lees meer over de vier D&P modules"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keuzevakken linktekst
              </label>
              <input
                type="text"
                value={direction.keuzevakken_link_text || ''}
                onChange={e => onChange({ keuzevakken_link_text: e.target.value || null })}
                placeholder="Bekijk alle beschikbare keuzevakken"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
            <select
              value={direction.category || 'dp'}
              onChange={e => onChange({ category: e.target.value as 'dp' | 'mavo' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="dp">D&P Richting</option>
              <option value="mavo">Mavo Route</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={direction.is_active ? 'true' : 'false'}
              onChange={e => onChange({ is_active: e.target.value === 'true' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="true">Actief</option>
              <option value="false">Inactief</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  )
}
