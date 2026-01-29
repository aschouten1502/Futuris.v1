import Link from 'next/link'
import type { Direction } from '@/lib/types'

interface DirectionCardProps {
  direction: Direction
}

export function DirectionCard({ direction }: DirectionCardProps) {
  return (
    <Link
      href={`/richting/${direction.slug}`}
      className="group block bg-white rounded-2xl border border-surface-lavender/40 shadow-sm hover:shadow-lg hover:border-surface-lavender transition-all duration-300 overflow-hidden"
    >
      <div className="flex">
        {/* Colored side bar */}
        <div
          className="w-2.5 shrink-0 rounded-l-2xl"
          style={{ backgroundColor: direction.color }}
        />

        <div className="p-5 flex-1 min-w-0">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${direction.color}15` }}
            >
              {direction.icon || '📚'}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h2 className="font-medium text-lg text-text group-hover:text-futuris-teal transition-colors">
                {direction.name}
              </h2>
              {direction.short_description && (
                <p className="text-text-muted text-sm mt-1 line-clamp-2">
                  {direction.short_description}
                </p>
              )}
            </div>

            {/* Arrow — dual-layer hover for dynamic color */}
            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-surface-lavender/30 transition-opacity duration-300 group-hover:opacity-0" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: direction.color }}
              />
              <svg
                className="w-4 h-4 relative z-10 text-text-light group-hover:text-white transform group-hover:translate-x-0.5 transition-all duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
