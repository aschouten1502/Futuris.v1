import Link from 'next/link'
import type { Direction } from '@/lib/types'

interface DirectionCardProps {
  direction: Direction
}

export function DirectionCard({ direction }: DirectionCardProps) {
  return (
    <Link
      href={`/richting/${direction.slug}`}
      className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden"
    >
      {/* Colored top bar */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: direction.color }}
      />

      <div className="p-5">
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
            <h2 className="font-semibold text-lg text-text group-hover:text-futuris-teal transition-colors">
              {direction.name}
            </h2>
            {direction.short_description && (
              <p className="text-text-muted text-sm mt-1 line-clamp-2">
                {direction.short_description}
              </p>
            )}
          </div>

          {/* Arrow */}
          <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-futuris-teal group-hover:text-white transition-all">
            <svg
              className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
