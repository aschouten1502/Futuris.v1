import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [directionsResult, subjectsResult, careersResult, educationResult] = await Promise.all([
    supabase.from('directions').select('id, category', { count: 'exact' }),
    supabase.from('subjects').select('id', { count: 'exact', head: true }),
    supabase.from('careers').select('id', { count: 'exact', head: true }),
    supabase.from('further_education').select('id', { count: 'exact', head: true }),
  ])

  const dpCount = directionsResult.data?.filter(d => d.category === 'dp').length || 0
  const mavoCount = directionsResult.data?.filter(d => d.category === 'mavo').length || 0

  const stats = [
    { label: 'D&P Richtingen', count: dpCount, href: '/admin/directions', icon: '🎯', description: 'Gezondheid, Kunst, Tech, Horeca' },
    { label: 'Mavo Routes', count: mavoCount, href: '/admin/directions', icon: '📐', description: 'MBO en HAVO routes' },
    { label: 'Vakken', count: subjectsResult.count || 0, href: '/admin/subjects', icon: '📚', description: 'Alle schoolvakken' },
    { label: 'Beroepen', count: careersResult.count || 0, href: '/admin/careers', icon: '💼', description: 'Toekomstige beroepen' },
    { label: 'Opleidingen', count: educationResult.count || 0, href: '/admin/education', icon: '🎓', description: 'MBO, HBO, WO' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welkom bij Futuris Admin</h1>
        <p className="text-gray-600 mt-1">Beheer alle informatie die leerlingen en ouders zien in de Futuris app.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-gray-900 font-medium text-sm">{stat.label}</p>
                <p className="text-gray-500 text-xs">{stat.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Uitleg sectie */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hoe werkt de Futuris app?</h2>

        <div className="space-y-6 text-gray-700">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-medium text-blue-900">
              Futuris helpt leerlingen en ouders om de bovenbouw richtingen te ontdekken.
              Leerlingen zien per richting welke vakken ze krijgen, welke beroepen mogelijk zijn,
              en welke vervolgopleidingen ze kunnen doen.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-3">De structuur van de app:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* D&P */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🎯</span>
                  <h4 className="font-bold text-teal-900">D&P Richtingen</h4>
                </div>
                <p className="text-teal-800 text-sm mb-2">
                  De 4 Dienstverlening & Producten richtingen in de bovenbouw:
                </p>
                <ul className="text-teal-700 text-sm space-y-1">
                  <li className="flex items-center gap-2"><span>💪</span> Gezondheid & Bewegen</li>
                  <li className="flex items-center gap-2"><span>🎨</span> Kunst & Media</li>
                  <li className="flex items-center gap-2"><span>💻</span> Tech</li>
                  <li className="flex items-center gap-2"><span>🍳</span> Horeca</li>
                </ul>
              </div>

              {/* Mavo */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📐</span>
                  <h4 className="font-bold text-purple-900">Mavo Routes</h4>
                </div>
                <p className="text-purple-800 text-sm mb-2">
                  De 2 Mavo doorstroom routes:
                </p>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li className="flex items-center gap-2"><span>🎯</span> Mavo naar MBO route</li>
                  <li className="flex items-center gap-2"><span>📐</span> Mavo naar HAVO route</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">Wat zit er in een richting?</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-3">
                <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-bold">📋</span>
                <div>
                  <p className="font-medium text-sm">D&P Modules / Competenties</p>
                  <p className="text-gray-600 text-xs">De 4 verplichte D&P modules met richtingspecifieke voorbeelden</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-bold">✨</span>
                <div>
                  <p className="font-medium text-sm">Eigenschappen</p>
                  <p className="text-gray-600 text-xs">Kenmerken die passen bij leerlingen in deze richting</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-bold">📚</span>
                <div>
                  <p className="font-medium text-sm">Vakken</p>
                  <p className="text-gray-600 text-xs">Verplichte vakken, keuzevakken en passende vakken per richting</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-bold">💼</span>
                <div>
                  <p className="font-medium text-sm">Beroepen</p>
                  <p className="text-gray-600 text-xs">Welke beroepen kun je uitoefenen na deze richting?</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-bold">🎓</span>
                <div>
                  <p className="font-medium text-sm">Vervolgopleidingen</p>
                  <p className="text-gray-600 text-xs">MBO, HBO en WO opleidingen die aansluiten</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stap voor stap handleiding */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Stap-voor-stap handleiding</h2>

        <div className="space-y-6">
          {/* Richting bewerken */}
          <div className="border-l-4 border-primary-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">🎯</span> Richting bewerken
            </h3>
            <ol className="mt-2 space-y-1.5 text-gray-700 list-decimal list-inside text-sm">
              <li>Ga naar <Link href="/admin/directions" className="text-primary-600 hover:underline font-medium">Richtingen</Link></li>
              <li>Klik op <strong>&quot;Bewerken&quot;</strong> bij de richting</li>
              <li>Aan de linkerkant: vul de basisgegevens in (naam, beschrijving, afbeelding, kleur)</li>
              <li>Klap de secties open om modules, eigenschappen, vakken, beroepen en opleidingen toe te voegen</li>
              <li>Aan de rechterkant: bekijk direct hoe de pagina eruitziet (live preview)</li>
              <li>Klik op een onderdeel in de preview om naar dat veld te springen</li>
              <li>Klik op <strong>&quot;Opslaan&quot;</strong> als je klaar bent</li>
            </ol>
            <p className="mt-2 text-xs text-gray-500">
              Tip: Klik op &quot;Rondleiding&quot; in de richting-editor voor een interactieve uitleg!
            </p>
          </div>

          {/* Nieuwe richting */}
          <div className="border-l-4 border-teal-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">➕</span> Nieuwe richting aanmaken
            </h3>
            <ol className="mt-2 space-y-1.5 text-gray-700 list-decimal list-inside text-sm">
              <li>Ga naar <Link href="/admin/directions" className="text-primary-600 hover:underline font-medium">Richtingen</Link></li>
              <li>Klik op <strong>&quot;+ Nieuwe richting&quot;</strong></li>
              <li>Kies het type: <strong>D&P</strong> of <strong>Mavo</strong></li>
              <li>Vul de basisgegevens in en klik op <strong>&quot;Opslaan&quot;</strong></li>
              <li>Na het opslaan kun je modules, vakken, beroepen etc. toevoegen</li>
            </ol>
          </div>

          {/* Richting verwijderen */}
          <div className="border-l-4 border-red-400 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">🗑️</span> Richting verwijderen
            </h3>
            <ol className="mt-2 space-y-1.5 text-gray-700 list-decimal list-inside text-sm">
              <li>Ga naar <Link href="/admin/directions" className="text-primary-600 hover:underline font-medium">Richtingen</Link></li>
              <li>Klik op het <strong>prullenbak-icoon</strong> naast de richting</li>
              <li>Bevestig de verwijdering in de popup</li>
            </ol>
            <p className="mt-2 text-xs text-red-600">
              Let op: Alle gekoppelde data (modules, vakken, beroepen, etc.) wordt ook verwijderd!
            </p>
          </div>

          {/* Vakken beheren */}
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">📚</span> Vakken beheren
            </h3>
            <ol className="mt-2 space-y-1.5 text-gray-700 list-decimal list-inside text-sm">
              <li>Ga naar <Link href="/admin/subjects" className="text-primary-600 hover:underline font-medium">Vakken</Link> om vakken aan te maken/bewerken</li>
              <li>Ga naar een <strong>richting</strong> om vakken te koppelen</li>
              <li>In de sectie &quot;Vakken&quot;: klik <strong>&quot;Verplicht&quot;</strong>, <strong>&quot;Keuze&quot;</strong> of <strong>&quot;Passend&quot;</strong></li>
              <li>Klik op <strong>&quot;Opslaan&quot;</strong></li>
            </ol>
            <p className="mt-2 text-xs text-gray-500">
              &quot;Passend&quot; = vakken die goed passen bij de richting maar niet verplicht zijn
            </p>
          </div>

          {/* Beroepen toevoegen */}
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">💼</span> Beroepen beheren
            </h3>
            <ol className="mt-2 space-y-1.5 text-gray-700 list-decimal list-inside text-sm">
              <li>Ga naar <Link href="/admin/careers" className="text-primary-600 hover:underline font-medium">Beroepen</Link></li>
              <li>Klik op <strong>&quot;+ Nieuw beroep&quot;</strong> om een beroep aan te maken</li>
              <li>Ga naar een <strong>richting</strong> om beroepen te koppelen</li>
              <li>Vink de beroepen aan die bij de richting passen</li>
            </ol>
          </div>

          {/* Opleidingen toevoegen */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">🎓</span> Opleidingen beheren
            </h3>
            <ol className="mt-2 space-y-1.5 text-gray-700 list-decimal list-inside text-sm">
              <li>Ga naar <Link href="/admin/education" className="text-primary-600 hover:underline font-medium">Opleidingen</Link></li>
              <li>Klik op <strong>&quot;+ Nieuwe opleiding&quot;</strong></li>
              <li>Kies het type: <strong>MBO</strong>, <strong>HBO</strong> of <strong>WO</strong></li>
              <li>Ga naar een <strong>richting</strong> om opleidingen te koppelen</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-amber-900 mb-3">Handige tips</h2>
        <ul className="space-y-2 text-amber-800 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>Gebruik de <strong>&quot;Verversen&quot;</strong> knop rechtsboven als je wijzigingen niet ziet.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>De <strong>live preview</strong> in de richting-editor toont direct hoe leerlingen de pagina zien.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>Klik op een onderdeel in de preview om naar dat invoerveld te springen.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>Wijzigingen zijn <strong>direct zichtbaar</strong> voor leerlingen na opslaan.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>Vergeet niet op <strong>&quot;Opslaan&quot;</strong> te klikken!</span>
          </li>
        </ul>
      </div>

      {/* Bekijk de app */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Bekijk wat leerlingen zien</h2>
        <p className="text-gray-600 mb-4">
          Open de publieke app om te zien hoe leerlingen en ouders de informatie bekijken.
        </p>
        <div className="flex gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Open de app
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
          <Link
            href="/admin/preview"
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <span>📱</span>
            Preview modus
          </Link>
        </div>
      </div>

      {/* Hulp nodig */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Hulp nodig?</h2>
        <p className="text-gray-600 mb-4">
          Kom je er niet uit of heb je technische problemen? Neem gerust contact op.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:a.schouten@levtorai.com"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            a.schouten@levtorai.com
          </a>
          <a
            href="tel:+31645933231"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            06-45933231
          </a>
        </div>
        <p className="text-gray-400 text-sm mt-4">Aleks Schouten - Levtor AI</p>
      </div>
    </div>
  )
}
