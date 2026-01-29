-- ============================================================================
-- Futuris Bovenbouw Info-App — Seed Data
-- ============================================================================
-- Schema: directions-based model met junction tables
-- 6 richtingen: 4 D&P + 2 Mavo met huisstijl kleuren
-- Run dit NA alle migraties zijn toegepast.
-- ============================================================================

-- Opruimen bestaande data (veilig voor re-seeding)
TRUNCATE TABLE public.direction_education, public.direction_careers, public.direction_subjects,
         public.direction_documents, public.direction_traits, public.direction_competencies,
         public.further_education, public.careers, public.subjects, public.directions CASCADE;

-- ============================================================================
-- DIRECTIONS (6 richtingen)
-- ============================================================================
INSERT INTO public.directions (id, slug, name, short_description, full_description, video_url, image_url, color, icon, "order", is_active, category, careers_intro) VALUES

-- D&P Richtingen
(
  'a1b2c3d4-0001-4000-8000-000000000001',
  'gezondheid-en-bewegen',
  'Gezondheid & Bewegen',
  'Sport, gezondheid en het menselijk lichaam',
  'Ben jij geïnteresseerd in sport, gezondheid en het menselijk lichaam? In deze richting leer je alles over beweging, voeding en welzijn. Je ontwikkelt vaardigheden om anderen te helpen gezonder te leven. Van sportbegeleiding tot gezondheidsadvies — je ontdekt hoe je met je passie voor bewegen het verschil kunt maken.',
  NULL,
  NULL,
  '#4B9D9E',
  '💪',
  1,
  true,
  'dp',
  NULL
),
(
  'a1b2c3d4-0002-4000-8000-000000000002',
  'kunst-media',
  'Kunst & Media',
  'Creatief bezig zijn met kunst, design en media',
  'Voor leerlingen met creatieve talenten en/of interesse in beeldende kunst, podiumkunst, media of vormgeving.',
  NULL,
  NULL,
  '#C12179',
  '🎨',
  2,
  true,
  'dp',
  'Je kunt kiezen voor een vervolgopleiding die te maken heeft met media, mode of (podium)kunst en opgeleid worden tot bijvoorbeeld ontwerper, vormgever of conceptontwikkelaar.'
),
(
  'a1b2c3d4-0003-4000-8000-000000000003',
  'tech',
  'Tech',
  'Technologie, programmeren en digitale innovatie',
  'Fascineert technologie jou? Van programmeren tot robotica, van AI tot cybersecurity — in deze richting duik je in de wereld van technologie. Je leert programmeren, werkt met hardware en software, en maakt kennis met moderne technologieën. Ontdek hoe jij de digitale toekomst mede kunt vormen.',
  NULL,
  NULL,
  '#F3D835',
  '💻',
  3,
  true,
  'dp',
  NULL
),
(
  'a1b2c3d4-0004-4000-8000-000000000004',
  'horeca',
  'Horeca',
  'Koken, gastvrijheid en evenementen',
  'Hou je van koken, gastvrijheid en het creëren van bijzondere ervaringen? In deze richting leer je alle aspecten van de horeca. Van keuken tot bediening, van evenementen tot ondernemerschap. Je ontwikkelt praktische vaardigheden en leert wat het betekent om gasten een onvergetelijke ervaring te bieden.',
  NULL,
  NULL,
  '#D26D6F',
  '🍳',
  4,
  true,
  'dp',
  NULL
),

-- Mavo Routes
(
  'a1b2c3d4-0005-4000-8000-000000000005',
  'mavo-mbo-route',
  'Mavo MBO-route',
  'De route voor leerlingen die na de mavo naar het MBO willen',
  'De MBO-route bereidt je voor op een vervolgopleiding op het MBO. Je leert praktische vaardigheden en maakt kennis met verschillende beroepsrichtingen. Deze route is perfect als je na de mavo een praktijkgerichte opleiding wilt volgen.',
  NULL,
  NULL,
  '#D2D1DB',
  '🎯',
  5,
  true,
  'mavo',
  NULL
),
(
  'a1b2c3d4-0006-4000-8000-000000000006',
  'mavo-havo-route',
  'Mavo HAVO-route',
  'De route voor leerlingen die na de mavo naar de HAVO willen',
  'De HAVO-route bereidt je voor op doorstroom naar de HAVO. Je werkt aan vakken op een hoger niveau en ontwikkelt studievaardigheden die je nodig hebt voor de HAVO. Deze route is ideaal als je na de mavo wilt doorleren op een hoger niveau.',
  NULL,
  NULL,
  '#D2D1DB',
  '📐',
  6,
  true,
  'mavo',
  NULL
);

