'use client'

import Image from 'next/image'

type ImageOrientation = 'landscape' | 'portrait' | 'square' | null

interface AdaptiveDirectionImageProps {
  src: string
  alt: string
  orientation: ImageOrientation
  color?: string
  className?: string
  priority?: boolean
  children?: React.ReactNode // Optional content to display alongside portrait/square images
}

export function AdaptiveDirectionImage({
  src,
  alt,
  orientation,
  color = '#003c46',
  className = '',
  priority = false,
  children,
}: AdaptiveDirectionImageProps) {
  // Default to landscape if no orientation specified
  const effectiveOrientation = orientation || 'landscape'

  // For landscape: full width image
  if (effectiveOrientation === 'landscape') {
    return (
      <div className={`w-full ${className}`}>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            priority={priority}
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
        {children}
      </div>
    )
  }

  // For portrait/square: side-by-side layout on desktop, stacked on mobile
  const imageContainerClasses = {
    portrait: 'relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg',
    square: 'relative aspect-square rounded-xl overflow-hidden shadow-lg',
  }

  const imageSizeClasses = {
    portrait: 'w-full max-w-[280px] md:max-w-[320px]',
    square: 'w-[180px] md:w-[220px]',
  }

  return (
    <div className={`flex flex-col md:flex-row md:items-start gap-4 md:gap-6 ${className}`}>
      {/* Image - on mobile: centered above content, on desktop: right side */}
      <div className={`mx-auto md:mx-0 md:order-2 md:flex-shrink-0 ${imageSizeClasses[effectiveOrientation]}`}>
        <div
          className={imageContainerClasses[effectiveOrientation]}
          style={{ boxShadow: `0 4px 20px ${color}20` }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            priority={priority}
            sizes={effectiveOrientation === 'portrait' ? '320px' : '220px'}
          />
        </div>
      </div>
      {/* Content - on mobile: below image, on desktop: left side */}
      {children && (
        <div className="md:order-1 md:flex-1">
          {children}
        </div>
      )}
    </div>
  )
}
