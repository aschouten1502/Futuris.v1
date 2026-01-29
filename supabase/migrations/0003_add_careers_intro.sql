-- ============================================================================
-- Add careers_intro field to directions table
-- ============================================================================
-- This field stores a CMS-editable intro text for the "Wat kun je later doen
-- of worden?" section on direction detail pages. Each direction can have its
-- own intro paragraph describing the career/education paths.
-- ============================================================================

ALTER TABLE public.directions
ADD COLUMN IF NOT EXISTS careers_intro TEXT;

COMMENT ON COLUMN public.directions.careers_intro IS 'Intro text for the careers/education section on direction detail pages';