-- ============================================================================
-- DIRECTION TRAITS (eigenschappen per richting)
-- ============================================================================

-- Gezondheid & Bewegen
INSERT INTO public.direction_traits (direction_id, trait, "order") VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'Je bent graag in beweging en houdt van sport', 1),
('a1b2c3d4-0001-4000-8000-000000000001', 'Je wilt leren hoe het menselijk lichaam werkt', 2),
('a1b2c3d4-0001-4000-8000-000000000001', 'Je vindt het leuk om anderen te helpen en te begeleiden', 3),
('a1b2c3d4-0001-4000-8000-000000000001', 'Je bent geïnteresseerd in gezondheid en voeding', 4),
('a1b2c3d4-0001-4000-8000-000000000001', 'Je houdt van samenwerken in teamverband', 5);

-- Kunst & Media
INSERT INTO public.direction_traits (direction_id, trait, "order") VALUES
('a1b2c3d4-0002-4000-8000-000000000002', 'Creatief bezig zijn met kunst en media', 1),
('a1b2c3d4-0002-4000-8000-000000000002', 'Ontwerpen, tekenen en vormgeven', 2),
('a1b2c3d4-0002-4000-8000-000000000002', 'Werken met foto en video', 3),
('a1b2c3d4-0002-4000-8000-000000000002', 'Optreden, presenteren en ontwerpen', 4),
('a1b2c3d4-0002-4000-8000-000000000002', 'Je ideeën laten zien aan anderen', 5);

-- Tech
INSERT INTO public.direction_traits (direction_id, trait, "order") VALUES
('a1b2c3d4-0003-4000-8000-000000000003', 'Je bent nieuwsgierig naar hoe technologie werkt', 1),
('a1b2c3d4-0003-4000-8000-000000000003', 'Je vindt puzzelen en problemen oplossen leuk', 2),
('a1b2c3d4-0003-4000-8000-000000000003', 'Je wilt leren programmeren of robots bouwen', 3),
('a1b2c3d4-0003-4000-8000-000000000003', 'Je bent goed in logisch en analytisch denken', 4),
('a1b2c3d4-0003-4000-8000-000000000003', 'Je wilt werken met computers en digitale tools', 5);

-- Horeca
INSERT INTO public.direction_traits (direction_id, trait, "order") VALUES
('a1b2c3d4-0004-4000-8000-000000000004', 'Je houdt van koken en lekker eten', 1),
('a1b2c3d4-0004-4000-8000-000000000004', 'Je bent gastvrij en vindt het leuk mensen te ontvangen', 2),
('a1b2c3d4-0004-4000-8000-000000000004', 'Je kunt goed samenwerken en bent stressbestendig', 3),
('a1b2c3d4-0004-4000-8000-000000000004', 'Je bent creatief met eten en presentatie', 4),
('a1b2c3d4-0004-4000-8000-000000000004', 'Je droomt van een eigen restaurant of bedrijf', 5);

-- Mavo MBO-route
INSERT INTO public.direction_traits (direction_id, trait, "order") VALUES
('a1b2c3d4-0005-4000-8000-000000000005', 'Je wilt na de mavo een praktische opleiding volgen', 1),
('a1b2c3d4-0005-4000-8000-000000000005', 'Je leert het liefst door te doen', 2),
('a1b2c3d4-0005-4000-8000-000000000005', 'Je wilt snel aan het werk in een beroep', 3),
('a1b2c3d4-0005-4000-8000-000000000005', 'Je bent benieuwd naar verschillende vakgebieden', 4);

-- Mavo HAVO-route
INSERT INTO public.direction_traits (direction_id, trait, "order") VALUES
('a1b2c3d4-0006-4000-8000-000000000006', 'Je wilt na de mavo doorstromen naar de HAVO', 1),
('a1b2c3d4-0006-4000-8000-000000000006', 'Je vindt leren leuk en wilt jezelf uitdagen', 2),
('a1b2c3d4-0006-4000-8000-000000000006', 'Je bent gemotiveerd om op een hoger niveau te werken', 3),
('a1b2c3d4-0006-4000-8000-000000000006', 'Je hebt goede studievaardigheden of wilt die ontwikkelen', 4);

-- ============================================================================
-- DIRECTION COMPETENCIES (competenties per richting)
-- ============================================================================

