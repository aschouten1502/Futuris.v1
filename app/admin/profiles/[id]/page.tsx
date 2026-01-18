'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Level, SubjectVariant, SubjectMaster } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'
import Link from 'next/link'

type VariantWithSubject = SubjectVariant & { subject: SubjectMaster }

export default function ProfileEditPage() {
  const params = useParams()
  const isNew = params.id === 'new'
  const router = useRouter()
  const supabase = createClient()
  const { toast, showToast, hideToast } = useToast()

  const [levels, setLevels] = useState<Level[]>([])
  const [availableVariants, setAvailableVariants] = useState<VariantWithSubject[]>([])
  const [linkedSubjects, setLinkedSubjects] = useState<Record<string, 'required' | 'optional' | null>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    short_name: '',
    description: '',
    color: '#3B82F6',
    level_id: '',
    phase: 'onderbouw' as 'onderbouw' | 'bovenbouw',
    order: 0,
  })

  useEffect(() => {
    const init = async () => {
      // Laad levels eerst
      const { data: levelsData } = await supabase
        .from('levels')
        .select('*')
        .order('order')

      const loadedLevels = levelsData || []
      setLevels(loadedLevels)

      if (isNew) {
        if (loadedLevels.length > 0) {
          setForm(prev => ({ ...prev, level_id: loadedLevels[0].id }))
          // Laad varianten voor eerste niveau
          await fetchVariantsForLevelSlug(loadedLevels[0].slug)
        }
        setLoading(false)
      } else {
        // Laad profiel
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error || !profileData) {
          showToast('Profiel niet gevonden', 'error')
          router.push('/admin/profiles')
          return
        }

        setForm({
          name: profileData.name,
          slug: profileData.slug,
          short_name: profileData.short_name,
          description: profileData.description || '',
          color: profileData.color,
          level_id: profileData.level_id,
          phase: profileData.phase || 'onderbouw',
          order: profileData.order,
        })

        // Haal gekoppelde vakken op
        const { data: links } = await supabase
          .from('profile_subjects')
          .select('subject_variant_id, type')
          .eq('profile_id', params.id)

        const linked: Record<string, 'required' | 'optional'> = {}
        links?.forEach(link => {
          linked[link.subject_variant_id] = link.type as 'required' | 'optional'
        })
        setLinkedSubjects(linked)

        // Laad varianten voor dit niveau
        const level = loadedLevels.find(l => l.id === profileData.level_id)
        if (level) {
          await fetchVariantsForLevelSlug(level.slug)
        }

        setLoading(false)
      }
    }

    init()
  }, [params.id])

  const fetchVariantsForLevelSlug = async (levelSlug: string) => {
    const { data } = await supabase
      .from('subject_variants')
      .select(`
        *,
        subject:subjects_master (*)
      `)
      .eq('level', levelSlug)

    setAvailableVariants((data || []) as VariantWithSubject[])
  }

  const handleLevelChange = async (newLevelId: string) => {
    setForm({ ...form, level_id: newLevelId })
    setLinkedSubjects({}) // Reset vakken bij niveau wijziging

    const level = levels.find(l => l.id === newLevelId)
    if (level) {
      await fetchVariantsForLevelSlug(level.slug)
    }
  }

  const toggleSubject = (variantId: string, type: 'required' | 'optional' | null) => {
    setLinkedSubjects(prev => ({
      ...prev,
      [variantId]: prev[variantId] === type ? null : type
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.level_id) {
      showToast('Selecteer een niveau', 'error')
      return
    }
    setSaving(true)

    const profileData = {
      name: form.name,
      slug: form.slug,
      short_name: form.short_name,
      description: form.description || null,
      color: form.color,
      level_id: form.level_id,
      phase: form.phase,
      order: form.order,
    }

    let profileId = params.id as string

    try {
      if (isNew) {
        const { data, error } = await supabase
          .from('profiles')
          .insert(profileData)
          .select('id')
          .single()

        if (error) throw error
        profileId = data.id
      } else {
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', params.id)

        if (error) throw error
      }

      // Vakken koppelingen opslaan
      await supabase
        .from('profile_subjects')
        .delete()
        .eq('profile_id', profileId)

      const newLinks = Object.entries(linkedSubjects)
        .filter(([, type]) => type !== null)
        .map(([variantId, type], index) => ({
          profile_id: profileId,
          subject_variant_id: variantId,
          type: type,
          order: index,
        }))

      if (newLinks.length > 0) {
        await supabase.from('profile_subjects').insert(newLinks)
      }

      showToast(isNew ? 'Profiel aangemaakt' : 'Profiel opgeslagen', 'success')

      if (isNew) {
        router.push('/admin/profiles')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Onbekende fout'
      showToast('Fout bij opslaan: ' + message, 'error')
    }

    setSaving(false)
  }

  if (loading) return <div className="text-gray-500">Laden...</div>

  const selectedLevel = levels.find(l => l.id === form.level_id)

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/profiles" className="text-primary-600 hover:underline text-sm">&larr; Terug naar profielen</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">{isNew ? 'Nieuw profiel' : 'Profiel bewerken'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profiel gegevens</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Naam *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Bijv. Sport"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Korte naam *</label>
                <input
                  type="text"
                  value={form.short_name}
                  onChange={(e) => setForm({ ...form, short_name: e.target.value.toUpperCase().slice(0, 4) })}
                  required
                  maxLength={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono"
                  placeholder="SPO"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono text-sm"
                  placeholder="sport"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label>
                <select
                  value={form.level_id}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  required
                  title="Selecteer niveau"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option value="">Selecteer niveau</option>
                  {levels.map(level => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fase *</label>
                <select
                  value={form.phase}
                  onChange={(e) => setForm({ ...form, phase: e.target.value as 'onderbouw' | 'bovenbouw' })}
                  required
                  title="Selecteer fase"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option value="onderbouw">Onderbouw (leerjaar 1-2)</option>
                  <option value="bovenbouw">Bovenbouw (leerjaar 3-4)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Onderbouw: profielklassen (Sport, Tech, etc.) • Bovenbouw: beroepsprofielen (D&P, PIE)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kleur</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    title="Kies kleur"
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono text-sm"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Volgorde</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                title="Volgorde"
                placeholder="0"
                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                placeholder="Wat is dit profiel?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg w-fit">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: form.color }}
                >
                  {form.short_name || '?'}
                </div>
                <span className="font-medium text-gray-900">{form.name || 'Profiel naam'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vakken koppeling sectie */}
        {!isNew && selectedLevel && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Vakken koppelen
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Koppel vakken aan dit profiel. Alleen vakken met een {selectedLevel.name} variant worden getoond.
            </p>

            {availableVariants.length === 0 ? (
              <div className="text-gray-500 text-sm p-4 bg-gray-50 rounded-lg">
                Geen vakken beschikbaar voor {selectedLevel.name}. Maak eerst vakken aan met een {selectedLevel.name} variant.
              </div>
            ) : (
              <div className="space-y-2">
                {availableVariants
                  .sort((a, b) => (a.subject?.order || 0) - (b.subject?.order || 0))
                  .map(variant => (
                  <div
                    key={variant.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      linkedSubjects[variant.id]
                        ? 'border-primary-300 bg-primary-50/50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {variant.subject?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {variant.hours_per_week} uur/week • Leerjaar {variant.years.join(', ')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSubject(variant.id, 'required')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          linkedSubjects[variant.id] === 'required'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        Verplicht
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSubject(variant.id, 'optional')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          linkedSubjects[variant.id] === 'optional'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        Keuze
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500">
              {Object.values(linkedSubjects).filter(t => t === 'required').length} verplicht,{' '}
              {Object.values(linkedSubjects).filter(t => t === 'optional').length} keuzevakken
            </div>
          </div>
        )}

        {isNew && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
            Sla het profiel eerst op om vakken te kunnen koppelen.
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Opslaan...' : isNew ? 'Aanmaken' : 'Opslaan'}
          </button>
          <Link href="/admin/profiles" className="text-gray-600 hover:text-gray-900">Annuleren</Link>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
