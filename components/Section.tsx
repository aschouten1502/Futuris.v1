import { ReactNode } from 'react'

interface SectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function Section({ title, children, className = '' }: SectionProps) {
  return (
    <section className={`mb-10 ${className}`}>
      <div className="mb-5">
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </section>
  )
}
