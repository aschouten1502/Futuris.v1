'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GuidedTour, type TourStep } from '@/components/admin/GuidedTour'
import { TourButton } from '@/components/admin/TourButton'

interface Setting {
  id: string
  key: string
  value: string | null
  description: string | null
}

interface CategoryConfig {
  title: { key: string; value: string }
  subtitle: { key: string; value: string }
  description: { key: string; value: string }
  icon: { key: string; value: string }
}

interface InfoBoxConfig {
  title: { key: string; value: string }
  description: { key: string; value: string }
  icon: { key: string; value: string }
}

// Tour steps for the homepage settings
const tourSteps: TourStep[] = [
  {
    target: '[data-tour="dp-card"]',
    title: 'D&P Categorie',
    description: 'Hier pas je de instellingen aan voor de D&P sectie op de homepage. Dit is wat leerlingen zien als eerste keuze.',
    position: 'right',
  },
  {
    target: '[data-tour="mavo-card"]',
    title: 'Mavo Categorie',
    description: 'Hier pas je de instellingen aan voor de Mavo sectie. Deze staat naast D&P op de homepage.',
    position: 'left',
  },
  {
    target: '[data-tour="icon-field"]',
    title: 'Icoon kiezen',
    description: 'Kies een emoji als icoon voor de categorie. Dit wordt getoond in de keuzekaart op de homepage.',
    position: 'bottom',
  },
  {
    target: '[data-tour="title-field"]',
    title: 'Titel aanpassen',
    description: 'De titel is de grote tekst die leerlingen zien. Houd het kort en duidelijk.',
    position: 'bottom',
  },
  {
    target: '[data-tour="subtitle-field"]',
    title: 'Ondertitel',
    description: 'De ondertitel geeft extra context. Bijvoorbeeld "Dienstverlening & Producten" voor D&P.',
    position: 'bottom',
  },
  {
    target: '[data-tour="description-field"]',
    title: 'Beschrijving',
    description: 'Deze beschrijving wordt getoond wanneer een leerling de categorie selecteert.',
    position: 'top',
  },
  {
    target: '[data-tour="preview"]',
    title: 'Live Preview',
    description: 'Hier zie je direct hoe de keuzekaart eruitziet op de homepage. Wijzigingen zijn meteen zichtbaar.',
    position: 'top',
  },
  {
    target: '[data-tour="save-button"]',
    title: 'Opslaan',
    description: 'Vergeet niet op "Opslaan" te klikken om je wijzigingen door te voeren!',
    position: 'top',
  },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showTour, setShowTour] = useState(false)
  const [previewKey, setPreviewKey] = useState(() => Date.now())
  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('key', { ascending: true })

    if (error) {
      console.error('Error fetching settings:', error)
      setMessage({ type: 'error', text: 'Kon instellingen niet laden' })
    } else {
      setSettings(data || [])
    }
    setLoading(false)
  }

  function getValue(key: string): string {
    const setting = settings.find(s => s.key === key)
    return setting?.value || ''
  }

  function updateValue(key: string, value: string) {
    setSettings(prev =>
      prev.map(s => s.key === key ? { ...s, value: value || null } : s)
    )
  }

  const refreshPreview = () => {
    setPreviewKey(Date.now())
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)

    try {
      for (const setting of settings) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: setting.value, updated_at: new Date().toISOString() })
          .eq('key', setting.key)

        if (error) throw error
      }
      setMessage({ type: 'success', text: 'Instellingen opgeslagen!' })
      refreshPreview()
    } catch {
      setMessage({ type: 'error', text: 'Kon instellingen niet opslaan' })
    }

    setSaving(false)
  }

  const dpConfig: CategoryConfig = {
    title: { key: 'dp_category_title', value: getValue('dp_category_title') },
    subtitle: { key: 'dp_category_subtitle', value: getValue('dp_category_subtitle') },
    description: { key: 'dp_category_description', value: getValue('dp_category_description') },
    icon: { key: 'dp_category_icon', value: getValue('dp_category_icon') },
  }

  const mavoConfig: CategoryConfig = {
    title: { key: 'mavo_category_title', value: getValue('mavo_category_title') },
    subtitle: { key: 'mavo_category_subtitle', value: getValue('mavo_category_subtitle') },
    description: { key: 'mavo_category_description', value: getValue('mavo_category_description') },
    icon: { key: 'mavo_category_icon', value: getValue('mavo_category_icon') },
  }

  const dpModulesConfig: InfoBoxConfig = {
    title: { key: 'dp_modules_title', value: getValue('dp_modules_title') },
    description: { key: 'dp_modules_description', value: getValue('dp_modules_description') },
    icon: { key: 'dp_modules_icon', value: getValue('dp_modules_icon') },
  }

  const keuzevakkenConfig: InfoBoxConfig = {
    title: { key: 'keuzevakken_title', value: getValue('keuzevakken_title') },
    description: { key: 'keuzevakken_description', value: getValue('keuzevakken_description') },
    icon: { key: 'keuzevakken_icon', value: getValue('keuzevakken_icon') },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laden...</div>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      {/* Left side - Settings editor */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Header with Tour Button */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Homepage Instellingen</h1>
            <p className="text-gray-600 mt-1">
              Pas de categorieen op de homepage aan. Hier kan je de titels, beschrijvingen en iconen instellen voor D&P en Mavo.
            </p>
          </div>
          <TourButton onClick={() => setShowTour(true)} />
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Section: Categorieen */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Categorie keuzekaarten</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* D&P Settings */}
            <div data-tour="dp-card">
              <CategorySettingsCard
                title="D&P Categorie"
                color="#003C46"
                config={dpConfig}
                onChange={updateValue}
                showTourAttributes={true}
              />
            </div>

            {/* Mavo Settings */}
            <div data-tour="mavo-card">
              <CategorySettingsCard
                title="Mavo Categorie"
                color="#7C5CBF"
                config={mavoConfig}
                onChange={updateValue}
                showTourAttributes={false}
              />
            </div>
          </div>
        </div>

        {/* Section: Info Boxes */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Info boxes</h2>
          <p className="text-sm text-gray-500 mb-4">Deze boxes staan onderaan de homepage en linken naar extra pagina&apos;s.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* D&P Modules Info Box */}
            <InfoBoxSettingsCard
              title="D&P Modules"
              color="#8B5CF6"
              bgClass="bg-surface-lavender-light"
              config={dpModulesConfig}
              onChange={updateValue}
              linkTo="/dp-modules"
            />

            {/* Keuzevakken Info Box */}
            <InfoBoxSettingsCard
              title="Keuzevakken"
              color="#10B981"
              bgClass="bg-surface-sage-light"
              config={keuzevakkenConfig}
              onChange={updateValue}
              linkTo="/vakken"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end" data-tour="save-button">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-futuris-teal text-white font-medium rounded-lg hover:bg-futuris-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
      </div>

      {/* Right side - Live Preview */}
      <div className="w-[380px] shrink-0">
        <div className="sticky top-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Preview header */}
            <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-medium">Live preview</span>
              </div>
              <button
                type="button"
                onClick={refreshPreview}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Vernieuw
              </button>
            </div>
            {/* Preview iframe */}
            <div className="h-[600px] overflow-hidden">
              <iframe
                key={previewKey}
                src={`/?_t=${previewKey}`}
                title="Preview Homepage"
                className="w-full h-full border-0"
                style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', height: '182%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Guided Tour */}
      <GuidedTour
        steps={tourSteps}
        isOpen={showTour}
        onClose={() => setShowTour(false)}
      />
    </div>
  )
}

