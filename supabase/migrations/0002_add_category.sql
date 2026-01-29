-- ============================================================================
-- Add category field to directions table
-- ============================================================================
-- Categories allow grouping directions on the homepage:
-- 'dp' = Dienstverlening & Producten richtingen (default)
-- 'mavo' = Mavo routes
-- ============================================================================

ALTER TABLE public.directions
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'dp'
CHECK (category IN ('dp', 'mavo'));

CREATE INDEX IF NOT EXISTS idx_directions_category ON public.directions(category);

COMMENT ON COLUMN public.directions.category IS 'Direction category: dp (D&P richtingen) or mavo (Mavo routes)';
