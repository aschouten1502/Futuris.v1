import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [levels, profiles, subjects, careers, education] = await Promise.all([
    supabase.from('levels').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('subjects_v2').select('id', { count: 'exact', head: true }),
    supabase.from('careers').select('id', { count: 'exact', head: true }),
    supabase.from('further_education').select('id', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Niveaus', count: levels.count || 0, href: '/admin/levels', icon: '🏫' },
    { label: 'Profielen', count: profiles.count || 0, href: '/admin/profiles', icon: '🎓' },
    { label: 'Vakken', count: subjects.count || 0, href: '/admin/subjects', icon: '📚' },
    { label: 'Beroepen', count: careers.count || 0, href: '/admin/careers', icon: '💼' },
    { label: 'Opleidingen', count: education.count || 0, href: '/admin/education', icon: '🎓' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hoe werkt het?</h2>
        <ul className="space-y-2 text-gray-600">
          <li>1. <Link href="/admin/levels" className="text-primary-600 hover:underline">Niveaus</Link> zijn vast: VMBO, HAVO, VWO</li>
          <li>2. <Link href="/admin/profiles" className="text-primary-600 hover:underline">Profielen</Link> per niveau: N&T, N&G, E&M, C&M</li>
          <li>3. <Link href="/admin/subjects" className="text-primary-600 hover:underline">Vakken</Link> toevoegen en koppelen aan profielen</li>
          <li>4. <Link href="/admin/careers" className="text-primary-600 hover:underline">Beroepen</Link> en <Link href="/admin/education" className="text-primary-600 hover:underline">opleidingen</Link> koppelen</li>
        </ul>
      </div>
    </div>
  )
}