function CategorySettingsCard({
  title,
  color,
  config,
  onChange,
  showTourAttributes,
}: {
  title: string
  color: string
  config: CategoryConfig
  onChange: (key: string, value: string) => void
  showTourAttributes: boolean
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-4 border-b"
        style={{ backgroundColor: `${color}10`, borderColor: `${color}30` }}
      >
        <h2 className="font-bold text-lg" style={{ color }}>{title}</h2>
      </div>

      <div className="p-5 space-y-4">
        {/* Preview */}
        <div data-tour={showTourAttributes ? "preview" : undefined}>
          <label className="block text-xs font-medium text-gray-500 mb-2">Preview</label>
          <div
            className="p-3 rounded-xl border-2"
            style={{
              backgroundColor: `${color}08`,
              borderColor: `${color}30`
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: `${color}15` }}
              >
                {config.icon.value || '📚'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base mb-0.5" style={{ color }}>
                  {config.title.value || 'Titel'}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {config.subtitle.value || 'Ondertitel'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div data-tour={showTourAttributes ? "icon-field" : undefined}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Icoon (emoji)</label>
          <input
            type="text"
            value={config.icon.value}
            onChange={(e) => onChange(config.icon.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-futuris-teal/50 focus:border-futuris-teal transition-colors"
            placeholder="bijv. 🎯"
          />
        </div>

        <div data-tour={showTourAttributes ? "title-field" : undefined}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
          <input
            type="text"
            value={config.title.value}
            onChange={(e) => onChange(config.title.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-futuris-teal/50 focus:border-futuris-teal transition-colors"
            placeholder="bijv. D&P"
          />
        </div>

        <div data-tour={showTourAttributes ? "subtitle-field" : undefined}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ondertitel</label>
          <input
            type="text"
            value={config.subtitle.value}
            onChange={(e) => onChange(config.subtitle.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-futuris-teal/50 focus:border-futuris-teal transition-colors"
            placeholder="bijv. Dienstverlening & Producten"
          />
        </div>

        <div data-tour={showTourAttributes ? "description-field" : undefined}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
          <textarea
            value={config.description.value}
            onChange={(e) => onChange(config.description.key, e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-futuris-teal/50 focus:border-futuris-teal transition-colors resize-none"
            placeholder="Korte beschrijving..."
          />
        </div>
      </div>
    </div>
  )
}

function InfoBoxSettingsCard({
  title,
  color,
  bgClass,
  config,
  onChange,
  linkTo,
}: {
  title: string
  color: string
  bgClass: string
  config: InfoBoxConfig
  onChange: (key: string, value: string) => void
  linkTo: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-4 border-b"
        style={{ backgroundColor: `${color}10`, borderColor: `${color}30` }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg" style={{ color }}>{title}</h2>
          <span className="text-xs text-gray-500">→ {linkTo}</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Preview */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Preview</label>
          <div className={`p-4 rounded-xl border border-gray-200 ${bgClass}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-bold text-futuris-teal mb-1 flex items-center gap-2">
                  <span>{config.icon.value || '📋'}</span>
                  <span>{config.title.value || 'Titel'}</span>
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {config.description.value || 'Beschrijving...'}
                </p>
              </div>
              <span className="text-futuris-teal text-xl">→</span>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Icoon (emoji)</label>
          <input
            type="text"
            value={config.icon.value}
            onChange={(e) => onChange(config.icon.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-futuris-teal/50 focus:border-futuris-teal transition-colors"
            placeholder="bijv. 📋"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
          <input
            type="text"
            value={config.title.value}
            onChange={(e) => onChange(config.title.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-futuris-teal/50 focus:border-futuris-teal transition-colors"
            placeholder="bijv. D&P Modules"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
          <textarea
            value={config.description.value}
            onChange={(e) => onChange(config.description.key, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-futuris-teal/50 focus:border-futuris-teal transition-colors resize-none"
            placeholder="Beschrijving van wat deze pagina bevat..."
          />
        </div>
      </div>
    </div>
  )
}