-- Gezondheid & Bewegen
INSERT INTO public.direction_competencies (direction_id, title, description, icon, "order") VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'Sportbegeleiding', 'Sportactiviteiten organiseren en begeleiden voor verschillende doelgroepen', '🏃', 1),
('a1b2c3d4-0001-4000-8000-000000000001', 'Gezondheidsadvies', 'Advies geven over gezonde leefstijl, voeding en beweging', '🥗', 2),
('a1b2c3d4-0001-4000-8000-000000000001', 'EHBO & Veiligheid', 'Eerste hulp verlenen en veilig werken bij sportactiviteiten', '🩺', 3),
('a1b2c3d4-0001-4000-8000-000000000001', 'Anatomische kennis', 'Begrijpen hoe het menselijk lichaam werkt en hoe beweging hierop invloed heeft', '🧬', 4);

-- Kunst & Media (4 verplichte D&P modules met richtingspecifieke voorbeelden)
INSERT INTO public.direction_competencies (direction_id, title, description, icon, "order") VALUES
('a1b2c3d4-0002-4000-8000-000000000002', 'Organiseren van een activiteit', 'voorstelling, modeshow, dans-, acteer- en zangactiviteiten', '📋', 1),
('a1b2c3d4-0002-4000-8000-000000000002', 'Presenteren & promoten', 'moodboard, modetrends, fotoseries, portfolio', '🎤', 2),
('a1b2c3d4-0002-4000-8000-000000000002', 'Product maken', 'prentenboek, strip, up-/recycled kledingstuk', '✂️', 3),
('a1b2c3d4-0002-4000-8000-000000000002', 'Multimediaal product maken', 'portfolio, digitale tentoonstelling, modevlog', '🖥️', 4);

-- Tech
INSERT INTO public.direction_competencies (direction_id, title, description, icon, "order") VALUES
('a1b2c3d4-0003-4000-8000-000000000003', 'Programmeren', 'Code schrijven in meerdere programmeertalen', '💻', 1),
('a1b2c3d4-0003-4000-8000-000000000003', 'Probleemoplossend denken', 'Complexe technische problemen analyseren en oplossen', '🧩', 2),
('a1b2c3d4-0003-4000-8000-000000000003', 'Systeemdenken', 'Begrijpen hoe technische componenten samenwerken', '⚙️', 3),
('a1b2c3d4-0003-4000-8000-000000000003', 'Cybersecurity bewustzijn', 'Basisprincipes van digitale veiligheid toepassen', '🔒', 4);

-- Horeca
INSERT INTO public.direction_competencies (direction_id, title, description, icon, "order") VALUES
('a1b2c3d4-0004-4000-8000-000000000004', 'Gastvrijheid', 'Gasten ontvangen en uitstekende service bieden', '🤝', 1),
('a1b2c3d4-0004-4000-8000-000000000004', 'Kooktechnieken', 'Basis- en gevorderde kooktechnieken beheersen', '👨‍🍳', 2),
('a1b2c3d4-0004-4000-8000-000000000004', 'Stressbestendigheid', 'Goed functioneren onder druk in een hectische omgeving', '⚡', 3),
('a1b2c3d4-0004-4000-8000-000000000004', 'Ondernemerschap', 'Inzicht in bedrijfsvoering en horecamanagement', '📊', 4);

-- Mavo MBO-route
INSERT INTO public.direction_competencies (direction_id, title, description, icon, "order") VALUES
('a1b2c3d4-0005-4000-8000-000000000005', 'Praktische vaardigheden', 'Hands-on leren en werken in verschillende vakgebieden', '🔧', 1),
('a1b2c3d4-0005-4000-8000-000000000005', 'Beroepsoriëntatie', 'Verschillende beroepen en sectoren verkennen', '🔍', 2),
('a1b2c3d4-0005-4000-8000-000000000005', 'Zelfstandigheid', 'Zelfstandig werken en verantwoordelijkheid nemen', '🎯', 3);

-- Mavo HAVO-route
INSERT INTO public.direction_competencies (direction_id, title, description, icon, "order") VALUES
('a1b2c3d4-0006-4000-8000-000000000006', 'Studievaardigheden', 'Effectief studeren, plannen en organiseren', '📚', 1),
('a1b2c3d4-0006-4000-8000-000000000006', 'Analytisch denken', 'Complexe informatie begrijpen en verwerken', '🧠', 2),
('a1b2c3d4-0006-4000-8000-000000000006', 'Academisch schrijven', 'Duidelijk en gestructureerd schrijven op hoger niveau', '✍️', 3);

