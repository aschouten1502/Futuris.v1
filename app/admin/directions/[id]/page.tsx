'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Direction, DirectionCompetency, DirectionTrait, Subject, Career, FurtherEducation } from '@/lib/types'

export default function EditDirectionPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const directionId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Direction data
  const [direction, setDirection] = useState<Direction | null>(null)
  const [competencies, setCompetencies] = useState<DirectionCompetency[]>([])
  const [traits, setTraits] = useState<DirectionTrait[]>([])

  // All available items for linking
  const [allSubjects, setAllSubjects] = useState<Subject[]>([])
  const [allCareers, setAllCareers] = useState<Career[]>([])
  const [allEducation, setAllEducation] = useState<FurtherEducation[]>([])

  // Linked items
  const [linkedSubjects, setLinkedSubjects] = useState<{ subject_id: string; type: 'required' | 'optional' }[]>([])
  const [linkedCareers, setLinkedCareers] = useState<string[]>([])
  const [linkedEducation, setLinkedEducation] = useState<string[]>([])

  // Load data
  useEffect(() => {

    async function loadData() {
      setLoading(true)
      try {
        // Load direction
        const { data: dir } = await supabase
          .from('directions')
          .select('*')
          .eq('id', directionId)
          .single()

        if (dir) setDirection(dir)

        // Load competencies
        const { data: comps } = await supabase
          .from('direction_competencies')
          .select('*')
          .eq('direction_id', directionId)
          .order('order')

        if (comps) setCompetencies(comps)

        // Load traits
        const { data: trts } = await supabase
          .from('direction_traits')
          .select('*')
          .eq('direction_id', directionId)
          .order('order')

        if (trts) setTraits(trts)

        // Load all subjects
        const { data: subs } = await supabase
          .from('subjects')
          .select('*')
          .order('order')

        if (subs) setAllSubjects(subs)

        // Load linked subjects
        const { data: linkedSubs } = await supabase
          .from('direction_subjects')
          .select('subject_id, type')
          .eq('direction_id', directionId)

        if (linkedSubs) setLinkedSubjects(linkedSubs)

        // Load all careers
        const { data: cars } = await supabase
          .from('careers')
          .select('*')
          .order('order')

        if (cars) setAllCareers(cars)

        // Load linked careers
        const { data: linkedCars } = await supabase
          .from('direction_careers')
          .select('career_id')
          .eq('direction_id', directionId)

        if (linkedCars) setLinkedCareers(linkedCars.map(c => c.career_id))

        // Load all education
        const { data: edus } = await supabase
          .from('further_education')
          .select('*')
          .order('order')

        if (edus) setAllEducation(edus)

        // Load linked education
        const { data: linkedEdus } = await supabase
          .from('direction_education')
          .select('education_id')
          .eq('direction_id', directionId)

        if (linkedEdus) setLinkedEducation(linkedEdus.map(e => e.education_id))

      } catch (error) {
        console.error('Error loading data:', error)
        setMessage({ type: 'error', text: 'Kon gegevens niet laden' })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [directionId, supabase])

  const handleSave = async () => {
    if (!direction || !directionId) return

    setSaving(true)
    setMessage(null)

    try {
      // Update direction
      const { error: dirError } = await supabase
        .from('directions')
        .update({
          name: direction.name,
          slug: direction.slug,
          short_description: direction.short_description,
          full_description: direction.full_description,
          video_url: direction.video_url,
          image_url: direction.image_url,
          color: direction.color,
          icon: direction.icon,
          is_active: direction.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', directionId)

      if (dirError) throw dirError

      // Update competencies - delete and re-insert
      await supabase.from('direction_competencies').delete().eq('direction_id', directionId)
      if (competencies.length > 0) {
        const { error: compError } = await supabase
          .from('direction_competencies')
          .insert(competencies.map((c, i) => ({
            direction_id: directionId,
            title: c.title,
            description: c.description,
            icon: c.icon,
            order: i,
          })))
        if (compError) throw compError
      }

      // Update traits - delete and re-insert
      await supabase.from('direction_traits').delete().eq('direction_id', directionId)
      if (traits.length > 0) {
        const { error: traitError } = await supabase
          .from('direction_traits')
          .insert(traits.map((t, i) => ({
            direction_id: directionId,
            trait: t.trait,
            order: i,
          })))
        if (traitError) throw traitError
      }

      // Update subject links - delete and re-insert
      await supabase.from('direction_subjects').delete().eq('direction_id', directionId)
      if (linkedSubjects.length > 0) {
        const { error: subError } = await supabase
          .from('direction_subjects')
          .insert(linkedSubjects.map((s, i) => ({
            direction_id: directionId,
            subject_id: s.subject_id,
            type: s.type,
            order: i,
          })))
        if (subError) throw subError
      }

      // Update career links - delete and re-insert
      await supabase.from('direction_careers').delete().eq('direction_id', directionId)
      if (linkedCareers.length > 0) {
        const { error: carError } = await supabase
          .from('direction_careers')
          .insert(linkedCareers.map((c, i) => ({
            direction_id: directionId,
            career_id: c,
            order: i,
          })))
        if (carError) throw carError
      }

      // Update education links - delete and re-insert
      await supabase.from('direction_education').delete().eq('direction_id', directionId)
      if (linkedEducation.length > 0) {
        const { error: eduError } = await supabase
          .from('direction_education')
          .insert(linkedEducation.map((e, i) => ({
            direction_id: directionId,
            education_id: e,
            order: i,
          })))
        if (eduError) throw eduError
      }

      setMessage({ type: 'success', text: 'Opgeslagen!' })
      router.refresh()
    } catch (error) {
      console.error('Error saving:', error)
      setMessage({ type: 'error', text: 'Kon niet opslaan' })
    } finally {
      setSaving(false)
    }
  }

  const addCompetency = () => {
    setCompetencies([...competencies, {
      id: crypto.randomUUID(),
      direction_id: directionId!,
      title: '',
      description: null,
      icon: null,
      order: competencies.length,
    }])
  }

  const removeCompetency = (index: number) => {
    setCompetencies(competencies.filter((_, i) => i !== index))
  }

  const addTrait = () => {
    setTraits([...traits, {
      id: crypto.randomUUID(),
      direction_id: directionId!,
      trait: '',
      order: traits.length,
    }])
  }

  const removeTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index))
  }

  const toggleSubject = (subjectId: string, type: 'required' | 'optional' | null) => {
    if (type === null) {
      // Remove
      setLinkedSubjects(linkedSubjects.filter(s => s.subject_id !== subjectId))
    } else {
      const existing = linkedSubjects.find(s => s.subject_id === subjectId)
      if (existing) {
        setLinkedSubjects(linkedSubjects.map(s =>
          s.subject_id === subjectId ? { ...s, type } : s
        ))
      } else {
        setLinkedSubjects([...linkedSubjects, { subject_id: subjectId, type }])
      }
    }
  }

  const toggleCareer = (careerId: string) => {
    if (linkedCareers.includes(careerId)) {
      setLinkedCareers(linkedCareers.filter(c => c !== careerId))
    } else {
      setLinkedCareers([...linkedCareers, careerId])
    }
  }

  const toggleEducation = (educationId: string) => {
    if (linkedEducation.includes(educationId)) {
      setLinkedEducation(linkedEducation.filter(e => e !== educationId))
    } else {
      setLinkedEducation([...linkedEducation, educationId])
    }
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
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/directions" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← Terug naar richtingen
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{direction.name}</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
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

      {/* General Info */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Algemene informatie</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
              <input
                type="text"
                value={direction.name}
                onChange={e => setDirection({ ...direction, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={direction.slug}
                onChange={e => setDirection({ ...direction, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Korte beschrijving</label>
            <input
              type="text"
              value={direction.short_description || ''}
              onChange={e => setDirection({ ...direction, short_description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Uitgebreide beschrijving</label>
            <textarea
              value={direction.full_description || ''}
              onChange={e => setDirection({ ...direction, full_description: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube embed)</label>
              <input
                type="text"
                value={direction.video_url || ''}
                onChange={e => setDirection({ ...direction, video_url: e.target.value })}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Afbeelding URL</label>
              <input
                type="text"
                value={direction.image_url || ''}
                onChange={e => setDirection({ ...direction, image_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kleur</label>
              <input
                type="color"
                value={direction.color}
                onChange={e => setDirection({ ...direction, color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icoon (emoji)</label>
              <input
                type="text"
                value={direction.icon || ''}
                onChange={e => setDirection({ ...direction, icon: e.target.value })}
                placeholder="🎯"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={direction.is_active ? 'true' : 'false'}
                onChange={e => setDirection({ ...direction, is_active: e.target.value === 'true' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="true">Actief</option>
                <option value="false">Inactief</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Competencies */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Competenties (wat leer je?)</h2>
          <button
            onClick={addCompetency}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            + Toevoegen
          </button>
        </div>
        <div className="space-y-3">
          {competencies.map((comp, index) => (
            <div key={comp.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={comp.icon || ''}
                onChange={e => {
                  const updated = [...competencies]
                  updated[index] = { ...updated[index], icon: e.target.value }
                  setCompetencies(updated)
                }}
                placeholder="✓"
                className="w-12 px-2 py-1.5 text-center border border-gray-300 rounded"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={comp.title}
                  onChange={e => {
                    const updated = [...competencies]
                    updated[index] = { ...updated[index], title: e.target.value }
                    setCompetencies(updated)
                  }}
                  placeholder="Titel"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={comp.description || ''}
                  onChange={e => {
                    const updated = [...competencies]
                    updated[index] = { ...updated[index], description: e.target.value }
                    setCompetencies(updated)
                  }}
                  placeholder="Beschrijving (optioneel)"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
              <button
                onClick={() => removeCompetency(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                ✕
              </button>
            </div>
          ))}
          {competencies.length === 0 && (
            <p className="text-gray-500 text-sm">Nog geen competenties toegevoegd.</p>
          )}
        </div>
      </section>

      {/* Traits */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Eigenschappen (past dit bij jou?)</h2>
          <button
            onClick={addTrait}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            + Toevoegen
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {traits.map((trait, index) => (
            <div key={trait.id} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <input
                type="text"
                value={trait.trait}
                onChange={e => {
                  const updated = [...traits]
                  updated[index] = { ...updated[index], trait: e.target.value }
                  setTraits(updated)
                }}
                placeholder="Eigenschap"
                className="bg-transparent border-none text-sm focus:outline-none w-24"
              />
              <button
                onClick={() => removeTrait(index)}
                className="text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          {traits.length === 0 && (
            <p className="text-gray-500 text-sm">Nog geen eigenschappen toegevoegd.</p>
          )}
        </div>
      </section>

      {/* Subjects */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Vakken</h2>
        <p className="text-sm text-gray-500 mb-4">Selecteer vakken en geef aan of ze verplicht of een keuzevak zijn.</p>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {allSubjects.map(subject => {
            const linked = linkedSubjects.find(s => s.subject_id === subject.id)
            return (
              <div key={subject.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <span>{subject.icon || '📖'}</span>
                  <span className="text-sm">{subject.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSubject(subject.id, linked?.type === 'required' ? null : 'required')}
                    className={`px-2 py-1 text-xs rounded ${linked?.type === 'required' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    Verplicht
                  </button>
                  <button
                    onClick={() => toggleSubject(subject.id, linked?.type === 'optional' ? null : 'optional')}
                    className={`px-2 py-1 text-xs rounded ${linked?.type === 'optional' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    Keuze
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Careers */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Beroepen</h2>
        <p className="text-sm text-gray-500 mb-4">Selecteer beroepen die bij deze richting horen.</p>
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {allCareers.map(career => (
            <label key={career.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={linkedCareers.includes(career.id)}
                onChange={() => toggleCareer(career.id)}
                className="rounded text-primary-600"
              />
              <span className="text-sm">{career.icon || '👤'} {career.name}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Vervolgopleidingen</h2>
        <p className="text-sm text-gray-500 mb-4">Selecteer opleidingen die bij deze richting horen.</p>
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {allEducation.map(edu => (
            <label key={edu.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={linkedEducation.includes(edu.id)}
                onChange={() => toggleEducation(edu.id)}
                className="rounded text-primary-600"
              />
              <span className="text-sm">
                {edu.name}
                {edu.type && (
                  <span className="ml-1 text-xs text-gray-500 uppercase">({edu.type})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Save button at bottom */}
      <div className="flex justify-end">
        <button
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
