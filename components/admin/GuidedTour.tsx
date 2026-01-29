'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

export interface TourStep {
  target: string // CSS selector or ref key
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

interface GuidedTourProps {
  steps: TourStep[]
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

export function GuidedTour({ steps, isOpen, onClose, onComplete }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [mounted, setMounted] = useState(false)

  // Wait for client-side mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Find and highlight the target element
  const updateTarget = useCallback(() => {
    if (!isOpen || !steps[currentStep]) return

    const step = steps[currentStep]
    const element = document.querySelector(step.target) as HTMLElement

    if (element) {
      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })

      // Wait for scroll to complete, then get position
      setTimeout(() => {
        const rect = element.getBoundingClientRect()
        setTargetRect(rect)
      }, 300)
    } else {
      setTargetRect(null)
    }
  }, [isOpen, currentStep, steps])

  useEffect(() => {
    updateTarget()

    // Update on resize/scroll
    const handleUpdate = () => updateTarget()
    window.addEventListener('resize', handleUpdate)
    window.addEventListener('scroll', handleUpdate, true)

    return () => {
      window.removeEventListener('resize', handleUpdate)
      window.removeEventListener('scroll', handleUpdate, true)
    }
  }, [updateTarget])

  // Reset step when tour opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
    }
  }, [isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentStep, onClose])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Tour complete
      onComplete?.()
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!mounted || !isOpen) return null

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    }

    const padding = 16
    const tooltipWidth = 320
    const tooltipHeight = 180 // Approximate

    const position = step.position || 'bottom'

    switch (position) {
      case 'top':
        return {
          bottom: window.innerHeight - targetRect.top + padding,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)',
        }
      case 'bottom':
        return {
          top: targetRect.bottom + padding,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)',
        }
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2,
          right: window.innerWidth - targetRect.left + padding,
          transform: 'translateY(-50%)',
        }
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.right + padding,
          transform: 'translateY(-50%)',
        }
      default:
        return {
          top: targetRect.bottom + padding,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)',
        }
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Dark overlay with cutout for target */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="tour-mask">
            {/* White = visible, black = hidden */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#tour-mask)"
        />
      </svg>

      {/* Highlight border around target */}
      {targetRect && (
        <div
          className="absolute border-2 border-primary-400 rounded-xl pointer-events-none animate-pulse"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 4px rgba(0, 124, 137, 0.3), 0 0 20px rgba(0, 124, 137, 0.4)',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute bg-white rounded-xl shadow-2xl p-5 w-80 max-w-[90vw]"
        style={getTooltipStyle()}
      >
        {/* Step indicator */}
        <div className="flex items-center gap-1.5 mb-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStep
                  ? 'w-6 bg-primary-500'
                  : i < currentStep
                  ? 'w-1.5 bg-primary-300'
                  : 'w-1.5 bg-gray-200'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-auto">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{step.description}</p>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-700 transition-colors"
          >
            Sluiten
          </button>
          <div className="flex-1" />
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Vorige
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            {isLastStep ? 'Afronden' : 'Volgende'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