-- ============================================================================
-- SUBJECTS (vakken — standalone tabel)
-- ============================================================================
INSERT INTO public.subjects (id, name, description, icon, "order") VALUES
('b1000000-0001-4000-8000-000000000001', 'Biologie', 'Het menselijk lichaam, natuur en gezondheid', '🧬', 1),
('b1000000-0002-4000-8000-000000000002', 'Lichamelijke Opvoeding (LO2)', 'Verdieping in sport en bewegingsonderwijs', '🏃', 2),
('b1000000-0003-4000-8000-000000000003', 'Verzorging', 'Gezondheid, welzijn en zorg', '🩺', 3),
('b1000000-0004-4000-8000-000000000004', 'Wiskunde', 'Rekenen, logica en wiskundig denken', '📐', 4),
('b1000000-0005-4000-8000-000000000005', 'Scheikunde', 'Stoffen, reacties en materialen', '⚗️', 5),
('b1000000-0006-4000-8000-000000000006', 'Maatschappijleer', 'Samenleving, politiek en burgerschap', '🏛️', 6),
('b1000000-0007-4000-8000-000000000007', 'Beeldende Vorming', 'Tekenen, schilderen en beeldhouwen', '🎨', 7),
('b1000000-0008-4000-8000-000000000008', 'Muziek', 'Muziektheorie en muziek maken', '🎵', 8),
('b1000000-0009-4000-8000-000000000009', 'Drama', 'Theater, presenteren en performance', '🎭', 9),
('b1000000-0010-4000-8000-000000000010', 'Nederlands', 'Taalvaardigheid, literatuur en communicatie', '📝', 10),
('b1000000-0011-4000-8000-000000000011', 'Geschiedenis', 'Historisch bewustzijn en oriëntatie', '📜', 11),
('b1000000-0012-4000-8000-000000000012', 'CKV', 'Culturele en kunstzinnige vorming', '🎪', 12),
('b1000000-0013-4000-8000-000000000013', 'Informatica', 'Programmeren, netwerken en digitale systemen', '💻', 13),
('b1000000-0014-4000-8000-000000000014', 'Wiskunde B', 'Wiskundig denken op hoog niveau', '🔢', 14),
('b1000000-0015-4000-8000-000000000015', 'Natuurkunde', 'Fysica, energie en mechanica', '⚡', 15),
('b1000000-0016-4000-8000-000000000016', 'Engels', 'Engelse taalvaardigheid en literatuur', '🇬🇧', 16),
('b1000000-0017-4000-8000-000000000017', 'Economie', 'Economisch denken, ondernemen en financiën', '📊', 17),
('b1000000-0018-4000-8000-000000000018', 'Consumptief', 'Voeding, koken en horecatechniek', '🍳', 18),
('b1000000-0019-4000-8000-000000000019', 'Duits', 'Duitse taalvaardigheid en cultuur', '🇩🇪', 19),
('b1000000-0020-4000-8000-000000000020', 'Frans', 'Franse taalvaardigheid en cultuur', '🇫🇷', 20),
-- Nieuwe vakken voor D&P Kunst & Media
('b1000000-0021-4000-8000-000000000021', 'Tekenen, schilderen en illustreren', 'Beeldende technieken en visuele expressie', '🖌️', 21),
('b1000000-0022-4000-8000-000000000022', 'Fotografie', 'Fotografische technieken en beeldvorming', '📷', 22),
('b1000000-0023-4000-8000-000000000023', 'Dans-, acteer- en zangactiviteiten', 'Podiumkunsten en performance', '💃', 23),
('b1000000-0024-4000-8000-000000000024', 'Modetechniek', 'Mode-ontwerp, patronen en kledingconstructie', '✂️', 24);

-- ============================================================================
-- DIRECTION_SUBJECTS (koppeling richtingen <-> vakken)
-- ============================================================================

-- Gezondheid & Bewegen
INSERT INTO public.direction_subjects (direction_id, subject_id, type, hours_per_week, "order") VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'b1000000-0001-4000-8000-000000000001', 'required', 3, 1),  -- Biologie
('a1b2c3d4-0001-4000-8000-000000000001', 'b1000000-0002-4000-8000-000000000002', 'required', 4, 2),  -- LO2
('a1b2c3d4-0001-4000-8000-000000000001', 'b1000000-0003-4000-8000-000000000003', 'required', 2, 3),  -- Verzorging
('a1b2c3d4-0001-4000-8000-000000000001', 'b1000000-0004-4000-8000-000000000004', 'required', 3, 4),  -- Wiskunde
('a1b2c3d4-0001-4000-8000-000000000001', 'b1000000-0005-4000-8000-000000000005', 'optional', 2, 5),  -- Scheikunde
('a1b2c3d4-0001-4000-8000-000000000001', 'b1000000-0006-4000-8000-000000000006', 'optional', 2, 6);  -- Maatschappijleer

