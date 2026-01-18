import { supabase } from './supabaseClient'
import type {
  Level,
  Profile,
  Subject,
  SubjectMaster,
  SubjectVariant,
  Career,
  FurtherEducation,
  LevelWithProfiles,
  ProfileWithDetails,
} from './types'

// Data functies voor Levels, Profielen, Vakken, etc.

export async function getLevels(): Promise<Level[]> {
  const { data, error } = await supabase
    .from('levels')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching levels:', error)
    throw new Error('Kon niveaus niet laden')
  }

  return data || []
}

export async function getLevelBySlug(slug: string): Promise<Level | null> {
  const { data, error } = await supabase
    .from('levels')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching level:', error)
    throw new Error('Kon niveau niet laden')
  }

  return data
}

export async function getLevelWithProfiles(slug: string): Promise<LevelWithProfiles | null> {
  const { data, error } = await supabase
    .from('levels')
    .select(`
      *,
      profiles (*)
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching level with profiles:', error)
    throw new Error('Kon niveau niet laden')
  }

  return data as LevelWithProfiles
}

export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching profiles:', error)
    throw new Error('Kon profielen niet laden')
  }

  return data || []
}

export async function getProfilesByLevel(levelId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('level_id', levelId)
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching profiles:', error)
    throw new Error('Kon profielen niet laden')
  }

  return data || []
}

export async function getProfileWithDetails(
  levelSlug: string,
  profileSlug: string
): Promise<ProfileWithDetails | null> {
  // Eerst level ophalen
  const level = await getLevelBySlug(levelSlug)
  if (!level) return null

  // Dan profiel ophalen
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('level_id', level.id)
    .eq('slug', profileSlug)
    .single()

  if (profileError || !profile) {
    if (profileError?.code === 'PGRST116') return null
    console.error('Error fetching profile:', profileError)
    throw new Error('Kon profiel niet laden')
  }

  // Alle relaties ophalen in parallel
  const [subjectsResult, careersResult, educationResult] = await Promise.all([
    // Vakken via koppeltabel met nieuwe structuur
    supabase
      .from('profile_subjects')
      .select(`
        *,
        variant:subject_variants (
          *,
          subject:subjects_master (*)
        )
      `)
      .eq('profile_id', profile.id)
      .order('order', { ascending: true }),

    // Beroepen via koppeltabel
    supabase
      .from('profile_careers')
      .select(`
        career:careers (*)
      `)
      .eq('profile_id', profile.id),

    // Vervolgopleidingen via koppeltabel
    supabase
      .from('profile_further_education')
      .select(`
        education:further_education (*)
      `)
      .eq('profile_id', profile.id),
  ])

  // Data transformeren
  const subjects = (subjectsResult.data || []).map(ps => ({
    ...ps,
    variant: ps.variant as SubjectVariant & { subject: SubjectMaster }
  }))

  const careers = (careersResult.data || [])
    .map(pc => pc.career as unknown as Career)
    .filter((c): c is Career => Boolean(c))
    .sort((a, b) => a.order - b.order)

  const furtherEducation = (educationResult.data || [])
    .map(pe => pe.education as unknown as FurtherEducation)
    .filter((e): e is FurtherEducation => Boolean(e))
    .sort((a, b) => a.order - b.order)

  return {
    ...profile,
    level,
    subjects,
    careers,
    further_education: furtherEducation,
  }
}

export async function getSubjects(level?: string): Promise<Subject[]> {
  let query = supabase
    .from('subjects_v2')
    .select('*')
    .order('order', { ascending: true })

  if (level) {
    query = query.eq('level', level)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching subjects:', error)
    throw new Error('Kon vakken niet laden')
  }

  return data || []
}

export async function getSubjectBySlug(slug: string, level: string): Promise<Subject | null> {
  const { data, error } = await supabase
    .from('subjects_v2')
    .select('*')
    .eq('slug', slug)
    .eq('level', level)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching subject:', error)
    throw new Error('Kon vak niet laden')
  }

  return data
}

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

// ============================================
// Nieuwe functies voor Master Vakken + Varianten
// ============================================

export async function getSubjectsMaster(): Promise<(SubjectMaster & { variant_count: number })[]> {
  const { data, error } = await supabase
    .from('subjects_master')
    .select(`
      *,
      variants:subject_variants (id)
    `)
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching subjects master:', error)
    throw new Error('Kon vakken niet laden')
  }

  // Tel varianten
  return (data || []).map(subject => ({
    ...subject,
    variant_count: subject.variants?.length || 0,
    variants: undefined // Verwijder raw variants array
  }))
}

export async function getSubjectMasterById(id: string): Promise<SubjectMaster | null> {
  const { data, error } = await supabase
    .from('subjects_master')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching subject master:', error)
    throw new Error('Kon vak niet laden')
  }

  return data
}

export async function getSubjectWithVariants(id: string): Promise<(SubjectMaster & { variants: SubjectVariant[] }) | null> {
  const { data, error } = await supabase
    .from('subjects_master')
    .select(`
      *,
      variants:subject_variants (*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching subject with variants:', error)
    throw new Error('Kon vak niet laden')
  }

  return data as SubjectMaster & { variants: SubjectVariant[] }
}

export async function getSubjectVariantsForLevel(level: string): Promise<(SubjectVariant & { subject: SubjectMaster })[]> {
  const { data, error } = await supabase
    .from('subject_variants')
    .select(`
      *,
      subject:subjects_master (*)
    `)
    .eq('level', level)

  if (error) {
    console.error('Error fetching variants for level:', error)
    throw new Error('Kon vakken voor niveau niet laden')
  }

  return (data || []) as (SubjectVariant & { subject: SubjectMaster })[]
}

