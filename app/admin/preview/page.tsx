'use client'

import { useState } from 'react'

const devices = [
  { name: 'iPhone SE', width: 375, height: 667, scale: 0.85, type: 'phone' as const },
  { name: 'iPhone 14', width: 393, height: 852, scale: 0.85, type: 'phone' as const },
  { name: 'iPhone 15 Pro Max', width: 430, height: 932, scale: 0.8, type: 'phone' as const },
  { name: 'iPad Air', width: 820, height: 1180, scale: 0.55, type: 'tablet' as const },
]

const pages = [
  { label: 'Homepagina', path: '/' },
  { label: 'Ouders', path: '/ouders' },
]

export default function PreviewPage() {
  const [activeDevice, setActiveDevice] = useState(1)
  const [activePath, setActivePath] = useState('/')
  const [directionSlug, setDirectionSlug] = useState('')
  const [cacheKey, setCacheKey] = useState(() => Date.now())

  const device = devices[activeDevice]
  const frameWidth = device.width * device.scale
  const frameHeight = device.height * device.scale

  const basePath = activePath === 'richting'
    ? `/richting/${directionSlug || 'test'}`
    : activePath

  // Add cache-busting timestamp to bypass Next.js ISR cache
  const previewUrl = `${basePath}?_t=${cacheKey}`

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Preview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bekijk hoe de app eruitziet op verschillende apparaten.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCacheKey(Date.now())}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Vernieuw
        </button>
      </div>

      {/* Page selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Pagina:</span>
          {pages.map(page => (
            <button
              key={page.path}
              type="button"
              onClick={() => setActivePath(page.path)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activePath === page.path
                  ? 'bg-futuris-teal text-white font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActivePath('richting')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activePath === 'richting'
                ? 'bg-futuris-teal text-white font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Richting
          </button>
          {activePath === 'richting' && (
            <input
              type="text"
              value={directionSlug}
              onChange={e => setDirectionSlug(e.target.value)}
              placeholder="slug (bijv. techniek)"
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg w-48"
            />
          )}
          <span className="text-xs text-gray-400 ml-auto">{previewUrl}</span>
        </div>
      </div>

      {/* Device tabs */}
      <div className="flex gap-2 mb-6">
        {devices.map((d, i) => (
          <button
            key={d.name}
            type="button"
            onClick={() => setActiveDevice(i)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeDevice === i
                ? 'bg-futuris-teal text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <span>{d.type === 'tablet' ? '📱' : '📱'}</span>
            <span>{d.name}</span>
            <span className={`text-xs ${activeDevice === i ? 'text-white/70' : 'text-gray-400'}`}>
              {d.width}x{d.height}
            </span>
          </button>
        ))}
      </div>

      {/* Device preview */}
      <div className="flex justify-center">
        <div>
          {/* Device frame */}
          <div
            className="relative bg-gray-900 shadow-2xl mx-auto"
            style={{
              width: frameWidth + 28,
              height: frameHeight + 28,
              padding: 14,
              borderRadius: device.type === 'tablet' ? 28 : 40,
            }}
          >
            {/* Notch (phones) / Camera (iPad) */}
            {device.type === 'phone' && (
              <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[28%] h-[22px] bg-gray-900 rounded-b-2xl z-10" />
            )}
            {device.type === 'tablet' && (
              <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full z-10" />
            )}

            {/* Screen */}
            <div
              className="bg-white overflow-hidden relative"
              style={{
                width: frameWidth,
                height: frameHeight,
                borderRadius: device.type === 'tablet' ? 16 : 28,
              }}
            >
              <iframe
                key={`${device.name}-${previewUrl}-${cacheKey}`}
                src={previewUrl}
                title={`Preview op ${device.name}`}
                style={{
                  width: device.width,
                  height: device.height,
                  transform: `scale(${device.scale})`,
                  transformOrigin: 'top left',
                  border: 'none',
                }}
              />
            </div>
          </div>

          {/* Device label */}
          <p className="text-center text-sm text-gray-400 mt-4">
            {device.name} &middot; {device.width} &times; {device.height}
          </p>
        </div>
      </div>
    </div>
  )
}