-- Kunst & Media (volgens contentdocument)
INSERT INTO public.direction_subjects (direction_id, subject_id, type, hours_per_week, "order") VALUES
('a1b2c3d4-0002-4000-8000-000000000002', 'b1000000-0021-4000-8000-000000000021', 'required', 0, 1),  -- Tekenen, schilderen en illustreren
('a1b2c3d4-0002-4000-8000-000000000002', 'b1000000-0022-4000-8000-000000000022', 'required', 0, 2),  -- Fotografie
('a1b2c3d4-0002-4000-8000-000000000002', 'b1000000-0023-4000-8000-000000000023', 'optional', 0, 3),  -- Dans-, acteer- en zangactiviteiten
('a1b2c3d4-0002-4000-8000-000000000002', 'b1000000-0024-4000-8000-000000000024', 'optional', 0, 4);  -- Modetechniek

-- Tech
INSERT INTO public.direction_subjects (direction_id, subject_id, type, hours_per_week, "order") VALUES
('a1b2c3d4-0003-4000-8000-000000000003', 'b1000000-0013-4000-8000-000000000013', 'required', 4, 1),  -- Informatica
('a1b2c3d4-0003-4000-8000-000000000003', 'b1000000-0014-4000-8000-000000000014', 'required', 3, 2),  -- Wiskunde B
('a1b2c3d4-0003-4000-8000-000000000003', 'b1000000-0015-4000-8000-000000000015', 'required', 3, 3),  -- Natuurkunde
('a1b2c3d4-0003-4000-8000-000000000003', 'b1000000-0016-4000-8000-000000000016', 'required', 3, 4),  -- Engels
('a1b2c3d4-0003-4000-8000-000000000003', 'b1000000-0005-4000-8000-000000000005', 'optional', 2, 5),  -- Scheikunde
('a1b2c3d4-0003-4000-8000-000000000003', 'b1000000-0017-4000-8000-000000000017', 'optional', 2, 6);  -- Economie

-- Horeca
INSERT INTO public.direction_subjects (direction_id, subject_id, type, hours_per_week, "order") VALUES
('a1b2c3d4-0004-4000-8000-000000000004', 'b1000000-0018-4000-8000-000000000018', 'required', 4, 1),  -- Consumptief
('a1b2c3d4-0004-4000-8000-000000000004', 'b1000000-0017-4000-8000-000000000017', 'required', 3, 2),  -- Economie
('a1b2c3d4-0004-4000-8000-000000000004', 'b1000000-0016-4000-8000-000000000016', 'required', 3, 3),  -- Engels
('a1b2c3d4-0004-4000-8000-000000000004', 'b1000000-0010-4000-8000-000000000010', 'required', 3, 4),  -- Nederlands
('a1b2c3d4-0004-4000-8000-000000000004', 'b1000000-0019-4000-8000-000000000019', 'optional', 2, 5),  -- Duits
('a1b2c3d4-0004-4000-8000-000000000004', 'b1000000-0004-4000-8000-000000000004', 'optional', 2, 6);  -- Wiskunde

