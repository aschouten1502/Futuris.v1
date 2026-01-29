'use client'

import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useDirectionEditor } from '@/hooks/useDirectionEditor'
import { DirectionBasicInfo } from '@/components/admin/DirectionBasicInfo'
import { CollapsibleSection } from '@/components/admin/shared/CollapsibleSection'
import { CompetenciesModule } from '@/components/admin/modules/CompetenciesModule'
import { TraitsModule } from '@/components/admin/modules/TraitsModule'
import { SubjectsModule } from '@/components/admin/modules/SubjectsModule'
import { CareersModule } from '@/components/admin/modules/CareersModule'
import { EducationModule } from '@/components/admin/modules/EducationModule'

export default function EditDirectionPage() {
  const router = useRouter()
  const params = useParams()
  const directionId = params.id as string

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

  const handleSave = async () => {
    const newId = await actions.save()
    if (newId) {
      // Redirect to the newly created direction's edit page
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

  return (
    <div className="space-y-4 max-w-4xl">
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
      <DirectionBasicInfo
        direction={direction}
        onChange={actions.updateDirection}
      />

      {/* Content blocks — accordion style */}
      {!isNew && (
        <>
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
        </>
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
  )
}
