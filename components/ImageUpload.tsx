'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

type ImageOrientation = 'landscape' | 'portrait' | 'square'

interface ImageUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  onOrientationDetect?: (orientation: ImageOrientation) => void
  folder?: string
  aspectRatio?: 'square' | 'landscape' | 'portrait'
}

export function ImageUpload({
  value,
  onChange,
  onOrientationDetect,
  folder = 'homepage',
  aspectRatio = 'landscape',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const aspectClasses = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const uploadFile = async (file: File) => {
    setError(null)
    setIsUploading(true)

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Alleen afbeeldingen zijn toegestaan')
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Afbeelding mag maximaal 5MB zijn')
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('site-images')
        .getPublicUrl(fileName)

      const publicUrl = urlData.publicUrl
      onChange(publicUrl)

      // Detect image orientation
      if (onOrientationDetect) {
        const img = new window.Image()
        img.onload = () => {
          const orientation: ImageOrientation =
            img.width > img.height ? 'landscape' :
            img.height > img.width ? 'portrait' :
            'square'
          onOrientationDetect(orientation)
        }
        img.src = publicUrl
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload mislukt')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      uploadFile(file)
    }
  }, [folder])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleRemove = async () => {
    if (value) {
      // Try to delete from storage (ignore errors if file doesn't exist)
      try {
        const path = value.split('/site-images/')[1]
        if (path) {
          await supabase.storage.from('site-images').remove([path])
        }
      } catch {
        // Ignore deletion errors
      }
    }
    onChange(null)
  }

  return (
    <div className="space-y-2">
      {value ? (
        // Preview with remove button
        <div className="relative group">
          <div className={`relative w-full ${aspectClasses[aspectRatio]} rounded-xl overflow-hidden bg-gray-100 border border-gray-200`}>
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Vervangen
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
            >
              Verwijderen
            </button>
          </div>
        </div>
      ) : (
        // Drop zone
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative w-full ${aspectClasses[aspectRatio]} rounded-xl border-2 border-dashed
            flex flex-col items-center justify-center cursor-pointer transition-all
            ${isDragging
              ? 'border-futuris-teal bg-futuris-teal/5'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
            }
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-futuris-teal border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Uploaden...</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 text-center px-4">
                <span className="font-medium text-futuris-teal">Klik om te uploaden</span>
                <br />
                <span className="text-xs text-gray-400">of sleep een afbeelding hierheen</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG tot 5MB</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