-- ============================================================================
-- CAREERS (beroepen — standalone tabel)
-- ============================================================================
INSERT INTO public.careers (id, name, description, icon, "order") VALUES
-- Gezondheid & Bewegen
('c1000000-0001-4000-8000-000000000001', 'Fysiotherapeut', 'Help patiënten herstellen van blessures en verbeter hun bewegingsvermogen', '🏥', 1),
('c1000000-0002-4000-8000-000000000002', 'Personal Trainer', 'Begeleid mensen naar hun fitnessdoelen met persoonlijke trainingsplannen', '💪', 2),
('c1000000-0003-4000-8000-000000000003', 'Sportleraar', 'Geef les in lichamelijke opvoeding en sport op scholen', '🏫', 3),
('c1000000-0004-4000-8000-000000000004', 'Verpleegkundige', 'Verzorg patiënten in ziekenhuizen, verpleeghuizen of thuiszorg', '🩺', 4),
('c1000000-0005-4000-8000-000000000005', 'Diëtist', 'Adviseer mensen over gezonde voeding en voedingsgerelateerde aandoeningen', '🥗', 5),
-- Kunst & Media (uit contentdocument)
('c1000000-0006-4000-8000-000000000006', 'Modefotograaf', 'Fotografeer modecollecties, campagnes en fashion shoots', '📸', 6),
('c1000000-0007-4000-8000-000000000007', 'Set stylist', 'Style sets en locaties voor fotografie, film en events', '🎨', 7),
('c1000000-0008-4000-8000-000000000008', 'Digitale game artist', 'Ontwerp visuals, personages en werelden voor games', '🎮', 8),
('c1000000-0009-4000-8000-000000000009', 'Ontwerper', 'Ontwerp producten, mode of visuele concepten', '✏️', 9),
('c1000000-0010-4000-8000-000000000010', 'Vormgever', 'Geef vorm aan grafische en visuele communicatie', '🖌️', 10),
('c1000000-0021-4000-8000-000000000021', 'Conceptontwikkelaar', 'Ontwikkel creatieve concepten voor merken en media', '💡', 21),
-- Tech
('c1000000-0011-4000-8000-000000000011', 'Software Developer', 'Ontwikkel applicaties en systemen voor web, mobile of desktop', '💻', 11),
('c1000000-0012-4000-8000-000000000012', 'Data Scientist', 'Analyseer grote datasets en ontwikkel AI/ML modellen', '📊', 12),
('c1000000-0013-4000-8000-000000000013', 'Cybersecurity Specialist', 'Bescherm systemen en netwerken tegen digitale dreigingen', '🔒', 13),
('c1000000-0014-4000-8000-000000000014', 'DevOps Engineer', 'Beheer cloud infrastructuur en automatiseer deployment processen', '☁️', 14),
('c1000000-0015-4000-8000-000000000015', 'UX Designer', 'Ontwerp gebruiksvriendelijke digitale producten en interfaces', '🖌️', 15),
-- Horeca
('c1000000-0016-4000-8000-000000000016', 'Chef-kok', 'Leid een keuken en creëer culinaire gerechten', '👨‍🍳', 16),
('c1000000-0017-4000-8000-000000000017', 'Restaurant Manager', 'Beheer de dagelijkse operatie van een restaurant', '🍽️', 17),
('c1000000-0018-4000-8000-000000000018', 'Barista', 'Bereid koffie en dranken in een café of koffiebar', '☕', 18),
('c1000000-0019-4000-8000-000000000019', 'Hotelmanager', 'Leid de operatie van een hotel en zorg voor gasttevredenheid', '🏨', 19),
('c1000000-0020-4000-8000-000000000020', 'Event Planner', 'Organiseer evenementen zoals bruiloften, conferenties en feesten', '🎉', 20);

-- ============================================================================
-- DIRECTION_CAREERS (koppeling richtingen <-> beroepen)
-- ============================================================================

-- Gezondheid & Bewegen
INSERT INTO public.direction_careers (direction_id, career_id, "order") VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'c1000000-0001-4000-8000-000000000001', 1),  -- Fysiotherapeut
('a1b2c3d4-0001-4000-8000-000000000001', 'c1000000-0002-4000-8000-000000000002', 2),  -- Personal Trainer
('a1b2c3d4-0001-4000-8000-000000000001', 'c1000000-0003-4000-8000-000000000003', 3),  -- Sportleraar
('a1b2c3d4-0001-4000-8000-000000000001', 'c1000000-0004-4000-8000-000000000004', 4),  -- Verpleegkundige
('a1b2c3d4-0001-4000-8000-000000000001', 'c1000000-0005-4000-8000-000000000005', 5);  -- Diëtist

-- Kunst & Media (uit contentdocument)
INSERT INTO public.direction_careers (direction_id, career_id, "order") VALUES
('a1b2c3d4-0002-4000-8000-000000000002', 'c1000000-0006-4000-8000-000000000006', 1),  -- Modefotograaf
('a1b2c3d4-0002-4000-8000-000000000002', 'c1000000-0007-4000-8000-000000000007', 2),  -- Set stylist
('a1b2c3d4-0002-4000-8000-000000000002', 'c1000000-0008-4000-8000-000000000008', 3),  -- Digitale game artist
('a1b2c3d4-0002-4000-8000-000000000002', 'c1000000-0009-4000-8000-000000000009', 4),  -- Ontwerper
('a1b2c3d4-0002-4000-8000-000000000002', 'c1000000-0010-4000-8000-000000000010', 5),  -- Vormgever
('a1b2c3d4-0002-4000-8000-000000000002', 'c1000000-0021-4000-8000-000000000021', 6);  -- Conceptontwikkelaar

