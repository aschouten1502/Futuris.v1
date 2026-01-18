'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/Toast'
import Link from 'next/link'

export default function CareerEditPage() {
  const params = useParams()
  const isNew = params.id === 'new'
  const router = useRouter()
  const supabase = createClient()
  const { toast, showToast, hideToast } = useToast()

  const [profiles, setProfiles] = useState<(Profile & { levels: { slug: string, name: string } })[]>([])
  const [linkedProfiles, setLinkedProfiles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    order: 0,
  })

  useEffect(() => {
    fetchProfiles()
    if (!isNew) {
      fetchCareer()
    } else {
      setLoading(false)
    }
  }, [params.id])

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*, levels(slug, name)')
      .order('order')
    setProfiles(data || [])
  }

  const fetchCareer = async () => {
    const { data, error } = await supabase
      .from('careers')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      showToast('Beroep niet gevonden', 'error')
      router.push('/admin/careers')
      return
    }

    setForm({
      name: data.name,
      description: data.description || '',
      order: data.order,
    })

    const { data: links } = await supabase
      .from('profile_careers')
      .select('profile_id')
      .eq('career_id', params.id)

    setLinkedProfiles(links?.map(l => l.profile_id) || [])
    setLoading(false)
  }

  const toggleProfile = (profileId: string) => {
    setLinkedProfiles(prev =>
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const careerData = {
      name: form.name,
      description: form.description || null,
      order: form.order,
    }

    let careerId = params.id as string

    if (isNew) {
      const { data, error } = await supabase
        .from('careers')
        .insert(careerData)
        .select('id')
        .single()

      if (error) {
        showToast('Fout bij aanmaken: ' + error.message, 'error')
        setSaving(false)
        return
      }
      careerId = data.id
    } else {
      const { error } = await supabase
        .from('careers')
        .update(careerData)
        .eq('id', params.id)

      if (error) {
        showToast('Fout bij opslaan', 'error')
        setSaving(false)
        return
      }
    }

    await supabase
      .from('profile_careers')
      .delete()
      .eq('career_id', careerId)

    if (linkedProfiles.length > 0) {
      const newLinks = linkedProfiles.map(profileId => ({
        profile_id: profileId,
        career_id: careerId,
      }))
      await supabase.from('profile_careers').insert(newLinks)
    }

    showToast(isNew ? 'Beroep aangemaakt' : 'Beroep opgeslagen', 'success')

    if (isNew) {
      router.push('/admin/careers')
    }
    setSaving(false)
  }

  if (loading) return <div className="text-gray-500">Laden...</div>

  const groupedProfiles = profiles.reduce((acc, profile) => {
    const levelName = profile.levels?.name || 'Onbekend'
    if (!acc[levelName]) acc[levelName] = []
    acc[levelName].push(profile)
    return acc
  }, {} as Record<string, typeof profiles>)

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/careers" className="text-primary-600 hover:underline text-sm">&larr; Terug naar beroepen</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">{isNew ? 'Nieuw beroep' : 'Beroep bewerken'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Beroep gegevens</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Naam *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Bijv. Software Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                placeholder="Wat doe je als dit beroep?"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Koppelen aan profielen</h2>
          <p className="text-sm text-gray-500 mb-4">Selecteer bij welke profielen dit beroep past.</p>

          {Object.entries(groupedProfiles).map(([levelName, levelProfiles]) => (
            <div key={levelName} className="mb-6 last:mb-0">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{levelName}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {levelProfiles.map(profile => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => toggleProfile(profile.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                      linkedProfiles.includes(profile.id)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: profile.color }}
                    >
                      {profile.short_name}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{profile.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Opslaan...' : isNew ? 'Aanmaken' : 'Opslaan'}
          </button>
          <Link href="/admin/careers" className="text-gray-600 hover:text-gray-900">Annuleren</Link>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
