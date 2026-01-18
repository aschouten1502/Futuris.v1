'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/levels', label: 'Niveaus', icon: '🏫' },
  { href: '/admin/profiles', label: 'Profielen', icon: '🎓' },
  { href: '/admin/subjects', label: 'Vakken', icon: '📚' },
  { href: '/admin/careers', label: 'Beroepen', icon: '💼' },
  { href: '/admin/education', label: 'Opleidingen', icon: '🎓' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <Link href="/" className="text-xl font-bold text-futuris-teal">Futuris Admin</Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-futuris-teal/10 text-futuris-teal'
                      : 'text-text-muted hover:bg-gray-100 hover:text-text'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
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
        {children}
      </main>
    </div>
  )
}
