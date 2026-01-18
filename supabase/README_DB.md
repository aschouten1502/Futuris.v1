# Futuris Database Setup

## Overzicht

Dit project gebruikt Supabase (PostgreSQL) als database met de volgende structuur:

| Tabel | Beschrijving |
|-------|-------------|
| `tracks` | Onderwijsprofielen (bijv. Tech, Horeca) |
| `subjects` | Vakken per profiel (required/optional) |
| `pathways` | Vervolgopleidingen per profiel |
| `competencies` | Vaardigheden die je ontwikkelt |
| `jobs` | Beroepen gerelateerd aan het profiel |

## Security Model

- **Public (anon)**: Alleen SELECT toegestaan op alle tabellen
- **Authenticated**: Volledige CRUD rechten (admin CMS)
- RLS (Row Level Security) is ingeschakeld op alle tabellen

---

## Migrations & Seed uitvoeren

### Optie 1: Supabase Dashboard (Aanbevolen voor beginners)

1. Ga naar je Supabase project dashboard
2. Navigeer naar **SQL Editor** in het linkermenu
3. Kopieer de inhoud van `migrations/0001_init.sql`
4. Plak in de editor en klik **Run**
5. Herhaal voor `seed.sql`

### Optie 2: Supabase CLI

```bash
# Installeer Supabase CLI (als je dat nog niet hebt)
npm install -g supabase

# Login bij Supabase
supabase login

# Link je project (vervang PROJECT_REF met je project ID)
supabase link --project-ref <PROJECT_REF>

# Push migrations naar remote database
supabase db push

# Of voer SQL direct uit
supabase db execute --file supabase/migrations/0001_init.sql
supabase db execute --file supabase/seed.sql
```

### Optie 3: Directe PostgreSQL connectie

```bash
# Gebruik psql met je Supabase connection string
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  -f supabase/migrations/0001_init.sql

psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  -f supabase/seed.sql
```

Je vindt je connection string in: **Project Settings > Database > Connection string**

---

## Volgorde van uitvoeren

1. **Eerst**: `0001_init.sql` - maakt tabellen, indexes, triggers en RLS policies
2. **Daarna**: `seed.sql` - vult de database met voorbeelddata

---

## Admin gebruiker aanmaken

Om content te kunnen beheren via de admin, maak een gebruiker aan:

### Via Dashboard:
1. Ga naar **Authentication > Users**
2. Klik **Add user** > **Create new user**
3. Vul email en wachtwoord in

### Via SQL:
```sql
-- Dit moet je doen via de Supabase Auth API, niet direct in SQL
-- Gebruik de Supabase client of dashboard
```

---

## Database schema verifiëren

Na het draaien van de migrations kun je verifiëren met:

```sql
-- Check tabellen
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check RLS policies
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public';

-- Tel de seed data
SELECT
  (SELECT COUNT(*) FROM tracks) as tracks,
  (SELECT COUNT(*) FROM subjects) as subjects,
  (SELECT COUNT(*) FROM pathways) as pathways,
  (SELECT COUNT(*) FROM competencies) as competencies,
  (SELECT COUNT(*) FROM jobs) as jobs;
```

---

## Environment Variables voor Next.js

Voeg deze toe aan je `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<je-anon-key>
```

Je vindt deze in: **Project Settings > API**

---

## Troubleshooting

### "permission denied" error
- Check of RLS is ingeschakeld: `ALTER TABLE tablename ENABLE ROW LEVEL SECURITY;`
- Verifieer dat de juiste policies bestaan

### "foreign key violation" bij seed
- Zorg dat je eerst de migration draait, dan de seed
- Check of de UUIDs correct zijn (geen typefouten)

### Seed opnieuw draaien
De seed.sql bevat `TRUNCATE CASCADE` - je kunt hem veilig opnieuw draaien.
