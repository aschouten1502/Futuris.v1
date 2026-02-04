'use client'

import { useEffect, useState, useCallback } from 'react'

interface UndoToastProps {
  message: string
  onUndo: () => void
  onDismiss: () => void
  duration?: number // milliseconds
}

export function UndoToast({ message, onUndo, onDismiss, duration = 5000 }: UndoToastProps) {
  const [progress, setProgress] = useState(100)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const startTime = Date.now()
    const endTime = startTime + (duration * progress / 100)

    const interval = setInterval(() => {
      const now = Date.now()
      const remaining = endTime - now
      const newProgress = (remaining / duration) * 100

      if (newProgress <= 0) {
        clearInterval(interval)
        onDismiss()
      } else {
        setProgress(newProgress)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isPaused, duration, onDismiss, progress])

  const handleUndo = useCallback(() => {
    onUndo()
  }, [onUndo])

  return (
    <div
      className="fixed bottom-4 right-4 z-50 animate-slide-up"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="bg-gray-900 text-white rounded-xl shadow-lg overflow-hidden min-w-[320px]">
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium">{message}</span>
          </div>
          <button
            type="button"
            onClick={handleUndo}
            className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Ongedaan maken
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-white/20">
          <div
            className="h-full bg-primary-400 transition-all duration-50"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// Hook for managing undo state
interface UndoState<T> {
  type: 'delete' | 'edit'
  item: T
  previousData?: Partial<T>
}

export function useUndo<T extends { id: string }>() {
  const [undoState, setUndoState] = useState<UndoState<T> | null>(null)

  const setDeleteUndo = useCallback((item: T) => {
    setUndoState({ type: 'delete', item })
  }, [])

  const setEditUndo = useCallback((item: T, previousData: Partial<T>) => {
    setUndoState({ type: 'edit', item, previousData })
  }, [])

  const clearUndo = useCallback(() => {
    setUndoState(null)
  }, [])

  return {
    undoState,
    setDeleteUndo,
    setEditUndo,
    clearUndo,
  }
}
