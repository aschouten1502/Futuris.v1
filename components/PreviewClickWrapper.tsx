'use client'

interface PreviewClickWrapperProps {
  type: 'subject' | 'dp-module' | 'career' | 'education'
  id: string
  children: React.ReactNode
  className?: string
}

export function PreviewClickWrapper({ type, id, children, className = '' }: PreviewClickWrapperProps) {
  const handleClick = () => {
    // Only send postMessage if we're inside an iframe (admin preview)
    if (window.parent !== window) {
      window.parent.postMessage({ type: `edit-${type}`, id }, '*')
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer hover:ring-2 hover:ring-primary-400 hover:ring-offset-2 rounded-xl transition-all ${className}`}
    >
      {children}
    </div>
  )
}
