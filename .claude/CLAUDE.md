# Futuris Bovenbouw App — Parallel Agents Plan (3x Claude Code)

## Doel (fase 1)
Een mobile-first **info webapp (PWA-ready)** voor leerlingen/ouders + een **light CMS** voor de school om content zelf te beheren.
- Publiek: **geen login**
- Admin: **wel login** (Supabase Auth)
- Geen persoonsgegevens van leerlingen/ouders.

---

## Stack
- Next.js (App Router)
- Tailwind CSS
- Supabase (Postgres + Auth)
- Deploy: Vercel (frontend) + Supabase (db)

---

## Datamodel (content)
- tracks (leertrajecten/richtingen)
- subjects (vakken: required/optional)
- pathways (vervolgopleidingen)
- competencies
- jobs

Alles gekoppeld aan `track_id` en sorteerveld `order`.

---

## Security (RLS)
- Public: SELECT op alle content tabellen
- Authenticated (admin): INSERT/UPDATE/DELETE

---

## Agents (parallel)
### Agent 1 — Architect/DB
**Output:**
- `/supabase/migrations/0001_init.sql`
- `/supabase/seed.sql`
- `/supabase/README_DB.md`

**Taken:**
- Tables + indexes + triggers
- RLS policies
- Seed data (4 tracks + voorbeeld records)

### Agent 2 — Frontend/Public
**Output:**
- Public pages: `/`, `/richting/[slug]`
- Components + data fetch layer
- Tailwind setup + env vars

**Taken:**
- Mobile-first UI
- Track overzicht + detail secties
- 404/loading/error states

### Agent 3 — Admin/CMS
**Output:**
- Admin routes `/admin/*`
- Auth guard + login
- CRUD forms voor alle tabellen

**Taken:**
- Admin layout + UX
- Validatie en save feedback
- README snippet voor admin user setup

---

## Definition of Done (fase 1)
- [ ] `/` toont alle tracks uit DB, gesorteerd op `order`
- [ ] `/richting/[slug]` toont alle secties en relaties
- [ ] `/admin/login` werkt
- [ ] Admin kan CRUD uitvoeren op tracks/subjects/pathways/competencies/jobs
- [ ] Public kan alles lezen zonder login
- [ ] RLS voorkomt public writes
- [ ] Seed data laadt zodat app direct gevuld is

---

## Env vars
Maak `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL=...`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

---

## Not in scope (fase 1)
- Persoonlijkheidstest / advieslogica
- App Store release
- Rollen/rechten (meerdere admins) buiten basic auth
- Tracking/analytics van leerlingen

---

## Next (fase 2 ideeën)
- Test/advies module met weging per track
- Extra pagina’s (ouders/FAQ/nieuws)
- Meerdere scholen (multi-tenant)
- App Store wrapper
