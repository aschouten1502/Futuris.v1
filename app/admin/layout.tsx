'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavItem {
  href: string
  label: string
}

interface NavGroup {
  label: string
  icon: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Richtingen',
    icon: '🎯',
    items: [
      { href: '/admin/directions', label: 'Overzicht' },
      { href: '/admin/directions/new', label: '+ Nieuwe richting' },
    ],
  },
  {
    label: 'Stamgegevens',
    icon: '📋',
    items: [
      { href: '/admin/subjects', label: 'Vakken' },
      { href: '/admin/careers', label: 'Beroepen' },
      { href: '/admin/education', label: 'Opleidingen' },
    ],
  },
]

function NavFolder({ group, pathname }: { group: NavGroup; pathname: string }) {
  const isGroupActive = group.items.some(item =>
    pathname === item.href || pathname.startsWith(item.href + '/')
  )
  const [isOpen, setIsOpen] = useState(isGroupActive)

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isGroupActive
            ? 'text-futuris-teal'
            : 'text-text-muted hover:bg-gray-100 hover:text-text'
        }`}
      >
        <div className="flex items-center gap-3">
          <span>{group.icon}</span>
          <span>{group.label}</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="ml-6 mt-1 space-y-0.5 border-l-2 border-gray-200 pl-3">
          {group.items.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin/directions' && pathname.startsWith(item.href + '/'))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-futuris-teal/10 text-futuris-teal font-medium'
                    : 'text-text-muted hover:bg-gray-100 hover:text-text'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isInIframe, setIsInIframe] = useState(false)

  useEffect(() => {
    setIsInIframe(window.self !== window.top)
  }, [])

  // Block admin access when in preview iframe
  if (isInIframe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="text-center max-w-sm">
          <p className="text-6xl mb-4">🚫</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Preview modus
          </h1>
          <p className="text-gray-500 mb-6">
            Je kan in de preview niet naar het beheer platform.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-futuris-teal text-white rounded-lg font-medium hover:bg-futuris-teal/90 transition-colors"
          >
            Ga naar homepagina
          </a>
        </div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const isDashboardActive = pathname === '/admin'

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <Link href="/" className="text-xl font-bold text-futuris-teal">Futuris Admin</Link>
          </div>

          <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Content section */}
            <div>
              <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Content
              </p>
              <div className="space-y-1">
                {navGroups.map((group) => (
                  <NavFolder key={group.label} group={group} pathname={pathname} />
                ))}
              </div>
            </div>

            {/* System section */}
            <div>
              <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Systeem
              </p>
              <div className="space-y-1">
                <Link
                  href="/admin"
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isDashboardActive
                      ? 'bg-futuris-teal/10 text-futuris-teal'
                      : 'text-text-muted hover:bg-gray-100 hover:text-text'
                  }`}
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/admin/preview"
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === '/admin/preview'
                      ? 'bg-futuris-teal/10 text-futuris-teal'
                      : 'text-text-muted hover:bg-gray-100 hover:text-text'
                  }`}
                >
                  <span>📱</span>
                  <span>Preview</span>
                </Link>
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-text-muted hover:bg-gray-100 hover:text-text rounded-lg transition-colors"
            >
              <span>🚪</span>
              <span>Uitloggen</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            title="Pagina verversen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Verversen
          </button>
        </div>
        {children}
      </main>
    </div>
  )
}
