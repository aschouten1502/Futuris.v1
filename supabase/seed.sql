-- ============================================================================
-- Futuris Bovenbouw Info-App - Seed Data
-- ============================================================================
-- This file contains example content for 4 tracks with related data.
-- Run this AFTER the migration has been applied.
-- ============================================================================

-- Clear existing data (optional, useful for re-seeding)
TRUNCATE public.jobs, public.competencies, public.pathways, public.subjects, public.tracks CASCADE;

-- ============================================================================
-- TRACKS
-- ============================================================================
INSERT INTO public.tracks (id, slug, title, intro, what_you_learn, image_url, "order") VALUES
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'gezondheid-bewegen',
    'Gezondheid & Bewegen',
    'Ben jij geïnteresseerd in sport, gezondheid en het menselijk lichaam? In dit profiel leer je alles over beweging, voeding en welzijn. Je ontwikkelt vaardigheden om anderen te helpen gezonder te leven.',
    'Je leert over anatomie, fysiologie, sportbegeleiding, voedingsleer en gezondheidspreventie. Ook ontwikkel je praktische vaardigheden in het begeleiden van sportactiviteiten en het geven van gezondheidsadvies.',
    '/images/tracks/gezondheid-bewegen.jpg',
    1
),
(
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'kunst-cultuur',
    'Kunst & Cultuur',
    'Heb jij een creatieve geest en interesse in kunst, muziek, theater of design? Dit profiel biedt je de ruimte om je artistieke talenten te ontwikkelen en te ontdekken hoe cultuur onze wereld vormt.',
    'Je leert verschillende kunstvormen kennen zoals beeldende kunst, muziek, theater en dans. Je ontwikkelt je eigen creatieve stem, leert presenteren en werkt samen aan culturele projecten.',
    '/images/tracks/kunst-cultuur.jpg',
    2
),
(
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'tech',
    'Tech',
    'Fascineert technologie jou? Van programmeren tot robotica, van AI tot cybersecurity - in dit profiel duik je in de wereld van technologie en leer je de digitale toekomst mede te vormen.',
    'Je leert programmeren in verschillende talen, werkt met hardware en software, ontdekt hoe netwerken werken en maakt kennis met moderne technologieën zoals AI, cloud computing en IoT.',
    '/images/tracks/tech.jpg',
    3
),
(
    'd4e5f6a7-b8c9-0123-defa-234567890123',
    'horeca',
    'Horeca',
    'Hou je van koken, gastvrijheid en het creëren van bijzondere ervaringen? In dit profiel leer je alle aspecten van de horeca, van keuken tot bediening, van evenementen tot ondernemerschap.',
    'Je leert kooktechnieken, gastheerschap, food & beverage management, evenementenorganisatie en de basis van horecaondernemerschap. Praktijkervaring staat centraal.',
    '/images/tracks/horeca.jpg',
    4
);

-- ============================================================================
-- SUBJECTS - Gezondheid & Bewegen
-- ============================================================================
INSERT INTO public.subjects (track_id, title, type, "order") VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Biologie', 'required', 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lichamelijke Opvoeding (LO2)', 'required', 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Verzorging', 'required', 3),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Wiskunde', 'required', 4),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Scheikunde', 'optional', 5),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Maatschappijleer', 'optional', 6);

-- SUBJECTS - Kunst & Cultuur
INSERT INTO public.subjects (track_id, title, type, "order") VALUES
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Beeldende Vorming', 'required', 1),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Muziek', 'required', 2),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Drama', 'required', 3),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Nederlands', 'required', 4),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Geschiedenis', 'optional', 5),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'CKV', 'optional', 6);

-- SUBJECTS - Tech
INSERT INTO public.subjects (track_id, title, type, "order") VALUES
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Informatica', 'required', 1),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Wiskunde B', 'required', 2),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Natuurkunde', 'required', 3),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Engels', 'required', 4),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Scheikunde', 'optional', 5),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Economie', 'optional', 6);

-- SUBJECTS - Horeca
INSERT INTO public.subjects (track_id, title, type, "order") VALUES
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Consumptief', 'required', 1),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Economie', 'required', 2),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Engels', 'required', 3),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Nederlands', 'required', 4),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Duits', 'optional', 5),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Wiskunde', 'optional', 6);

-- ============================================================================
-- PATHWAYS - Gezondheid & Bewegen
-- ============================================================================
INSERT INTO public.pathways (track_id, title, url, "order") VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'MBO Sport en Bewegen', 'https://www.rocmondriaan.nl/opleidingen/sport-en-bewegen', 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'MBO Verpleegkunde', 'https://www.rocmondriaan.nl/opleidingen/verpleegkunde', 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'HBO Fysiotherapie', 'https://www.hhs.nl/opleidingen/fysiotherapie', 3),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'HBO Sportkunde', 'https://www.hhs.nl/opleidingen/sportkunde', 4);

-- PATHWAYS - Kunst & Cultuur
INSERT INTO public.pathways (track_id, title, url, "order") VALUES
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'MBO Mediavormgever', 'https://www.grafisch-lyceum.nl/opleidingen/mediavormgever', 1),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Kunstacademie (HBO)', 'https://www.kabk.nl/', 2),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Conservatorium', 'https://www.koncon.nl/', 3),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Theaterschool', 'https://www.atd.ahk.nl/', 4);

-- PATHWAYS - Tech
INSERT INTO public.pathways (track_id, title, url, "order") VALUES
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'MBO Software Developer', 'https://www.rocmondriaan.nl/opleidingen/software-developer', 1),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'HBO Informatica', 'https://www.hhs.nl/opleidingen/informatica', 2),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'HBO Technische Informatica', 'https://www.tudelft.nl/onderwijs/opleidingen/bachelors/ti', 3),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'WO Computer Science', 'https://www.tudelft.nl/onderwijs/opleidingen/bachelors/cs', 4);

