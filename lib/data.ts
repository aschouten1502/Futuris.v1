import { supabase } from './supabaseClient'
import type {
  Direction,
  DirectionCompetency,
  DirectionTrait,
  DirectionDocument,
  Subject,
  DirectionSubject,
  Career,
  DirectionCareer,
  FurtherEducation,
  DirectionEducation,
  DirectionWithDetails,
} from './types'

// ============================================
// RICHTINGEN
// ============================================

export async function getDirections(): Promise<Direction[]> {
  const { data, error } = await supabase
    .from('directions')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching directions:', error)
    throw new Error('Kon richtingen niet laden')
  }

  return data || []
}

export async function getAllDirections(): Promise<Direction[]> {
  const { data, error } = await supabase
    .from('directions')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching all directions:', error)
    throw new Error('Kon richtingen niet laden')
  }

  return data || []
}

export async function getDirectionBySlug(slug: string): Promise<Direction | null> {
  const { data, error } = await supabase
    .from('directions')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching direction:', error)
    throw new Error('Kon richting niet laden')
  }

  return data
}

export async function getDirectionById(id: string): Promise<Direction | null> {
  const { data, error } = await supabase
    .from('directions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching direction:', error)
    throw new Error('Kon richting niet laden')
  }

  return data
}

export async function getDirectionWithDetails(slug: string): Promise<DirectionWithDetails | null> {
  // Eerst richting ophalen
  const direction = await getDirectionBySlug(slug)
  if (!direction) return null

  // Alle relaties ophalen in parallel
  const [
    competenciesResult,
    traitsResult,
    documentsResult,
    subjectsResult,
    careersResult,
    educationResult,
  ] = await Promise.all([
    // Competenties
    supabase
      .from('direction_competencies')
      .select('*')
      .eq('direction_id', direction.id)
      .order('order', { ascending: true }),

    // Eigenschappen
    supabase
      .from('direction_traits')
      .select('*')
      .eq('direction_id', direction.id)
      .order('order', { ascending: true }),

    // Documenten
    supabase
      .from('direction_documents')
      .select('*')
      .eq('direction_id', direction.id)
      .order('order', { ascending: true }),

    // Vakken met subject data
    supabase
      .from('direction_subjects')
      .select(`
        *,
        subject:subjects (*)
      `)
      .eq('direction_id', direction.id)
      .order('order', { ascending: true }),

    // Beroepen met career data
    supabase
      .from('direction_careers')
      .select(`
        *,
        career:careers (*)
      `)
      .eq('direction_id', direction.id)
      .order('order', { ascending: true }),

    // Opleidingen met education data
    supabase
      .from('direction_education')
      .select(`
        *,
        education:further_education (*)
      `)
      .eq('direction_id', direction.id)
      .order('order', { ascending: true }),
  ])

  // Vakken splitsen in required en optional
  const allSubjects = (subjectsResult.data || []) as (DirectionSubject & { subject: Subject })[]
  const requiredSubjects = allSubjects.filter(s => s.type === 'required')
  const optionalSubjects = allSubjects.filter(s => s.type === 'optional')

  return {
    ...direction,
    competencies: (competenciesResult.data || []) as DirectionCompetency[],
    traits: (traitsResult.data || []) as DirectionTrait[],
    documents: (documentsResult.data || []) as DirectionDocument[],
    subjects: {
      required: requiredSubjects,
      optional: optionalSubjects,
    },
    careers: (careersResult.data || []) as (DirectionCareer & { career: Career })[],
    education: (educationResult.data || []) as (DirectionEducation & { education: FurtherEducation })[],
  }
}

// ============================================
// VAKKEN
// ============================================

export async function getSubjects(): Promise<Subject[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching subjects:', error)
    throw new Error('Kon vakken niet laden')
  }

  return data || []
}

export async function getSubjectById(id: string): Promise<Subject | null> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching subject:', error)
    throw new Error('Kon vak niet laden')
  }

  return data
}

// ============================================
// BEROEPEN
// ============================================

export async function getCareers(): Promise<Career[]> {
  const { data, error } = await supabase
    .from('careers')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching careers:', error)
    throw new Error('Kon beroepen niet laden')
  }

  return data || []
}

export async function getCareerById(id: string): Promise<Career | null> {
  const { data, error } = await supabase
    .from('careers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching career:', error)
    throw new Error('Kon beroep niet laden')
  }

  return data
}

// ============================================
// OPLEIDINGEN
// ============================================

export async function getFurtherEducation(): Promise<FurtherEducation[]> {
  const { data, error } = await supabase
    .from('further_education')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching education:', error)
    throw new Error('Kon opleidingen niet laden')
  }

  return data || []
}

export async function getFurtherEducationById(id: string): Promise<FurtherEducation | null> {
  const { data, error } = await supabase
    .from('further_education')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching education:', error)
    throw new Error('Kon opleiding niet laden')
  }

  return data
}

// ============================================
// ADMIN: COMPETENTIES
// ============================================

export async function getCompetenciesByDirection(directionId: string): Promise<DirectionCompetency[]> {
  const { data, error } = await supabase
    .from('direction_competencies')
    .select('*')
    .eq('direction_id', directionId)
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching competencies:', error)
    throw new Error('Kon competenties niet laden')
  }

  return data || []
}

// ============================================
// ADMIN: EIGENSCHAPPEN
// ============================================

export async function getTraitsByDirection(directionId: string): Promise<DirectionTrait[]> {
  const { data, error } = await supabase
    .from('direction_traits')
    .select('*')
    .eq('direction_id', directionId)
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching traits:', error)
    throw new Error('Kon eigenschappen niet laden')
  }

  return data || []
}

// ============================================
// ADMIN: DOCUMENTEN
// ============================================

export async function getDocumentsByDirection(directionId: string): Promise<DirectionDocument[]> {
  const { data, error } = await supabase
    .from('direction_documents')
    .select('*')
    .eq('direction_id', directionId)
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching documents:', error)
    throw new Error('Kon documenten niet laden')
  }

  return data || []
}

// ============================================
// ADMIN: RICHTING VAKKEN
// ============================================

export async function getSubjectsByDirection(directionId: string): Promise<(DirectionSubject & { subject: Subject })[]> {
  const { data, error } = await supabase
    .from('direction_subjects')
    .select(`
      *,
      subject:subjects (*)
    `)
    .eq('direction_id', directionId)
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching direction subjects:', error)
    throw new Error('Kon vakken niet laden')
  }

  return (data || []) as (DirectionSubject & { subject: Subject })[]
}

// ============================================
// ADMIN: RICHTING BEROEPEN
// ============================================

export async function getCareersByDirection(directionId: string): Promise<(DirectionCareer & { career: Career })[]> {
  const { data, error } = await supabase
    .from('direction_careers')
    .select(`
      *,
      career:careers (*)
    `)
    .eq('direction_id', directionId)
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching direction careers:', error)
    throw new Error('Kon beroepen niet laden')
  }

  return (data || []) as (DirectionCareer & { career: Career })[]
}

// ============================================
// ADMIN: RICHTING OPLEIDINGEN
// ============================================

export async function getEducationByDirection(directionId: string): Promise<(DirectionEducation & { education: FurtherEducation })[]> {
  const { data, error } = await supabase
    .from('direction_education')
    .select(`
      *,
      education:further_education (*)
    `)
    .eq('direction_id', directionId)
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching direction education:', error)
    throw new Error('Kon opleidingen niet laden')
  }

  return (data || []) as (DirectionEducation & { education: FurtherEducation })[]
}
