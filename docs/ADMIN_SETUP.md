# Admin User Setup

Dit document beschrijft hoe je een admin gebruiker aanmaakt voor het CMS.

## Stap 1: Supabase Dashboard

1. Ga naar je Supabase project dashboard
2. Navigeer naar **Authentication** > **Users**
3. Klik op **Add user** > **Create new user**

## Stap 2: Gebruiker aanmaken

Vul de volgende gegevens in:

- **Email**: Het email adres van de admin (bijv. `admin@school.nl`)
- **Password**: Een sterk wachtwoord (minimaal 8 karakters)
- **Auto Confirm User**: Aanvinken (zodat email verificatie wordt overgeslagen)

Klik op **Create user**.

## Stap 3: Inloggen

1. Ga naar `/admin/login` op je website
2. Vul het email en wachtwoord in
3. Je wordt doorgestuurd naar het admin dashboard

## Admin Routes

Na inloggen heb je toegang tot:

| Route | Functie |
|-------|---------|
| `/admin` | Dashboard met overzicht |
| `/admin/tracks` | Beheer leertrajecten |
| `/admin/subjects` | Beheer vakken |
| `/admin/pathways` | Beheer vervolgopleidingen |
| `/admin/competencies` | Beheer competenties |
| `/admin/jobs` | Beheer beroepen |

## Security

- Admin routes zijn beveiligd met Supabase Auth middleware
- Alleen geauthenticeerde gebruikers kunnen content wijzigen
- RLS (Row Level Security) is ingeschakeld op database niveau
- Public gebruikers kunnen alleen data lezen, niet schrijven

## Wachtwoord vergeten

1. Ga naar Supabase Dashboard > Authentication > Users
2. Zoek de gebruiker
3. Klik op de drie puntjes > **Send password recovery**

Of implementeer een wachtwoord reset flow via Supabase Auth.

## Meerdere admins

Je kunt meerdere admin users aanmaken via dezelfde stappen. Alle geauthenticeerde gebruikers hebben dezelfde rechten (basic admin).

> **Opmerking**: Geavanceerde rollen/rechten (zoals editor vs super-admin) vallen buiten scope van fase 1.