-- Tech
INSERT INTO public.direction_careers (direction_id, career_id, "order") VALUES
('a1b2c3d4-0003-4000-8000-000000000003', 'c1000000-0011-4000-8000-000000000011', 1),  -- Software Developer
('a1b2c3d4-0003-4000-8000-000000000003', 'c1000000-0012-4000-8000-000000000012', 2),  -- Data Scientist
('a1b2c3d4-0003-4000-8000-000000000003', 'c1000000-0013-4000-8000-000000000013', 3),  -- Cybersecurity Specialist
('a1b2c3d4-0003-4000-8000-000000000003', 'c1000000-0014-4000-8000-000000000014', 4),  -- DevOps Engineer
('a1b2c3d4-0003-4000-8000-000000000003', 'c1000000-0015-4000-8000-000000000015', 5);  -- UX Designer

-- Horeca
INSERT INTO public.direction_careers (direction_id, career_id, "order") VALUES
('a1b2c3d4-0004-4000-8000-000000000004', 'c1000000-0016-4000-8000-000000000016', 1),  -- Chef-kok
('a1b2c3d4-0004-4000-8000-000000000004', 'c1000000-0017-4000-8000-000000000017', 2),  -- Restaurant Manager
('a1b2c3d4-0004-4000-8000-000000000004', 'c1000000-0018-4000-8000-000000000018', 3),  -- Barista
('a1b2c3d4-0004-4000-8000-000000000004', 'c1000000-0019-4000-8000-000000000019', 4),  -- Hotelmanager
('a1b2c3d4-0004-4000-8000-000000000004', 'c1000000-0020-4000-8000-000000000020', 5);  -- Event Planner

-- ============================================================================
-- FURTHER_EDUCATION (vervolgopleidingen — standalone tabel)
-- ============================================================================
INSERT INTO public.further_education (id, name, type, description, institution, url, "order") VALUES
-- Gezondheid & Bewegen
('d1000000-0001-4000-8000-000000000001', 'Sport en Bewegen', 'mbo', 'MBO-opleiding gericht op sport, bewegen en een gezonde leefstijl', 'ROC Mondriaan', 'https://www.rocmondriaan.nl', 1),
('d1000000-0002-4000-8000-000000000002', 'Verpleegkunde', 'mbo', 'MBO-opleiding tot verpleegkundige', 'ROC Mondriaan', 'https://www.rocmondriaan.nl', 2),
('d1000000-0003-4000-8000-000000000003', 'Fysiotherapie', 'hbo', 'HBO-opleiding tot fysiotherapeut', 'De Haagse Hogeschool', 'https://www.hhs.nl', 3),
('d1000000-0004-4000-8000-000000000004', 'Sportkunde', 'hbo', 'HBO-opleiding gericht op sportmanagement en coaching', 'De Haagse Hogeschool', 'https://www.hhs.nl', 4),
-- Kunst & Media
('d1000000-0005-4000-8000-000000000005', 'Mediavormgever', 'mbo', 'MBO-opleiding in grafisch ontwerp en digitale media', 'Grafisch Lyceum Rotterdam', 'https://www.glr.nl', 5),
('d1000000-0006-4000-8000-000000000006', 'Filmacademie', 'hbo', 'HBO-opleiding in film, video en animatie', 'Filmacademie Amsterdam', 'https://www.filmacademie.ahk.nl', 6),
('d1000000-0007-4000-8000-000000000007', 'Kunstacademie', 'hbo', 'HBO-opleiding in beeldende kunst en vormgeving', 'KABK', 'https://www.kabk.nl', 7),
('d1000000-0008-4000-8000-000000000008', 'Communication & Multimedia Design', 'hbo', 'HBO-opleiding in digitaal design en interactieve media', 'De Haagse Hogeschool', 'https://www.hhs.nl', 8),
-- Tech
('d1000000-0009-4000-8000-000000000009', 'Software Developer', 'mbo', 'MBO-opleiding tot software developer', 'ROC Mondriaan', 'https://www.rocmondriaan.nl', 9),
('d1000000-0010-4000-8000-000000000010', 'Informatica', 'hbo', 'HBO-opleiding in software engineering en informatica', 'De Haagse Hogeschool', 'https://www.hhs.nl', 10),
('d1000000-0011-4000-8000-000000000011', 'Technische Informatica', 'hbo', 'HBO-opleiding gericht op embedded systems en netwerken', 'De Haagse Hogeschool', 'https://www.hhs.nl', 11),
('d1000000-0012-4000-8000-000000000012', 'Computer Science', 'wo', 'Universitaire opleiding in informatica en computerwetenschappen', 'TU Delft', 'https://www.tudelft.nl', 12),
-- Horeca
('d1000000-0013-4000-8000-000000000013', 'Kok', 'mbo', 'MBO-opleiding tot kok', 'ROC Mondriaan', 'https://www.rocmondriaan.nl', 13),
('d1000000-0014-4000-8000-000000000014', 'Gastheer/Gastvrouw', 'mbo', 'MBO-opleiding in horecabediening en gastvrijheid', 'ROC Mondriaan', 'https://www.rocmondriaan.nl', 14),
('d1000000-0015-4000-8000-000000000015', 'Horecaondernemer', 'mbo', 'MBO-opleiding tot horecaondernemer/manager', 'ROC Mondriaan', 'https://www.rocmondriaan.nl', 15),
('d1000000-0016-4000-8000-000000000016', 'Hotel Management', 'hbo', 'HBO-opleiding in hotelmanagement', 'Hotelschool The Hague', 'https://www.hotelschool.nl', 16);

