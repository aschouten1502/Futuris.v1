-- ============================================================================
-- Futuris: Category kolom + Huisstijl kleuren + Mavo routes + Kunst & Media
-- ============================================================================
-- Voer dit script uit in de Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/wewrzvrlhdeaakjyvpjs/sql
-- ============================================================================

-- 1. Category kolom toevoegen
ALTER TABLE public.directions
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'dp'
CHECK (category IN ('dp', 'mavo'));

CREATE INDEX IF NOT EXISTS idx_directions_category ON public.directions(category);

-- 2. Richtingkleuren corrigeren naar huisstijl
UPDATE public.directions SET color = '#4B9D9E'
WHERE slug = 'gezondheid-en-bewegen';

UPDATE public.directions SET color = '#F3D835'
WHERE slug = 'tech';

UPDATE public.directions SET color = '#D26D6F'
WHERE slug = 'horeca';

-- 3. Kunst en Cultuur hernoemen naar Kunst & Media + kleur
UPDATE public.directions
SET color = '#C12179', name = 'Kunst & Media', slug = 'kunst-media'
WHERE slug = 'kunst-en-cultuur';

-- 4. Mavo routes invoegen
INSERT INTO public.directions
  (slug, name, short_description, full_description, color, icon, "order", is_active, category)
VALUES
  ('mavo-mbo-route', 'Mavo MBO-route',
   'De route voor leerlingen die na de mavo naar het MBO willen.',
   'De MBO-route bereidt je voor op een vervolgopleiding op het MBO. Je leert praktische vaardigheden en maakt kennis met verschillende beroepsrichtingen. Deze route past bij je als je graag hands-on werkt en snel aan de slag wilt in een beroep.',
   '#D2D1DB', '🎯', 5, true, 'mavo'),
  ('mavo-havo-route', 'Mavo HAVO-route',
   'De route voor leerlingen die na de mavo naar de HAVO willen.',
   'De HAVO-route bereidt je voor op doorstroom naar de HAVO. Je werkt aan vakken op een hoger niveau en ontwikkelt studievaardigheden die je nodig hebt voor het HAVO. Deze route past bij je als je graag doorleert en een HBO-opleiding wilt doen.',
   '#D2D1DB', '📐', 6, true, 'mavo');

-- 5. Kunst & Media traits toevoegen
INSERT INTO public.direction_traits (direction_id, trait, "order")
SELECT id, t.trait, t.ord FROM public.directions
CROSS JOIN (VALUES
  ('Creatief bezig zijn met kunst en media', 1),
  ('Ontwerpen, tekenen en vormgeven', 2),
  ('Werken met foto en video', 3),
  ('Optreden, presenteren en ontwerpen', 4),
  ('Je ideeën laten zien aan anderen', 5)
) AS t(trait, ord)
WHERE slug = 'kunst-media';

-- 6. Kunst & Media competenties toevoegen
INSERT INTO public.direction_competencies (direction_id, title, description, icon, "order")
SELECT id, t.title, t.descr, t.icon, t.ord FROM public.directions
CROSS JOIN (VALUES
  ('Creatief denken', 'Originele ideeën ontwikkelen en vertalen naar kunstuitingen', '🎨', 1),
  ('Mediaproductie', 'Werken met digitale media, video en grafisch ontwerp', '🎬', 2),
  ('Presenteren', 'Je werk en ideeën overtuigend presenteren', '🎤', 3),
  ('Cultureel bewustzijn', 'Kennis van kunstgeschiedenis en culturele stromingen', '🏛️', 4)
) AS t(title, descr, icon, ord)
WHERE slug = 'kunst-media';

-- 7. Verificatie
SELECT name, slug, color, category, is_active FROM public.directions ORDER BY "order";
