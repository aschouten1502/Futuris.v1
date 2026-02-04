'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Direction, DirectionCompetency, DirectionTrait, Subject, Career, FurtherEducation } from '@/lib/types'

interface LinkedSubject {
  subject_id: string
  type: 'required' | 'optional' | null
  is_fitting: boolean
}

interface DirectionEditorState {
  direction: Direction | null
  competencies: DirectionCompetency[]
  traits: DirectionTrait[]
  allSubjects: Subject[]
  allCareers: Career[]
  allEducation: FurtherEducation[]
  linkedSubjects: LinkedSubject[]
  linkedCareers: string[]
  linkedEducation: string[]
  loading: boolean
  saving: boolean
  message: { type: 'success' | 'error'; text: string } | null
}

const emptyDirection: Omit<Direction, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  slug: '',
  short_description: null,
  full_description: null,
  video_url: null,
  image_url: null,
  image_orientation: null,
  color: '#003c46',
  icon: null,
  order: 0,
  is_active: true,
  category: 'dp',
  careers_intro: null,
  dp_modules_link_text: null,
  keuzevakken_link_text: null,
}

export function useDirectionEditor(directionId: string) {
  const supabase = createClient()
  const isNew = directionId === 'new'

  const [state, setState] = useState<DirectionEditorState>({
    direction: isNew ? { id: '', ...emptyDirection } as Direction : null,
    competencies: [],
    traits: [],
    allSubjects: [],
    allCareers: [],
    allEducation: [],
    linkedSubjects: [],
    linkedCareers: [],
    linkedEducation: [],
    loading: !isNew,
    saving: false,
    message: null,
  })

  // Load data
  useEffect(() => {
    async function loadData() {
      setState(s => ({ ...s, loading: true }))
      try {
        // Always load reference data
        const [subsRes, carsRes, edusRes] = await Promise.all([
          supabase.from('subjects').select('*').order('order'),
          supabase.from('careers').select('*').order('order'),
          supabase.from('further_education').select('*').order('order'),
        ])

        const updates: Partial<DirectionEditorState> = {
          allSubjects: subsRes.data || [],
          allCareers: carsRes.data || [],
          allEducation: edusRes.data || [],
        }

        if (!isNew) {
          const [dirRes, compsRes, trtsRes, linkedSubsRes, linkedCarsRes, linkedEdusRes] = await Promise.all([
            supabase.from('directions').select('*').eq('id', directionId).single(),
            supabase.from('direction_competencies').select('*').eq('direction_id', directionId).order('order'),
            supabase.from('direction_traits').select('*').eq('direction_id', directionId).order('order'),
            supabase.from('direction_subjects').select('subject_id, type, is_fitting').eq('direction_id', directionId),
            supabase.from('direction_careers').select('career_id').eq('direction_id', directionId),
            supabase.from('direction_education').select('education_id').eq('direction_id', directionId),
          ])

          updates.direction = dirRes.data
          updates.competencies = compsRes.data || []
          updates.traits = trtsRes.data || []
          updates.linkedSubjects = linkedSubsRes.data || []
          updates.linkedCareers = (linkedCarsRes.data || []).map(c => c.career_id)
          updates.linkedEducation = (linkedEdusRes.data || []).map(e => e.education_id)
        }

        setState(s => ({ ...s, ...updates, loading: false }))
      } catch (error) {
        console.error('Error loading data:', error)
        setState(s => ({
          ...s,
          loading: false,
          message: { type: 'error', text: 'Kon gegevens niet laden' },
        }))
      }
    }

    loadData()
  }, [directionId, isNew])

  // Direction field updates
  const updateDirection = useCallback((updates: Partial<Direction>) => {
    setState(s => ({
      ...s,
      direction: s.direction ? { ...s.direction, ...updates } : null,
    }))
  }, [])

  // Competencies
  const addCompetency = useCallback(() => {
    setState(s => ({
      ...s,
      competencies: [...s.competencies, {
        id: crypto.randomUUID(),
        direction_id: directionId,
        title: '',
        description: null,
        icon: null,
        order: s.competencies.length,
      }],
    }))
  }, [directionId])

  const removeCompetency = useCallback((index: number) => {
    setState(s => ({
      ...s,
      competencies: s.competencies.filter((_, i) => i !== index),
    }))
  }, [])

  const updateCompetency = useCallback((index: number, updates: Partial<DirectionCompetency>) => {
    setState(s => ({
      ...s,
      competencies: s.competencies.map((c, i) => i === index ? { ...c, ...updates } : c),
    }))
  }, [])

  // Traits
  const addTrait = useCallback(() => {
    setState(s => ({
      ...s,
      traits: [...s.traits, {
        id: crypto.randomUUID(),
        direction_id: directionId,
        trait: '',
        order: s.traits.length,
      }],
    }))
  }, [directionId])

  const removeTrait = useCallback((index: number) => {
    setState(s => ({
      ...s,
      traits: s.traits.filter((_, i) => i !== index),
    }))
  }, [])

  const updateTrait = useCallback((index: number, trait: string) => {
    setState(s => ({
      ...s,
      traits: s.traits.map((t, i) => i === index ? { ...t, trait } : t),
    }))
  }, [])

  // Subject linking — toggle type (required/optional/null)
  const toggleSubject = useCallback((subjectId: string, type: 'required' | 'optional' | null) => {
    setState(s => {
      const existing = s.linkedSubjects.find(ls => ls.subject_id === subjectId)
      if (existing) {
        // Unlink if both type=null and is_fitting=false
        if (type === null && !existing.is_fitting) {
          return { ...s, linkedSubjects: s.linkedSubjects.filter(ls => ls.subject_id !== subjectId) }
        }
        return {
          ...s,
          linkedSubjects: s.linkedSubjects.map(ls =>
            ls.subject_id === subjectId ? { ...ls, type } : ls
          ),
        }
      }
      // Not linked yet — create new link
      if (type !== null) {
        return { ...s, linkedSubjects: [...s.linkedSubjects, { subject_id: subjectId, type, is_fitting: false }] }
      }
      return s
    })
  }, [])

  // Subject linking — toggle is_fitting
  const toggleFitting = useCallback((subjectId: string) => {
    setState(s => {
      const existing = s.linkedSubjects.find(ls => ls.subject_id === subjectId)
      if (existing) {
        // Turn off fitting — unlink if type is also null
        if (existing.is_fitting && existing.type === null) {
          return { ...s, linkedSubjects: s.linkedSubjects.filter(ls => ls.subject_id !== subjectId) }
        }
        return {
          ...s,
          linkedSubjects: s.linkedSubjects.map(ls =>
            ls.subject_id === subjectId ? { ...ls, is_fitting: !ls.is_fitting } : ls
          ),
        }
      }
      // Not linked yet — create new link with is_fitting=true
      return { ...s, linkedSubjects: [...s.linkedSubjects, { subject_id: subjectId, type: null, is_fitting: true }] }
    })
  }, [])

  // Career linking
  const toggleCareer = useCallback((careerId: string) => {
    setState(s => ({
      ...s,
      linkedCareers: s.linkedCareers.includes(careerId)
        ? s.linkedCareers.filter(c => c !== careerId)
        : [...s.linkedCareers, careerId],
    }))
  }, [])

  // Education linking
  const toggleEducation = useCallback((educationId: string) => {
    setState(s => ({
      ...s,
      linkedEducation: s.linkedEducation.includes(educationId)
        ? s.linkedEducation.filter(e => e !== educationId)
        : [...s.linkedEducation, educationId],
    }))
  }, [])

  // Clear message
  const clearMessage = useCallback(() => {
    setState(s => ({ ...s, message: null }))
  }, [])

  // Refresh reference data (after inline create)
  const refreshSubjects = useCallback(async () => {
    const { data } = await supabase.from('subjects').select('*').order('order')
    if (data) setState(s => ({ ...s, allSubjects: data }))
  }, [])

  const refreshCareers = useCallback(async () => {
    const { data } = await supabase.from('careers').select('*').order('order')
    if (data) setState(s => ({ ...s, allCareers: data }))
  }, [])

  const refreshEducation = useCallback(async () => {
    const { data } = await supabase.from('further_education').select('*').order('order')
    if (data) setState(s => ({ ...s, allEducation: data }))
  }, [])

  // Save
  const save = useCallback(async (): Promise<string | null> => {
    const { direction, competencies, traits, linkedSubjects, linkedCareers, linkedEducation } = state
    if (!direction) return null

    setState(s => ({ ...s, saving: true, message: null }))

    try {
      let currentId = directionId

      if (isNew) {
        // Create new direction
        const { data, error } = await supabase
          .from('directions')
          .insert({
            name: direction.name,
            slug: direction.slug || direction.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            short_description: direction.short_description,
            full_description: direction.full_description,
            video_url: direction.video_url,
            image_url: direction.image_url,
            image_orientation: direction.image_orientation,
            color: direction.color,
            icon: direction.icon,
            is_active: direction.is_active,
            category: direction.category || 'dp',
            careers_intro: direction.careers_intro,
            dp_modules_link_text: direction.dp_modules_link_text,
            keuzevakken_link_text: direction.keuzevakken_link_text,
            order: direction.order,
          })
          .select('id')
          .single()

        if (error) throw error
        currentId = data.id
      } else {
        // Update existing direction
        const { error } = await supabase
          .from('directions')
          .update({
            name: direction.name,
            slug: direction.slug,
            short_description: direction.short_description,
            full_description: direction.full_description,
            video_url: direction.video_url,
            image_url: direction.image_url,
            image_orientation: direction.image_orientation,
            color: direction.color,
            icon: direction.icon,
            is_active: direction.is_active,
            category: direction.category || 'dp',
            careers_intro: direction.careers_intro,
            dp_modules_link_text: direction.dp_modules_link_text,
            keuzevakken_link_text: direction.keuzevakken_link_text,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentId)

        if (error) throw error
      }

      // Update competencies
      await supabase.from('direction_competencies').delete().eq('direction_id', currentId)
      if (competencies.length > 0) {
        const { error } = await supabase
          .from('direction_competencies')
          .insert(competencies.map((c, i) => ({
            direction_id: currentId,
            title: c.title,
            description: c.description,
            icon: c.icon,
            order: i,
          })))
        if (error) throw error
      }

      // Update traits
      await supabase.from('direction_traits').delete().eq('direction_id', currentId)
      if (traits.length > 0) {
        const { error } = await supabase
          .from('direction_traits')
          .insert(traits.map((t, i) => ({
            direction_id: currentId,
            trait: t.trait,
            order: i,
          })))
        if (error) throw error
      }

      // Update subject links
      await supabase.from('direction_subjects').delete().eq('direction_id', currentId)
      if (linkedSubjects.length > 0) {
        const { error } = await supabase
          .from('direction_subjects')
          .insert(linkedSubjects.map((s, i) => ({
            direction_id: currentId,
            subject_id: s.subject_id,
            type: s.type,
            is_fitting: s.is_fitting,
            order: i,
          })))
        if (error) throw error
      }

      // Update career links
      await supabase.from('direction_careers').delete().eq('direction_id', currentId)
      if (linkedCareers.length > 0) {
        const { error } = await supabase
          .from('direction_careers')
          .insert(linkedCareers.map((c, i) => ({
            direction_id: currentId,
            career_id: c,
            order: i,
          })))
        if (error) throw error
      }

      // Update education links
      await supabase.from('direction_education').delete().eq('direction_id', currentId)
      if (linkedEducation.length > 0) {
        const { error } = await supabase
          .from('direction_education')
          .insert(linkedEducation.map((e, i) => ({
            direction_id: currentId,
            education_id: e,
            order: i,
          })))
        if (error) throw error
      }

      setState(s => ({
        ...s,
        saving: false,
        message: { type: 'success', text: 'Opgeslagen!' },
      }))

      return isNew ? currentId : null
    } catch (error) {
      console.error('Error saving:', error)
      setState(s => ({
        ...s,
        saving: false,
        message: { type: 'error', text: 'Kon niet opslaan' },
      }))
      return null
    }
  }, [state, directionId, isNew])

  return {
    ...state,
    isNew,
    actions: {
      updateDirection,
      addCompetency,
      removeCompetency,
      updateCompetency,
      addTrait,
      removeTrait,
      updateTrait,
      toggleSubject,
      toggleFitting,
      toggleCareer,
      toggleEducation,
      clearMessage,
      refreshSubjects,
      refreshCareers,
      refreshEducation,
      save,
    },
  }
}
