// Types voor School Vakken/Profielen App

export interface Level {
  id: string
  slug: string
  name: string
  description: string | null
  years: number
  order: number
  created_at?: string
  updated_at?: string
}

export interface Profile {
  id: string
  level_id: string
  slug: string
  name: string
  short_name: string
  description: string | null
  color: string
  phase: 'onderbouw' | 'bovenbouw'
  order: number
  created_at?: string
  updated_at?: string
}

// Legacy Subject interface (voor backwards compatibility)
export interface Subject {
  id: string
  slug: string
  name: string
  description: string | null
  level: 'vmbo-b' | 'vmbo-k' | 'mavo' | 'mavo-havo' | 'isk' | 'algemeen'
  years: number[]
  hours_per_week: number
  order: number
  created_at?: string
  updated_at?: string
}

// Nieuwe structuur: Master vak + niveau-varianten
export interface SubjectMaster {
  id: string
  slug: string
  name: string
  icon: string | null
  order: number
  created_at?: string
  updated_at?: string
  variants?: SubjectVariant[]
}

export interface SubjectVariant {
  id: string
  subject_id: string
  level: 'vmbo-b' | 'vmbo-k' | 'mavo' | 'mavo-havo' | 'isk' | 'algemeen'
  description: string | null
  years: number[]
  hours_per_week: number
  created_at?: string
  updated_at?: string
  subject?: SubjectMaster
}

export interface ProfileSubject {
  id: string
  profile_id: string
  subject_variant_id: string
  type: 'required' | 'optional'
  order: number
  variant?: SubjectVariant
}

export interface Career {
  id: string
  name: string
  description: string | null
  order: number
  created_at?: string
  updated_at?: string
}

export interface FurtherEducation {
  id: string
  name: string
  type: 'mbo' | 'hbo' | 'wo' | 'havo' | 'regulier' | null
  url: string | null
  description: string | null
  order: number
  created_at?: string
  updated_at?: string
}

// Joined types
export interface ProfileWithLevel extends Profile {
  level: Level
}

export interface ProfileWithDetails extends Profile {
  level: Level
  subjects: (ProfileSubject & { variant: SubjectVariant & { subject: SubjectMaster } })[]
  careers: Career[]
  further_education: FurtherEducation[]
}

export interface LevelWithProfiles extends Level {
  profiles: Profile[]
}

