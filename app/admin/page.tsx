import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [levels, profiles, subjects, careers, education] = await Promise.all([
    supabase.from('levels').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('subjects_master').select('id', { count: 'exact', head: true }),
    supabase.from('careers').select('id', { count: 'exact', head: true }),
    supabase.from('further_education').select('id', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Niveaus', count: levels.count || 0, href: '/admin/levels', icon: '🏫', description: 'VMBO, Mavo, etc.' },
    { label: 'Profielen', count: profiles.count || 0, href: '/admin/profiles', icon: '🎯', description: 'Sport, Tech, etc.' },
    { label: 'Vakken', count: subjects.count || 0, href: '/admin/subjects', icon: '📚', description: 'Nederlands, Engels, etc.' },
    { label: 'Beroepen', count: careers.count || 0, href: '/admin/careers', icon: '💼', description: 'Wat kun je worden?' },
    { label: 'Opleidingen', count: education.count || 0, href: '/admin/education', icon: '🎓', description: 'MBO, HBO, WO' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welkom bij het Beheerpaneel</h1>
        <p className="text-gray-600 mt-1">Hier beheer je alle informatie die leerlingen en ouders zien in de app.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-gray-900 font-medium">{stat.label}</p>
                <p className="text-gray-500 text-sm">{stat.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Uitleg sectie */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hoe werkt deze app?</h2>

        <div className="space-y-6 text-gray-700">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-medium text-blue-900">De Futuris app helpt leerlingen en ouders om te zien welke profielen (richtingen) er zijn, welke vakken daarbij horen, en wat je later kunt worden.</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">De structuur van de app:</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm font-bold">1</span>
                <div>
                  <p className="font-medium">Niveaus (VMBO Basis, Mavo, etc.)</p>
                  <p className="text-gray-600 text-sm">Dit zijn de opleidingsniveaus die jullie school aanbiedt.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm font-bold">2</span>
                <div>
                  <p className="font-medium">Profielen (Sport, Techniek, Zorg, etc.)</p>
                  <p className="text-gray-600 text-sm">Elk niveau heeft profielen. Dit zijn de richtingen die leerlingen kunnen kiezen.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm font-bold">3</span>
                <div>
                  <p className="font-medium">Vakken (Nederlands, Engels, Wiskunde, etc.)</p>
                  <p className="text-gray-600 text-sm">Vakken worden gekoppeld aan profielen. Je geeft aan of een vak verplicht of een keuzevak is.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm font-bold">4</span>
                <div>
                  <p className="font-medium">Beroepen en Vervolgopleidingen</p>
                  <p className="text-gray-600 text-sm">Wat kun je worden na dit profiel? Welke opleidingen kun je doen?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stap voor stap handleiding */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Stap-voor-stap: Hoe beheer ik de app?</h2>

        <div className="space-y-6">
          {/* Vakken bewerken */}
          <div className="border-l-4 border-primary-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">📚</span> Vakken aanpassen
            </h3>
            <ol className="mt-2 space-y-2 text-gray-700 list-decimal list-inside">
              <li>Klik hierboven op <strong>&quot;Vakken&quot;</strong></li>
              <li>Klik op <strong>&quot;Bewerken&quot;</strong> naast het vak dat je wilt aanpassen</li>
              <li>Vink aan voor welke niveaus dit vak beschikbaar is</li>
              <li>Vul per niveau de beschrijving en lesuren in</li>
              <li>Klik op <strong>&quot;Opslaan&quot;</strong></li>
            </ol>
          </div>

          {/* Profielen bewerken */}
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">🎯</span> Profiel vakken koppelen
            </h3>
            <ol className="mt-2 space-y-2 text-gray-700 list-decimal list-inside">
              <li>Klik hierboven op <strong>&quot;Profielen&quot;</strong></li>
              <li>Klik op <strong>&quot;Bewerken&quot;</strong> naast het profiel</li>
              <li>Scroll naar beneden naar <strong>&quot;Vakken koppelen&quot;</strong></li>
              <li>Klik op <strong>&quot;Verplicht&quot;</strong> of <strong>&quot;Keuze&quot;</strong> bij elk vak</li>
              <li>Klik op <strong>&quot;Opslaan&quot;</strong></li>
            </ol>
          </div>

          {/* Beroepen toevoegen */}
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">💼</span> Beroep toevoegen
            </h3>
            <ol className="mt-2 space-y-2 text-gray-700 list-decimal list-inside">
              <li>Klik hierboven op <strong>&quot;Beroepen&quot;</strong></li>
              <li>Klik rechtsboven op <strong>&quot;+ Nieuw beroep&quot;</strong></li>
              <li>Vul de naam en beschrijving in</li>
              <li>Klik op <strong>&quot;Aanmaken&quot;</strong></li>
            </ol>
          </div>

          {/* Opleidingen toevoegen */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">🎓</span> Vervolgopleiding toevoegen
            </h3>
            <ol className="mt-2 space-y-2 text-gray-700 list-decimal list-inside">
              <li>Klik hierboven op <strong>&quot;Opleidingen&quot;</strong></li>
              <li>Klik rechtsboven op <strong>&quot;+ Nieuwe opleiding&quot;</strong></li>
              <li>Vul de naam in en kies het type (MBO/HBO/WO)</li>
              <li>Klik op <strong>&quot;Aanmaken&quot;</strong></li>
            </ol>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-amber-900 mb-3">Handige tips</h2>
        <ul className="space-y-2 text-amber-800">
          <li className="flex items-start gap-2">
            <span className="text-amber-600">•</span>
            <span>Wijzigingen zijn <strong>direct zichtbaar</strong> voor leerlingen en ouders.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600">•</span>
            <span>Je kunt altijd terug naar deze pagina via <strong>&quot;Dashboard&quot;</strong> in het menu links.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600">•</span>
            <span>Vergeet niet op <strong>&quot;Opslaan&quot;</strong> te klikken na het maken van wijzigingen!</span>
          </li>
        </ul>
      </div>

      {/* Bekijk de app */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Bekijk wat leerlingen zien</h2>
        <p className="text-gray-600 mb-4">
          Wil je zien hoe de app eruitziet voor leerlingen en ouders? Klik op de knop hieronder.
        </p>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Open de leerlingen-app
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
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
