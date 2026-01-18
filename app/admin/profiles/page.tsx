'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile, Level } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'
import Link from 'next/link'

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<(Profile & { levels: { name: string, slug: string } })[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const { toast, showToast, hideToast } = useToast()
  const supabase = createClient()

  const fetchData = async () => {
    const [profilesRes, levelsRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('*, levels(name, slug)')
        .order('order'),
      supabase
        .from('levels')
        .select('*')
        .order('order')
    ])

    if (profilesRes.error) {
      showToast('Fout bij laden profielen', 'error')
    } else {
      let data = profilesRes.data || []
      if (filter !== 'all') {
        data = data.filter(p => p.levels?.slug === filter)
      }
      setProfiles(data)
    }
    setLevels(levelsRes.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [filter])

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit profiel wilt verwijderen?')) return

    const { error } = await supabase.from('profiles').delete().eq('id', id)

    if (error) {
      showToast('Fout bij verwijderen', 'error')
    } else {
      showToast('Profiel verwijderd', 'success')
      fetchData()
    }
  }

  if (loading) return <div className="text-gray-500">Laden...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profielen</h1>
        <Link
          href="/admin/profiles/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          + Nieuw profiel
        </Link>
      </div>

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        >
          <option value="all">Alle niveaus</option>
          {levels.map(level => (
            <option key={level.id} value={level.slug}>{level.name}</option>
          ))}
        </select>
      </div>

      {profiles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Geen profielen voor dit niveau.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Profiel</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Fase</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Niveau</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Beschrijving</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: profile.color }}
                      >
                        {profile.short_name}
                      </div>
                      <span className="font-medium text-gray-900">{profile.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      profile.phase === 'onderbouw'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {profile.phase === 'onderbouw' ? 'Onderbouw' : 'Bovenbouw'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {profile.levels?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-md truncate">{profile.description || '-'}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/admin/profiles/${profile.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                      Bewerken
                    </Link>
                    <button onClick={() => handleDelete(profile.id)} className="text-red-600 hover:text-red-700 font-medium">
                      Verwijderen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
