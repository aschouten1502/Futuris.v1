'use client'

import { useState } from 'react'
import type { Subject } from '@/lib/types'

interface SubjectChipProps {
  subject: Subject
  color?: string
}

export function SubjectChip({ subject, color = '#003c46' }: SubjectChipProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
      >
        <span>{subject.icon || '📖'}</span>
        <span className="text-text-muted">{subject.name}</span>
      </button>

      {/* Popup overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="p-4 rounded-t-2xl flex items-center gap-3"
              style={{ backgroundColor: `${color}10` }}
            >
              <span className="text-3xl">{subject.icon || '📖'}</span>
              <h3 className="font-bold text-text text-lg">{subject.name}</h3>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto p-1 hover:bg-black/10 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {subject.description && (
                <p className="text-sm text-text-muted">{subject.description}</p>
              )}

              {subject.learning_goals && (
                <div>
                  <p className="text-xs font-medium text-text mb-1">Leerdoelen</p>
                  <p className="text-sm text-text-muted">{subject.learning_goals}</p>
                </div>
              )}

              {subject.topics && (
                <div>
                  <p className="text-xs font-medium text-text mb-1">Onderwerpen</p>
                  <p className="text-sm text-text-muted">{subject.topics}</p>
                </div>
              )}

              {!subject.description && !subject.learning_goals && !subject.topics && (
                <p className="text-sm text-text-muted italic">Geen extra informatie beschikbaar.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
