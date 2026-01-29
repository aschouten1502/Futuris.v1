'use client'

import { useEffect } from 'react'
import PublicLayout from '@/components/PublicLayout'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <PublicLayout>
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-futuris-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-futuris-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-text mb-2">
          Er ging iets mis
        </h2>
        <p className="text-text-muted mb-6">
          We konden de gegevens niet laden. Probeer het opnieuw.
        </p>
        <button
          onClick={reset}
          className="btn-pill-teal"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Opnieuw proberen
        </button>
      </div>
    </PublicLayout>
  )
}
