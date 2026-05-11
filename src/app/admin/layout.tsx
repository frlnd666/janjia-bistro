'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, LayoutGrid, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Pesanan', icon: ShoppingBag },
  { href: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/admin/tables', label: 'Meja', icon: LayoutGrid },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(15,11,7,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 20px',
        height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>JANJIA</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-2px' }}>Admin Panel</p>
        </div>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: 'var(--text-muted)', fontSize: '13px',
          padding: '8px 12px', borderRadius: '10px',
          border: '1px solid var(--border)',
          background: 'transparent', transition: 'all 0.15s',
        }}>
          <LogOut size={14} strokeWidth={1.5} />
          Keluar
        </button>
      </header>

      {/* Content */}
      <main style={{ flex: 1, paddingBottom: '80px' }}>
        {children}
      </main>

      {/* Bottom Nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(15,11,7,0.95)', backdropFilter: 'blur(24px)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        paddingTop: '8px',
      }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '4px',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'color 0.15s',
            }}>
              <Icon size={22} strokeWidth={active ? 2 : 1.5} />
              <span style={{ fontSize: '10px', fontWeight: active ? 600 : 400 }}>{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