-- ============================================================================
-- DIRECTION_EDUCATION (koppeling richtingen <-> opleidingen)
-- ============================================================================

-- Gezondheid & Bewegen
INSERT INTO public.direction_education (direction_id, education_id, "order") VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'd1000000-0001-4000-8000-000000000001', 1),  -- Sport en Bewegen (MBO)
('a1b2c3d4-0001-4000-8000-000000000001', 'd1000000-0002-4000-8000-000000000002', 2),  -- Verpleegkunde (MBO)
('a1b2c3d4-0001-4000-8000-000000000001', 'd1000000-0003-4000-8000-000000000003', 3),  -- Fysiotherapie (HBO)
('a1b2c3d4-0001-4000-8000-000000000001', 'd1000000-0004-4000-8000-000000000004', 4);  -- Sportkunde (HBO)

-- Kunst & Media
INSERT INTO public.direction_education (direction_id, education_id, "order") VALUES
('a1b2c3d4-0002-4000-8000-000000000002', 'd1000000-0005-4000-8000-000000000005', 1),  -- Mediavormgever (MBO)
('a1b2c3d4-0002-4000-8000-000000000002', 'd1000000-0006-4000-8000-000000000006', 2),  -- Filmacademie (HBO)
('a1b2c3d4-0002-4000-8000-000000000002', 'd1000000-0007-4000-8000-000000000007', 3),  -- Kunstacademie (HBO)
('a1b2c3d4-0002-4000-8000-000000000002', 'd1000000-0008-4000-8000-000000000008', 4);  -- CMD (HBO)

-- Tech
INSERT INTO public.direction_education (direction_id, education_id, "order") VALUES
('a1b2c3d4-0003-4000-8000-000000000003', 'd1000000-0009-4000-8000-000000000009', 1),  -- Software Developer (MBO)
('a1b2c3d4-0003-4000-8000-000000000003', 'd1000000-0010-4000-8000-000000000010', 2),  -- Informatica (HBO)
('a1b2c3d4-0003-4000-8000-000000000003', 'd1000000-0011-4000-8000-000000000011', 3),  -- Technische Informatica (HBO)
('a1b2c3d4-0003-4000-8000-000000000003', 'd1000000-0012-4000-8000-000000000012', 4);  -- Computer Science (WO)

-- Horeca
INSERT INTO public.direction_education (direction_id, education_id, "order") VALUES
('a1b2c3d4-0004-4000-8000-000000000004', 'd1000000-0013-4000-8000-000000000013', 1),  -- Kok (MBO)
('a1b2c3d4-0004-4000-8000-000000000004', 'd1000000-0014-4000-8000-000000000014', 2),  -- Gastheer/Gastvrouw (MBO)
('a1b2c3d4-0004-4000-8000-000000000004', 'd1000000-0015-4000-8000-000000000015', 3),  -- Horecaondernemer (MBO)
('a1b2c3d4-0004-4000-8000-000000000004', 'd1000000-0016-4000-8000-000000000016', 4);  -- Hotel Management (HBO)

-- ============================================================================
-- EINDE SEED DATA
-- ============================================================================
-- Totaal: 6 richtingen, 29 traits, 25 competenties, 20 vakken,
--         24 vak-koppelingen, 20 beroepen, 20 beroep-koppelingen,
--         16 opleidingen, 16 opleiding-koppelingen
-- ============================================================================
