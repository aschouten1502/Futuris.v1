import Link from 'next/link'
import type { Level } from '@/lib/types'

interface LevelCardProps {
  level: Level
}

export function LevelCard({ level }: LevelCardProps) {
  return (
    <Link
      href={`/niveau/${level.slug}`}
      className="group block card-interactive p-0 overflow-hidden"
    >
      {/* Teal accent bar */}
      <div className="h-1.5 bg-futuris-teal" />

      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text group-hover:text-futuris-teal transition-colors">
              {level.name}
            </h2>
            <p className="text-text-muted mt-1">{level.years} jaar</p>
          </div>
          <div className="w-12 h-12 bg-futuris-teal rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <svg
              className="w-6 h-6 text-white group-hover:translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
        {level.description && (
          <p className="text-text-muted mt-3 text-sm">{level.description}</p>
        )}
      </div>
    </Link>
  )
}
