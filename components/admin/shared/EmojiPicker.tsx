'use client'

import { useState, useRef, useEffect } from 'react'

const emojiCategories = [
  {
    label: 'School',
    emojis: ['📚', '📖', '✏️', '🎓', '🏫', '📝', '📐', '🔬', '🧪', '🧮', '🗂️', '📊', '📋', '🎒', '🖊️', '📏'],
  },
  {
    label: 'Beroepen',
    emojis: ['👨‍⚕️', '👩‍🍳', '👨‍💻', '👩‍🎨', '👨‍🔧', '👩‍🏫', '👨‍🔬', '👩‍⚖️', '👨‍🚒', '👩‍✈️', '👤', '👥', '🧑‍💼', '🧑‍🔧', '🧑‍🎤', '🧑‍⚕️'],
  },
  {
    label: 'Activiteiten',
    emojis: ['🎯', '💡', '🎨', '🎵', '⚽', '🏃', '💪', '🧠', '🤝', '🌟', '✨', '🔥', '💼', '🛠️', '🔧', '⚙️'],
  },
  {
    label: 'Natuur & Gezondheid',
    emojis: ['🌱', '🌍', '💚', '❤️', '🏥', '💊', '🩺', '🧬', '🌿', '🐾', '🌳', '🌊', '☀️', '🌈', '🍎', '🥗'],
  },
  {
    label: 'Tech & Media',
    emojis: ['💻', '📱', '🖥️', '🎮', '📷', '🎬', '🎤', '📡', '🤖', '🔌', '💾', '🌐', '📺', '🎧', '🖨️', '⌨️'],
  },
  {
    label: 'Horeca & Eten',
    emojis: ['🍽️', '🍕', '🍰', '☕', '🍳', '🥘', '🏨', '🍷', '🧁', '🥂', '🍴', '👨‍🍳', '🎂', '🍹', '🥄', '🫕'],
  },
  {
    label: 'Symbolen',
    emojis: ['✅', '✓', '⭐', '💎', '🏆', '📌', '🔑', '💬', '📣', '🔔', '❗', '❓', '➡️', '⬆️', '🔄', '✳️'],
  },
]

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
  className?: string
}

export function EmojiPicker({ value, onChange, className = '' }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg text-center text-2xl hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
      >
        {value || <span className="text-gray-400 text-sm">Kies</span>}
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg w-72">
          {/* Category tabs */}
          <div className="flex gap-1 p-2 border-b border-gray-100 overflow-x-auto">
            {emojiCategories.map((cat, i) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActiveCategory(i)}
                className={`px-2 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                  activeCategory === i
                    ? 'bg-futuris-teal/10 text-futuris-teal font-medium'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Emoji grid */}
          <div className="p-2 grid grid-cols-8 gap-1 max-h-40 overflow-y-auto">
            {emojiCategories[activeCategory].emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onChange(emoji)
                  setIsOpen(false)
                }}
                className={`w-8 h-8 flex items-center justify-center text-lg rounded hover:bg-gray-100 transition-colors ${
                  value === emoji ? 'bg-futuris-teal/10 ring-1 ring-futuris-teal' : ''
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Manual input + clear */}
          <div className="p-2 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder="Of typ zelf..."
              className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
            />
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('')
                  setIsOpen(false)
                }}
                className="px-2 py-1 text-xs text-red-500 hover:text-red-700"
              >
                Wissen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