-- PATHWAYS - Horeca
INSERT INTO public.pathways (track_id, title, url, "order") VALUES
('d4e5f6a7-b8c9-0123-defa-234567890123', 'MBO Kok', 'https://www.rocmondriaan.nl/opleidingen/kok', 1),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'MBO Gastheer/Gastvrouw', 'https://www.rocmondriaan.nl/opleidingen/gastheer-gastvrouw', 2),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'MBO Horecaondernemer', 'https://www.rocmondriaan.nl/opleidingen/horecaondernemer', 3),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'HBO Hotelmanagement', 'https://www.hotelschool.nl/', 4);

-- ============================================================================
-- COMPETENCIES - Gezondheid & Bewegen
-- ============================================================================
INSERT INTO public.competencies (track_id, title, description, "order") VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sportbegeleiding', 'Je kunt sportactiviteiten organiseren en begeleiden voor verschillende doelgroepen.', 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Gezondheidsadvies', 'Je kunt advies geven over gezonde leefstijl, voeding en beweging.', 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'EHBO', 'Je beheerst basale eerste hulp en kunt adequaat handelen bij blessures.', 3),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Anatomische kennis', 'Je begrijpt hoe het menselijk lichaam werkt en hoe beweging hierop invloed heeft.', 4);

-- COMPETENCIES - Kunst & Cultuur
INSERT INTO public.competencies (track_id, title, description, "order") VALUES
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Creatief denken', 'Je kunt originele ideeën ontwikkelen en deze vertalen naar kunstuitingen.', 1),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Presenteren', 'Je kunt je werk en ideeën overtuigend presenteren aan een publiek.', 2),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Samenwerken', 'Je kunt effectief samenwerken in creatieve projecten en producties.', 3),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Cultureel bewustzijn', 'Je hebt kennis van kunstgeschiedenis en culturele stromingen.', 4);

-- COMPETENCIES - Tech
INSERT INTO public.competencies (track_id, title, description, "order") VALUES
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Programmeren', 'Je kunt code schrijven in meerdere programmeertalen zoals Python, JavaScript en Java.', 1),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Probleemoplossend denken', 'Je kunt complexe technische problemen analyseren en oplossen.', 2),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Systeemdenken', 'Je begrijpt hoe verschillende technische componenten samenwerken.', 3),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Cybersecurity bewustzijn', 'Je begrijpt de basisprincipes van digitale veiligheid.', 4);

-- COMPETENCIES - Horeca
INSERT INTO public.competencies (track_id, title, description, "order") VALUES
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Gastvrijheid', 'Je kunt gasten ontvangen en een uitstekende service bieden.', 1),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Kooktechnieken', 'Je beheerst basis- en gevorderde kooktechnieken.', 2),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Stressbestendigheid', 'Je kunt goed functioneren onder druk en in een hectische omgeving.', 3),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Ondernemerschap', 'Je hebt inzicht in bedrijfsvoering en horecamanagement.', 4);

-- ============================================================================
-- JOBS - Gezondheid & Bewegen
-- ============================================================================
INSERT INTO public.jobs (track_id, title, description, "order") VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Fysiotherapeut', 'Help patiënten herstellen van blessures en verbeter hun bewegingsvermogen.', 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Personal Trainer', 'Begeleid mensen naar hun fitnessdoelen met persoonlijke trainingsschema''s.', 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sportleraar', 'Geef les in lichamelijke opvoeding en sport op scholen.', 3),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Verpleegkundige', 'Verzorg patiënten in ziekenhuizen, verpleeghuizen of thuiszorg.', 4),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Diëtist', 'Adviseer mensen over gezonde voeding en behandel voedingsgerelateerde aandoeningen.', 5);

-- JOBS - Kunst & Cultuur
INSERT INTO public.jobs (track_id, title, description, "order") VALUES
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Grafisch Ontwerper', 'Ontwerp visuele concepten voor merken, websites en gedrukte media.', 1),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Muzikant', 'Maak en voer muziek uit als soloartiest of in een band.', 2),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Acteur', 'Vertolk rollen in theater, film, televisie of reclame.', 3),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Curator', 'Stel tentoonstellingen samen en beheer kunstcollecties.', 4),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Docent Kunst', 'Geef kunstlessen op scholen of in culturele instellingen.', 5);

-- JOBS - Tech
INSERT INTO public.jobs (track_id, title, description, "order") VALUES
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Software Developer', 'Ontwikkel applicaties en systemen voor web, mobile of desktop.', 1),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Data Scientist', 'Analyseer grote datasets en ontwikkel AI/ML modellen.', 2),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Cybersecurity Specialist', 'Bescherm systemen en netwerken tegen digitale dreigingen.', 3),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'DevOps Engineer', 'Beheer cloud infrastructuur en automatiseer deployment processen.', 4),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'UX Designer', 'Ontwerp gebruiksvriendelijke digitale producten en interfaces.', 5);

-- JOBS - Horeca
INSERT INTO public.jobs (track_id, title, description, "order") VALUES
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Chef-kok', 'Leid een keuken en creëer culinaire gerechten.', 1),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Restaurant Manager', 'Beheer de dagelijkse operatie van een restaurant.', 2),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Barista', 'Bereid koffie en andere dranken in een café of koffiebar.', 3),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Hotelmanager', 'Leid de operatie van een hotel en zorg voor gasttevredenheid.', 4),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Event Planner', 'Organiseer evenementen zoals bruiloften, conferenties en feesten.', 5);

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
