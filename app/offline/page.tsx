import PublicLayout from '@/components/PublicLayout'

export default function OfflinePage() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="w-20 h-20 bg-futuris-teal/10 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-futuris-teal"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text mb-2">Geen internetverbinding</h1>
        <p className="text-text-muted mb-6 max-w-sm">
          Je bent momenteel offline. Controleer je internetverbinding en probeer het opnieuw.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-futuris-teal text-white px-6 py-2 rounded-lg font-medium hover:bg-futuris-teal/90 transition-colors"
        >
          Opnieuw proberen
        </button>
      </div>
    </PublicLayout>
  )
}
