'use client'

import { useRouter, useParams } from 'next/navigation'
import { useRef, useCallback, useState } from 'react'
import Link from 'next/link'
import { useDirectionEditor } from '@/hooks/useDirectionEditor'
import { DirectionBasicInfo } from '@/components/admin/DirectionBasicInfo'
import { DirectionPreview } from '@/components/admin/DirectionPreview'
import { CollapsibleSection } from '@/components/admin/shared/CollapsibleSection'
import { CompetenciesModule } from '@/components/admin/modules/CompetenciesModule'
import { TraitsModule } from '@/components/admin/modules/TraitsModule'
import { SubjectsModule } from '@/components/admin/modules/SubjectsModule'
import { CareersModule } from '@/components/admin/modules/CareersModule'
import { EducationModule } from '@/components/admin/modules/EducationModule'
import { GuidedTour, TourStep } from '@/components/admin/GuidedTour'

export default function EditDirectionPage() {
  const router = useRouter()
  const params = useParams()
  const directionId = params.id as string

  // Refs for scrolling to sections
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Guided tour state
  const [tourOpen, setTourOpen] = useState(false)

  // Tour steps
  const tourSteps: TourStep[] = [
    {
      target: '[data-tour="basic-info"]',
      title: 'Algemene informatie',
      description: 'Hier vul je de basisgegevens in: naam, beschrijving, video, kleur en icoon van de richting.',
      position: 'right',
    },
    {
      target: '[data-tour="sections"]',
      title: 'Inhoud secties',
      description: 'Klik op een sectie om deze uit te klappen. Hier voeg je modules, eigenschappen, vakken, beroepen en opleidingen toe.',
      position: 'right',
    },
    {
      target: '[data-tour="preview"]',
      title: 'Live preview',
      description: 'Hier zie je direct hoe de pagina eruitziet voor leerlingen. Klik op een onderdeel om naar dat veld te scrollen.',
      position: 'left',
    },
    {
      target: '[data-tour="overview"]',
      title: 'Overzicht',
      description: 'Een handig overzicht van wat je al hebt ingevuld. Zo zie je snel wat er nog mist.',
      position: 'left',
    },
    {
      target: '[data-tour="save"]',
      title: 'Opslaan',
      description: 'Vergeet niet om je wijzigingen op te slaan! Wijzigingen worden pas bewaard als je op deze knop klikt.',
      position: 'bottom',
    },
  ]

  const {
    direction,
    competencies,
    traits,
    allSubjects,
    allCareers,
    allEducation,
    linkedSubjects,
    linkedCareers,
    linkedEducation,
    loading,
    saving,
    message,
    isNew,
    actions,
  } = useDirectionEditor(directionId)

  // Handle preview click - scroll to and highlight the target field
  const handlePreviewClick = useCallback((fieldId: string) => {
    // Map fieldId to section ref key
    const sectionMap: Record<string, string> = {
      'header': 'basic-info',
      'video': 'basic-info',
      'full-description': 'basic-info',
      'careers-intro': 'basic-info',
      'modules': 'competencies',
      'traits': 'traits',
      'subjects': 'subjects',
      'careers': 'careers',
      'education': 'education',
    }

    // Handle module-X and trait-X patterns
    let targetSection = sectionMap[fieldId]
    if (fieldId.startsWith('module-')) targetSection = 'competencies'
    if (fieldId.startsWith('trait-')) targetSection = 'traits'

    const targetEl = sectionRefs.current[targetSection || fieldId]
    if (targetEl) {
      // Scroll into view
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })

      // Add highlight effect
      targetEl.classList.add('ring-2', 'ring-primary-400', 'ring-offset-2')
      setTimeout(() => {
        targetEl.classList.remove('ring-2', 'ring-primary-400', 'ring-offset-2')
      }, 2000)

      // If it's a collapsible section, expand it by clicking on the summary
      const details = targetEl.querySelector('details')
      if (details && !details.open) {
        details.open = true
      }
    }
  }, [])

  const handleSave = async () => {
    const newId = await actions.save()
    if (newId) {
      router.replace(`/admin/directions/${newId}`)
    }
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laden...</div>
      </div>
    )
  }

  if (!direction) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Richting niet gevonden</p>
        <Link href="/admin/directions" className="text-primary-600 hover:underline mt-2 inline-block">
          Terug naar overzicht
        </Link>
      </div>
    )
  }

  // Content overview items
  const contentItems = [
    { label: 'Naam', value: direction.name || '—' },
    { label: 'Beschrijving', done: !!direction.full_description },
    { label: 'Video', done: !!direction.video_url },
    { label: 'Icoon', value: direction.icon || '—' },
    { label: 'Modules', count: competencies.length },
    { label: 'Eigenschappen', count: traits.length },
    { label: 'Vakken', count: linkedSubjects.length },
    { label: 'Beroepen', count: linkedCareers.length },
    { label: 'Opleidingen', count: linkedEducation.length },
  ]

  return (
    <div className="flex gap-6">
      {/* Left side: Form */}
      <div className="flex-1 min-w-0 space-y-4 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-gray-50 py-3 z-10">
          <div>
            <Link href="/admin/directions" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
              ← Terug naar richtingen
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? 'Nieuwe richting' : direction.name}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            data-tour="save"
            className="bg-primary-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Basic Info — always visible */}
        <div
          ref={el => { sectionRefs.current['basic-info'] = el }}
          data-tour="basic-info"
          className="transition-all duration-300 rounded-xl"
        >
          <DirectionBasicInfo
            direction={direction}
            onChange={actions.updateDirection}
          />
        </div>

        {/* Content blocks — accordion style */}
        {!isNew && (
          <div data-tour="sections" className="space-y-4">
            <div
              ref={el => { sectionRefs.current['competencies'] = el }}
              className="transition-all duration-300 rounded-xl"
            >
              <CollapsibleSection
                title={direction.category === 'dp' ? 'D&P Modules' : 'Competenties'}
                subtitle={direction.category === 'dp'
                  ? 'De vier verplichte modules van D&P met richtingspecifieke voorbeelden'
                  : 'Wat leer je bij deze richting?'}
                icon={direction.category === 'dp' ? '📋' : '🎯'}
                count={competencies.length}
              >
                <CompetenciesModule
                  competencies={competencies}
                  onAdd={actions.addCompetency}
                  onRemove={actions.removeCompetency}
                  onUpdate={actions.updateCompetency}
                />
              </CollapsibleSection>
            </div>

            <div
              ref={el => { sectionRefs.current['traits'] = el }}
              className="transition-all duration-300 rounded-xl"
            >
              <CollapsibleSection
                title="Eigenschappen"
                subtitle="Past dit bij jou?"
                icon="✨"
                count={traits.length}
              >
                <TraitsModule
                  traits={traits}
                  onAdd={actions.addTrait}
                  onRemove={actions.removeTrait}
                  onUpdate={actions.updateTrait}
                />
              </CollapsibleSection>
            </div>

            <div
              ref={el => { sectionRefs.current['subjects'] = el }}
              className="transition-all duration-300 rounded-xl"
            >
              <CollapsibleSection
                title="Vakken"
                subtitle="Welke vakken volg je?"
                icon="📚"
                count={linkedSubjects.length}
              >
                <SubjectsModule
                  allSubjects={allSubjects}
                  linkedSubjects={linkedSubjects}
                  onToggle={actions.toggleSubject}
                  onToggleFitting={actions.toggleFitting}
                  onRefresh={actions.refreshSubjects}
                />
              </CollapsibleSection>
            </div>

            <div
              ref={el => { sectionRefs.current['careers'] = el }}
              className="transition-all duration-300 rounded-xl"
            >
              <CollapsibleSection
                title="Beroepen"
                subtitle="Wat kun je worden?"
                icon="💼"
                count={linkedCareers.length}
              >
                <CareersModule
                  allCareers={allCareers}
                  linkedCareers={linkedCareers}
                  onToggle={actions.toggleCareer}
                  onRefresh={actions.refreshCareers}
                />
              </CollapsibleSection>
            </div>

            <div
              ref={el => { sectionRefs.current['education'] = el }}
              className="transition-all duration-300 rounded-xl"
            >
              <CollapsibleSection
                title="Opleidingen"
                subtitle="Hoe kun je verder studeren?"
                icon="🎓"
                count={linkedEducation.length}
              >
                <EducationModule
                  allEducation={allEducation}
                  linkedEducation={linkedEducation}
                  onToggle={actions.toggleEducation}
                  onRefresh={actions.refreshEducation}
                />
              </CollapsibleSection>
            </div>
          </div>
        )}

        {isNew && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            Sla de richting eerst op om competenties, eigenschappen, vakken, beroepen en opleidingen toe te voegen.
          </div>
        )}

        {/* Bottom save button */}
        <div className="flex justify-end pb-8">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
      </div>

      {/* Right side: Preview + Sidebar */}
      <div className="hidden xl:flex gap-4 shrink-0">
        {/* Preview */}
        <div className="w-[540px] shrink-0" data-tour="preview">
          <div className="sticky top-4">
            <DirectionPreview
              direction={direction}
              competencies={competencies}
              traits={traits}
              allSubjects={allSubjects}
              linkedSubjects={linkedSubjects}
              allCareers={allCareers}
              linkedCareers={linkedCareers}
              allEducation={allEducation}
              linkedEducation={linkedEducation}
              onFieldClick={handlePreviewClick}
            />
          </div>
        </div>

        {/* Sidebar: Checklist + Tips */}
        <div className="w-[240px] shrink-0">
          <div className="sticky top-4 space-y-4">
            {/* Content Overview */}
            <div className="bg-white rounded-xl border border-gray-200 p-3" data-tour="overview">
              <h3 className="text-xs font-semibold text-gray-700 mb-2">Overzicht</h3>
              <div className="space-y-1.5">
                {contentItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-gray-600">{item.label}</span>
                    <span className="text-gray-700 font-medium">
                      {'count' in item ? item.count : 'done' in item ? (item.done ? '✓' : '—') : item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tour Button */}
            <button
              type="button"
              onClick={() => setTourOpen(true)}
              className="w-full bg-white rounded-xl border border-gray-200 p-3 text-left hover:border-primary-300 hover:bg-primary-50/50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <div>
                  <p className="text-xs font-semibold text-gray-700 group-hover:text-primary-700">Rondleiding</p>
                  <p className="text-xs text-gray-500">Leer hoe alles werkt</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Guided Tour */}
      <GuidedTour
        steps={tourSteps}
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
      />
    </div>
  )
}
