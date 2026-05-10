'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin', label: '📊', title: 'Dashboard' },
  { href: '/admin/orders', label: '🧾', title: 'Pesanan' },
  { href: '/admin/menu', label: '🍽️', title: 'Menu' },
  { href: '/admin/tables', label: '🪑', title: 'Meja' },
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
    <div className="min-h-dvh bg-[#f5f0e8] flex flex-col">
      <header className="sticky top-0 z-10 bg-[#3d2b1f] px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl text-[#f5f0e8] font-semibold">JANJIA</h1>
          <p className="text-[10px] text-[#c4a882] -mt-0.5">Admin Panel</p>
        </div>
        <button onClick={handleLogout} className="text-xs text-[#c4a882] border border-[#6b4c3b] px-3 py-1.5 rounded-lg min-h-[36px]">Keluar</button>
      </header>
      <main className="flex-1 pb-24">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-[#3d2b1f] border-t border-[#2a1e15] flex">
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 min-h-[56px] transition-colors ${active ? 'text-[#e07a45]' : 'text-[#6b4c3b]'}`}>
              <span className="text-xl">{item.label}</span>
              <span className="text-[10px] font-medium">{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
