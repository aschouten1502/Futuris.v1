-- ============================================================================
-- Futuris Bovenbouw Info-App - Initial Database Migration
-- ============================================================================
-- This migration creates the core content tables for the Futuris app.
-- Public users can read all content, only authenticated admins can write.
-- ============================================================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. TRACKS TABLE
-- ============================================================================
CREATE TABLE public.tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    intro TEXT NOT NULL,
    what_you_learn TEXT NOT NULL,
    image_url TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for slug lookups (already unique, but explicit for clarity)
CREATE INDEX idx_tracks_slug ON public.tracks(slug);
CREATE INDEX idx_tracks_order ON public.tracks("order");

COMMENT ON TABLE public.tracks IS 'Educational tracks/profiles (e.g., Tech, Health, Arts)';

-- ============================================================================
-- 2. SUBJECTS TABLE
-- ============================================================================
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('required', 'optional')),
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subjects_track_id ON public.subjects(track_id);
CREATE INDEX idx_subjects_order ON public.subjects("order");

COMMENT ON TABLE public.subjects IS 'Subjects/courses within a track';
COMMENT ON COLUMN public.subjects.type IS 'Either required or optional';

-- ============================================================================
-- 3. PATHWAYS TABLE
-- ============================================================================
CREATE TABLE public.pathways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pathways_track_id ON public.pathways(track_id);
CREATE INDEX idx_pathways_order ON public.pathways("order");

COMMENT ON TABLE public.pathways IS 'Follow-up education pathways after completing a track';

-- ============================================================================
-- 4. COMPETENCIES TABLE
-- ============================================================================
CREATE TABLE public.competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_competencies_track_id ON public.competencies(track_id);
CREATE INDEX idx_competencies_order ON public.competencies("order");

COMMENT ON TABLE public.competencies IS 'Skills and competencies developed in a track';

-- ============================================================================
-- 5. JOBS TABLE
-- ============================================================================
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_track_id ON public.jobs(track_id);
CREATE INDEX idx_jobs_order ON public.jobs("order");

COMMENT ON TABLE public.jobs IS 'Career opportunities related to a track';

-- ============================================================================
-- 6. UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all content tables
CREATE TRIGGER set_updated_at_tracks
    BEFORE UPDATE ON public.tracks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_subjects
    BEFORE UPDATE ON public.subjects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_pathways
    BEFORE UPDATE ON public.pathways
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_competencies
    BEFORE UPDATE ON public.competencies
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_jobs
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- PUBLIC READ POLICIES (anon + authenticated can SELECT)
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can read tracks"
    ON public.tracks FOR SELECT
    USING (true);

CREATE POLICY "Public can read subjects"
    ON public.subjects FOR SELECT
    USING (true);

CREATE POLICY "Public can read pathways"
    ON public.pathways FOR SELECT
    USING (true);

CREATE POLICY "Public can read competencies"
    ON public.competencies FOR SELECT
    USING (true);

CREATE POLICY "Public can read jobs"
    ON public.jobs FOR SELECT
    USING (true);

-- ----------------------------------------------------------------------------
-- ADMIN WRITE POLICIES (only authenticated users can INSERT/UPDATE/DELETE)
-- ----------------------------------------------------------------------------

-- TRACKS
CREATE POLICY "Admins can insert tracks"
    ON public.tracks FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can update tracks"
    ON public.tracks FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can delete tracks"
    ON public.tracks FOR DELETE
    TO authenticated
    USING (true);

-- SUBJECTS
CREATE POLICY "Admins can insert subjects"
    ON public.subjects FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can update subjects"
    ON public.subjects FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can delete subjects"
    ON public.subjects FOR DELETE
    TO authenticated
    USING (true);

-- PATHWAYS
CREATE POLICY "Admins can insert pathways"
    ON public.pathways FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can update pathways"
    ON public.pathways FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can delete pathways"
    ON public.pathways FOR DELETE
    TO authenticated
    USING (true);

-- COMPETENCIES
CREATE POLICY "Admins can insert competencies"
    ON public.competencies FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can update competencies"
    ON public.competencies FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can delete competencies"
    ON public.competencies FOR DELETE
    TO authenticated
    USING (true);

-- JOBS
CREATE POLICY "Admins can insert jobs"
    ON public.jobs FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can update jobs"
    ON public.jobs FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can delete jobs"
    ON public.jobs FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
