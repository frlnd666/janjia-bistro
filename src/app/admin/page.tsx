'use client'

export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatRupiah } from '@/lib/utils'
import { ShoppingBag, TrendingUp, Flame, LayoutGrid, ChefHat, Receipt, Users, ChevronRight } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ ordersToday: 0, revenueToday: 0, activeOrders: 0, occupiedTables: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const sb = createClient()
        const today = new Date().toISOString().split('T')[0]
        const [r1, r2, r3] = await Promise.all([
          sb.from('orders').select('total').gte('created_at', today),
          sb.from('orders').select('id').in('status', ['new','preparing','ready']),
          sb.from('tables').select('id').eq('status','occupied'),
        ])
        setStats({
          ordersToday: r1.data?.length ?? 0,
          revenueToday: r1.data?.reduce((s,o) => s+(o.total??0), 0) ?? 0,
          activeOrders: r2.data?.length ?? 0,
          occupiedTables: r3.data?.length ?? 0,
        })
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const cards = [
    { label: 'Pesanan Hari Ini', value: stats.ordersToday.toString(), icon: ShoppingBag, accent: 'var(--green)', dim: 'var(--green-dim)' },
    { label: 'Pendapatan', value: formatRupiah(stats.revenueToday), icon: TrendingUp, accent: 'var(--blue)', dim: 'var(--blue-dim)' },
    { label: 'Pesanan Aktif', value: stats.activeOrders.toString(), icon: Flame, accent: 'var(--accent)', dim: 'var(--accent-dim)' },
    { label: 'Meja Terisi', value: stats.occupiedTables.toString(), icon: LayoutGrid, accent: 'var(--amber)', dim: 'var(--amber-dim)' },
  ]

  const links = [
    { href: '/kitchen', label: 'Dashboard Dapur', sub: 'Antrian masak realtime', icon: ChefHat, accent: 'var(--accent)' },
    { href: '/cashier', label: 'Dashboard Kasir', sub: 'Proses pembayaran', icon: Receipt, accent: 'var(--blue)' },
    { href: '/waiter', label: 'Dashboard Pelayan', sub: 'Kelola pesanan meja', icon: Users, accent: 'var(--green)' },
  ]

  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Stats */}
      <section>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Overview Hari Ini</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {cards.map(({ label, value, icon: Icon, accent, dim }) => (
            <div key={label} style={{
              background: dim, borderRadius: '20px',
              border: `1px solid ${accent}30`,
              padding: '20px 18px',
            }}>
              <Icon size={20} color={accent} strokeWidth={1.5} style={{ marginBottom: '16px' }} />
              {loading
                ? <div style={{ height: '32px', width: '60px', background: 'var(--surface-3)', borderRadius: '8px', marginBottom: '6px' }} />
                : <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1, marginBottom: '6px' }}>{value}</p>
              }
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Akses Cepat Staff</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {links.map(({ href, label, sub, icon: Icon, accent }) => (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              background: 'var(--surface-1)', borderRadius: '18px',
              border: '1px solid var(--border)',
              padding: '18px 20px',
              transition: 'border-color 0.15s',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '14px',
                background: `${accent}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={20} color={accent} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{label}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub}</p>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" strokeWidth={1.5} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
