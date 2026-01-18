'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Level, SubjectVariant } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'
import Link from 'next/link'

// Alle Futuris niveaus
const LEVELS = [
  { slug: 'vmbo-b', name: 'VMBO Basis' },
  { slug: 'vmbo-k', name: 'VMBO Kader' },
  { slug: 'mavo', name: 'Mavo' },
  { slug: 'mavo-havo', name: 'Mavo/Havo' },
  { slug: 'isk', name: 'ISK' },
]

type VariantForm = {
  enabled: boolean
  description: string
  years: number[]
  hours_per_week: number
  existingId?: string
}

export default function SubjectEditPage() {
  const params = useParams()
  const isNew = params.id === 'new'
  const router = useRouter()
  const supabase = createClient()
  const { toast, showToast, hideToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Master vak form
  const [masterForm, setMasterForm] = useState({
    name: '',
    slug: '',
    icon: '',
    order: 0,
  })

  // Varianten per niveau
  const [variants, setVariants] = useState<Record<string, VariantForm>>(() => {
    const initial: Record<string, VariantForm> = {}
    LEVELS.forEach(level => {
      initial[level.slug] = {
        enabled: false,
        description: '',
        years: [],
        hours_per_week: 0,
      }
    })
    return initial
  })

  useEffect(() => {
    if (!isNew) {
      fetchSubject()
    } else {
      setLoading(false)
    }
  }, [params.id])

  const fetchSubject = async () => {
    // Haal master vak op met varianten
    const { data, error } = await supabase
      .from('subjects_master')
      .select(`
        *,
        variants:subject_variants (*)
      `)
      .eq('id', params.id)
      .single()

    if (error || !data) {
      showToast('Vak niet gevonden', 'error')
      router.push('/admin/subjects')
      return
    }

    setMasterForm({
      name: data.name,
      slug: data.slug,
      icon: data.icon || '',
      order: data.order,
    })

    // Vul varianten in
    const newVariants: Record<string, VariantForm> = {}
    LEVELS.forEach(level => {
      const existing = data.variants?.find((v: SubjectVariant) => v.level === level.slug)
      newVariants[level.slug] = existing
        ? {
            enabled: true,
            description: existing.description || '',
            years: existing.years || [],
            hours_per_week: existing.hours_per_week || 0,
            existingId: existing.id,
          }
        : {
            enabled: false,
            description: '',
            years: [],
            hours_per_week: 0,
          }
    })
    setVariants(newVariants)
    setLoading(false)
  }

  const toggleYear = (levelSlug: string, year: number) => {
    setVariants(prev => {
      const current = prev[levelSlug].years
      const newYears = current.includes(year)
        ? current.filter(y => y !== year)
        : [...current, year].sort()
      return {
        ...prev,
        [levelSlug]: { ...prev[levelSlug], years: newYears }
      }
    })
  }

  const updateVariant = (levelSlug: string, field: keyof VariantForm, value: unknown) => {
    setVariants(prev => ({
      ...prev,
      [levelSlug]: { ...prev[levelSlug], [field]: value }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validatie
    const enabledVariants = Object.entries(variants).filter(([, v]) => v.enabled)
    if (enabledVariants.length === 0) {
      showToast('Activeer minimaal 1 niveau', 'error')
      return
    }

    for (const [levelSlug, variant] of enabledVariants) {
      if (variant.years.length === 0) {
        const levelName = LEVELS.find(l => l.slug === levelSlug)?.name
        showToast(`Selecteer leerjaren voor ${levelName}`, 'error')
        return
      }
    }

    setSaving(true)

    try {
      let subjectId = params.id as string

      // Master vak opslaan
      if (isNew) {
        const { data, error } = await supabase
          .from('subjects_master')
          .insert({
            name: masterForm.name,
            slug: masterForm.slug,
            icon: masterForm.icon || null,
            order: masterForm.order,
          })
          .select('id')
          .single()

        if (error) throw error
        subjectId = data.id
      } else {
        const { error } = await supabase
          .from('subjects_master')
          .update({
            name: masterForm.name,
            slug: masterForm.slug,
            icon: masterForm.icon || null,
            order: masterForm.order,
          })
          .eq('id', params.id)

        if (error) throw error
      }

      // Varianten opslaan
      for (const [levelSlug, variant] of Object.entries(variants)) {
        if (variant.enabled) {
          const variantData = {
            subject_id: subjectId,
            level: levelSlug,
            description: variant.description || null,
            years: variant.years,
            hours_per_week: variant.hours_per_week,
          }

          if (variant.existingId) {
            // Update bestaande variant
            await supabase
              .from('subject_variants')
              .update(variantData)
              .eq('id', variant.existingId)
          } else {
            // Nieuwe variant
            await supabase
              .from('subject_variants')
              .insert(variantData)
          }
        } else if (variant.existingId) {
          // Verwijder variant als die bestond maar nu uit staat
          await supabase
            .from('subject_variants')
            .delete()
            .eq('id', variant.existingId)
        }
      }

      showToast(isNew ? 'Vak aangemaakt' : 'Vak opgeslagen', 'success')

      if (isNew) {
        router.push('/admin/subjects')
      } else {
        // Herlaad data
        fetchSubject()
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Onbekende fout'
      showToast('Fout bij opslaan: ' + message, 'error')
    }

    setSaving(false)
  }

  if (loading) return <div className="text-gray-500">Laden...</div>

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/subjects" className="text-primary-600 hover:underline text-sm">
          &larr; Terug naar vakken
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {isNew ? 'Nieuw vak' : masterForm.name || 'Vak bewerken'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Master vak gegevens */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vak gegevens</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Naam *</label>
                <input
                  type="text"
                  value={masterForm.name}
                  onChange={(e) => setMasterForm({ ...masterForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Bijv. Nederlands"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  value={masterForm.slug}
                  onChange={(e) => setMasterForm({
                    ...masterForm,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                  })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono text-sm"
                  placeholder="nederlands"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Volgorde</label>
                <input
                  type="number"
                  value={masterForm.order}
                  onChange={(e) => setMasterForm({ ...masterForm, order: parseInt(e.target.value) || 0 })}
                  title="Volgorde van het vak"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Niveau varianten */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Niveau-varianten</h2>
          <p className="text-sm text-gray-500 mb-6">
            Activeer de niveaus waarvoor dit vak beschikbaar is en vul per niveau de specifieke informatie in.
          </p>

          <div className="space-y-4">
            {LEVELS.map(level => {
              const variant = variants[level.slug]
              return (
                <div
                  key={level.slug}
                  className={`border rounded-lg transition-colors ${
                    variant.enabled
                      ? 'border-primary-300 bg-primary-50/50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  {/* Header met toggle */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`enable-${level.slug}`}
                        checked={variant.enabled}
                        onChange={(e) => updateVariant(level.slug, 'enabled', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label
                        htmlFor={`enable-${level.slug}`}
                        className={`font-medium ${variant.enabled ? 'text-gray-900' : 'text-gray-500'}`}
                      >
                        {level.name}
                      </label>
                    </div>
                    {variant.enabled && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        Actief
                      </span>
                    )}
                  </div>

                  {/* Variant details (alleen als enabled) */}
                  {variant.enabled && (
                    <div className="px-4 pb-4 pt-2 border-t border-primary-200 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Beschrijving voor {level.name}
                        </label>
                        <textarea
                          value={variant.description}
                          onChange={(e) => updateVariant(level.slug, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none text-sm"
                          placeholder={`Wat leren leerlingen bij ${masterForm.name || 'dit vak'} op ${level.name}?`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Leerjaren *
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4].map(year => (
                              <button
                                key={year}
                                type="button"
                                onClick={() => toggleYear(level.slug, year)}
                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                  variant.years.includes(year)
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {year}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Uren per week
                          </label>
                          <input
                            type="number"
                            value={variant.hours_per_week}
                            onChange={(e) => updateVariant(level.slug, 'hours_per_week', parseInt(e.target.value) || 0)}
                            min={0}
                            max={20}
                            title="Uren per week"
                            placeholder="0"
                            className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Opslaan...' : isNew ? 'Aanmaken' : 'Opslaan'}
          </button>
          <Link href="/admin/subjects" className="text-gray-600 hover:text-gray-900">
            Annuleren
          </Link>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
