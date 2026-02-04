import Link from 'next/link'
import { getDPModules } from '@/lib/data'
import PublicLayout from '@/components/PublicLayout'
import { PreviewClickWrapper } from '@/components/PreviewClickWrapper'
import { PreviewNavigationBlocker } from '@/components/PreviewNavigationBlocker'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'D&P Modules - Futuris',
  description: 'Informatie over de vier verplichte D&P modules bij Futuris SG',
}

export default async function DPModulesPage() {
  const modules = await getDPModules()

  return (
    <PublicLayout>
      <PreviewNavigationBlocker />
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-text-muted hover:text-futuris-teal transition-colors mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Terug naar overzicht
      </Link>

      {/* Header */}
      <div className="mb-8">
        <span className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-futuris-teal/10 text-futuris-teal rounded-full">
          D&P Modules
        </span>
        <h1 className="text-2xl font-bold text-text mb-3">
          De verplichte D&P modules
        </h1>
        <p className="text-text-muted text-base">
          Bij D&P werk je aan verplichte modules die je voorbereiden op je toekomst.
        </p>
      </div>

      {/* Intro box */}
      <div className="p-5 bg-surface-lavender-light rounded-2xl border border-surface-lavender/30 mb-8">
        <h3 className="font-bold text-futuris-teal mb-2">Wat is D&P?</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          D&P staat voor Dienstverlening en Producten. Dit is een praktijkgerichte leerweg
          waarbij je leert door te doen. Je werkt aan echte opdrachten en loopt stage
          bij bedrijven in de regio.
        </p>
      </div>

      {/* Modules */}
      {modules.length > 0 ? (
        <div className="space-y-4">
          {modules.map((module, index) => (
            <PreviewClickWrapper key={module.id} type="dp-module" id={module.id}>
              <div className="bg-white rounded-xl border border-surface-lavender/40 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-futuris-teal/10 flex items-center justify-center text-2xl shrink-0">
                    {module.icon || '📋'}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-text-muted mb-1">Module {index + 1}</div>
                    <h3 className="font-bold text-text mb-2">{module.title}</h3>
                    {module.description && (
                      <p className="text-sm text-text-muted leading-relaxed">
                        {module.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </PreviewClickWrapper>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-muted">
          <p>Nog geen modules beschikbaar.</p>
        </div>
      )}

      {/* Bottom info */}
      <div className="mt-8 p-5 bg-futuris-teal/10 rounded-2xl text-center">
        <p className="text-text font-bold mb-2">Meer weten?</p>
        <p className="text-sm text-text-muted">
          Vraag je mentor of decaan voor meer informatie over de D&P modules.
        </p>
      </div>
    </PublicLayout>
  )
}
