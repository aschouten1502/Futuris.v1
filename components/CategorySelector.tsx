'use client'

import { useState } from 'react'
import type { Direction } from '@/lib/types'
import { DirectionCard } from './DirectionCard'

interface CategorySelectorProps {
  dpDirections: Direction[]
  mavoDirections: Direction[]
}

export function CategorySelector({ dpDirections, mavoDirections }: CategorySelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<'dp' | 'mavo' | null>(null)

  const categories = [
    {
      id: 'dp' as const,
      title: 'D&P',
      subtitle: 'Dienstverlening & Producten',
      description: 'Praktijkgerichte richtingen met stage en beroepsvoorbereiding',
      color: '#003C46', // futuris-teal
      bgColor: 'bg-futuris-teal/5',
      borderColor: 'border-futuris-teal/20',
      hoverBorder: 'hover:border-futuris-teal/50',
      icon: '🎯',
      directions: dpDirections,
      count: dpDirections.length,
    },
    {
      id: 'mavo' as const,
      title: 'Mavo',
      subtitle: 'Theoretische leerweg',
      description: 'Routes richting MBO of doorstroom naar HAVO',
      color: '#7C5CBF', // purple/lavender
      bgColor: 'bg-surface-lavender/30',
      borderColor: 'border-surface-lavender/40',
      hoverBorder: 'hover:border-surface-lavender',
      icon: '📚',
      directions: mavoDirections,
      count: mavoDirections.length,
    },
  ]

  const selectedCat = categories.find(c => c.id === selectedCategory)

  return (
    <div>
      {/* Category Cards - Side by Side */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id
          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
              className={`
                relative text-left p-4 rounded-2xl border-2 transition-all duration-300
                ${isSelected
                  ? 'border-current shadow-lg scale-[1.02]'
                  : `${cat.borderColor} ${cat.hoverBorder} hover:shadow-md`
                }
                ${cat.bgColor}
              `}
              style={isSelected ? { borderColor: cat.color } : undefined}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm z-10"
                  style={{ backgroundColor: cat.color }}
                >
                  ✓
                </div>
              )}

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                style={{ backgroundColor: `${cat.color}15` }}
              >
                {cat.icon}
              </div>

              {/* Title */}
              <h3
                className="font-bold text-lg mb-1"
                style={{ color: cat.color }}
              >
                {cat.title}
              </h3>

              {/* Subtitle */}
              <p className="text-xs text-text-muted mb-2 line-clamp-1">
                {cat.subtitle}
              </p>

              {/* Count badge */}
              <span
                className="inline-block px-2 py-0.5 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: cat.color }}
              >
                {cat.count} {cat.count === 1 ? 'richting' : 'richtingen'}
              </span>
            </button>
          )
        })}
      </div>

      {/* Selected Category Directions */}
      {selectedCategory && selectedCat && (
        <section className="animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: selectedCat.color }}
            />
            <h2 className="text-lg font-bold text-text">
              {selectedCat.title} Richtingen
            </h2>
          </div>
          <p className="text-text-muted text-sm mb-4">
            {selectedCat.description}
          </p>
          <div className="space-y-3">
            {selectedCat.directions.map((direction) => (
              <DirectionCard key={direction.id} direction={direction} />
            ))}
          </div>
        </section>
      )}

      {/* Prompt to select */}
      {!selectedCategory && (
        <div className="text-center py-8 text-text-muted">
          <p className="text-sm">Kies hierboven een categorie om de richtingen te bekijken</p>
        </div>
      )}
    </div>
  )
}
