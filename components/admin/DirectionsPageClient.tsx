'use client'

import { useState } from 'react'
import Link from 'next/link'
import DirectionsTable from '@/components/admin/DirectionsTable'
import { GuidedTour, TourStep } from '@/components/admin/GuidedTour'
import { TourButton } from '@/components/admin/TourButton'
import type { Direction } from '@/lib/types'

interface DirectionsPageClientProps {
  directions: Direction[]
}

export function DirectionsPageClient({ directions }: DirectionsPageClientProps) {
  const [tourOpen, setTourOpen] = useState(false)

  const tourSteps: TourStep[] = [
    {
      target: '[data-tour="header"]',
      title: 'Richtingen beheer',
      description: 'Dit is het overzicht van alle richtingen in de app. Hier zie je alle D&P richtingen en Mavo routes.',
      position: 'bottom',
    },
    {
      target: '[data-tour="new-button"]',
      title: 'Nieuwe richting',
      description: 'Klik hier om een nieuwe richting aan te maken. Je kunt kiezen tussen een D&P richting of een Mavo route.',
      position: 'left',
    },
    {
      target: '[data-tour="table"]',
      title: 'Richtingen tabel',
      description: 'Hier zie je alle richtingen met hun naam, categorie, aantal vakken en status. Klik op "Bewerken" om een richting aan te passen.',
      position: 'bottom',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between" data-tour="header">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Richtingen</h1>
          <p className="text-gray-600">Beheer de D&P richtingen en Mavo routes</p>
        </div>
        <div className="flex items-center gap-3">
          <TourButton onClick={() => setTourOpen(true)} />
          <Link
            href="/admin/directions/new"
            data-tour="new-button"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm"
          >
            + Nieuwe richting
          </Link>
        </div>
      </div>

      <div data-tour="table">
        <DirectionsTable directions={directions} />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-800 text-sm">
          <strong>Tip:</strong> Klik op &quot;Bewerken&quot; om een richting aan te passen. Je kunt daar
          de naam, beschrijving, video, competenties, eigenschappen, vakken, beroepen en opleidingen beheren.
          Gebruik &quot;Nieuwe richting&quot; om een nieuwe D&P richting of Mavo route aan te maken.
        </p>
      </div>

      <GuidedTour
        steps={tourSteps}
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
      />
    </div>
  )
}
