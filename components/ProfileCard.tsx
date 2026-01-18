import Link from 'next/link'
import type { Profile } from '@/lib/types'

interface ProfileCardProps {
  profile: Profile
  levelSlug: string
}

export function ProfileCard({ profile, levelSlug }: ProfileCardProps) {
  return (
    <Link
      href={`/niveau/${levelSlug}/${profile.slug}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ backgroundColor: profile.color }}
        >
          {profile.short_name}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{profile.name}</h3>
          {profile.description && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
              {profile.description}
            </p>
          )}
        </div>
        <svg
          className="w-5 h-5 text-gray-400 shrink-0"
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
    </Link>
  )
}
