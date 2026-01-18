import Link from 'next/link'
import PublicLayout from '@/components/PublicLayout'

export default function OudersPage() {
  return (
    <PublicLayout>
      <Link
        href="/"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Terug naar overzicht
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Informatie voor ouders
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Hier vindt u binnenkort informatie speciaal voor ouders en verzorgers.
        </p>
      </div>

      {/* Placeholder content */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Pagina in ontwikkeling
        </h2>
        <p className="text-gray-600 text-sm">
          Deze pagina wordt binnenkort aangevuld met informatie over ouderavonden,
          voorlichtingsbijeenkomsten en veelgestelde vragen.
        </p>
      </div>

      {/* Future sections preview */}
      <div className="mt-8 space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-700 mb-1">Voorlichtingsavonden</h3>
          <p className="text-sm text-gray-500">Data en tijden worden binnenkort toegevoegd.</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-700 mb-1">Veelgestelde vragen</h3>
          <p className="text-sm text-gray-500">FAQ sectie wordt binnenkort toegevoegd.</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-700 mb-1">Contact</h3>
          <p className="text-sm text-gray-500">Contactgegevens worden binnenkort toegevoegd.</p>
        </div>
      </div>
    </PublicLayout>
  )
}
