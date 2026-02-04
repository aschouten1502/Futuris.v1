'use client'

import { useEffect, useState } from 'react'

export function PreviewNavigationBlocker() {
  const [isInPreview, setIsInPreview] = useState(false)

  useEffect(() => {
    // Check if we're inside an iframe (preview mode)
    const inIframe = window.parent !== window
    setIsInPreview(inIframe)

    if (!inIframe) return

    // Intercept all click events on anchor tags
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')

      if (anchor) {
        const href = anchor.getAttribute('href')
        // Allow external links (they open in new tab anyway)
        if (href?.startsWith('http') && anchor.target === '_blank') {
          return
        }
        // Block internal navigation
        if (href && !href.startsWith('#')) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  // Don't render anything if not in preview
  if (!isInPreview) return null

  return null
}
