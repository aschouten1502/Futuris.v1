'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Toast, useToast } from '@/components/ui/Toast'
import Link from 'next/link'

export default function LevelEditPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { toast, showToast, hideToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    years: 5,
  })

  useEffect(() => {
    fetchLevel()
  }, [params.id])

  const fetchLevel = async () => {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      showToast('Niveau niet gevonden', 'error')
      router.push('/admin/levels')
      return
    }

    setForm({
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      years: data.years,
    })
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('levels')
      .update({
        description: form.description || null,
        years: form.years,
      })
      .eq('id', params.id)

    if (error) {
      showToast('Fout bij opslaan', 'error')
    } else {
      showToast('Niveau opgeslagen', 'success')
    }
    setSaving(false)
  }

  if (loading) return <div className="text-gray-500">Laden...</div>

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/levels" className="text-primary-600 hover:underline text-sm">&larr; Terug naar niveaus</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">{form.name} bewerken</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Niveau gegevens</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
                <input
                  type="text"
                  value={form.name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Naam kan niet worden gewijzigd</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Slug kan niet worden gewijzigd</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aantal leerjaren</label>
              <select
                value={form.years}
                onChange={(e) => setForm({ ...form, years: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                {[4, 5, 6].map(y => (
                  <option key={y} value={y}>{y} jaar</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                placeholder="Korte beschrijving van dit niveau"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
          <Link href="/admin/levels" className="text-gray-600 hover:text-gray-900">Annuleren</Link>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
