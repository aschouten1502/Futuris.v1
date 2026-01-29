interface UShapeProps {
  color?: string
  rotation?: 0 | 90 | 180 | 270
  size?: 'sm' | 'md' | 'lg' | 'xl'
  opacity?: number
  variant?: 'solid' | 'outline'
  className?: string
}

const sizeMap = {
  sm: 48,
  md: 80,
  lg: 120,
  xl: 200,
}

export default function UShape({
  color = '#003C46',
  rotation = 0,
  size = 'md',
  opacity = 1,
  variant = 'solid',
  className = '',
}: UShapeProps) {
  const px = sizeMap[size]

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity, transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      {variant === 'solid' ? (
        <path
          d="M20 0 L20 60 Q20 100 50 100 Q80 100 80 60 L80 0 L60 0 L60 60 Q60 80 50 80 Q40 80 40 60 L40 0 Z"
          fill={color}
        />
      ) : (
        <path
          d="M20 0 L20 60 Q20 100 50 100 Q80 100 80 60 L80 0 L60 0 L60 60 Q60 80 50 80 Q40 80 40 60 L40 0 Z"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      )}
    </svg>
  )
}
