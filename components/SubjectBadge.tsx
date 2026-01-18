interface SubjectBadgeProps {
  name: string
  type: 'required' | 'optional'
}

export function SubjectBadge({ name, type }: SubjectBadgeProps) {
  const baseClasses = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium'
  const typeClasses = type === 'required'
    ? 'bg-futuris-teal text-white shadow-sm'
    : 'bg-gray-100 text-text-muted border border-gray-200'

  return (
    <span className={`${baseClasses} ${typeClasses}`}>
      {type === 'required' && (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {name}
    </span>
  )
}
