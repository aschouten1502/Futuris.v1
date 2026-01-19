// Types voor Futuris D&P Richtingen App

// ============================================
// BASIS TYPES
// ============================================

export interface Direction {
  id: string
  slug: string
  name: string
  short_description: string | null
  full_description: string | null
  video_url: string | null
  image_url: string | null
  color: string
  icon: string | null
  order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface DirectionCompetency {
  id: string
  direction_id: string
  title: string
  description: string | null
  icon: string | null
  order: number
}

export interface DirectionTrait {
  id: string
  direction_id: string
  trait: string
  order: number
}

export interface DirectionDocument {
  id: string
  direction_id: string
  title: string
  url: string
  type: string
  order: number
}

export interface Subject {
  id: string
  name: string
  description: string | null
  icon: string | null
  learning_goals: string | null
  topics: string | null
  order: number
  created_at?: string
  updated_at?: string
}

export interface DirectionSubject {
  id: string
  direction_id: string
  subject_id: string
  type: 'required' | 'optional'
  hours_per_week: number
  notes: string | null
  order: number
  subject?: Subject
}

export interface Career {
  id: string
  name: string
  description: string | null
  icon: string | null
  order: number
  created_at?: string
  updated_at?: string
}

export interface DirectionCareer {
  id: string
  direction_id: string
  career_id: string
  order: number
  career?: Career
}

export interface FurtherEducation {
  id: string
  name: string
  type: 'mbo' | 'hbo' | 'wo' | null
  description: string | null
  institution: string | null
  url: string | null
  order: number
  created_at?: string
  updated_at?: string
}

export interface DirectionEducation {
  id: string
  direction_id: string
  education_id: string
  order: number
  education?: FurtherEducation
}

// ============================================
// JOINED TYPES (voor detail pagina's)
// ============================================

export interface DirectionWithDetails extends Direction {
  competencies: DirectionCompetency[]
  traits: DirectionTrait[]
  documents: DirectionDocument[]
  subjects: {
    required: (DirectionSubject & { subject: Subject })[]
    optional: (DirectionSubject & { subject: Subject })[]
  }
  careers: (DirectionCareer & { career: Career })[]
  education: (DirectionEducation & { education: FurtherEducation })[]
}

// ============================================
// ADMIN FORM TYPES
// ============================================

export interface DirectionFormData {
  name: string
  slug: string
  short_description: string
  full_description: string
  video_url: string
  image_url: string
  color: string
  icon: string
  order: number
  is_active: boolean
}

export interface CompetencyFormData {
  title: string
  description: string
  icon: string
}

export interface SubjectFormData {
  name: string
  description: string
  icon: string
  learning_goals: string
  topics: string
}

export interface CareerFormData {
  name: string
  description: string
  icon: string
}

export interface EducationFormData {
  name: string
  type: 'mbo' | 'hbo' | 'wo'
  description: string
  institution: string
  url: string
}
