'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatRupiah } from '@/lib/utils'
import {
  ShoppingBag, TrendingUp, Flame, LayoutGrid,
  ChevronRight, UtensilsCrossed, Users, ClipboardList
} from 'lucide-react'

interface Stats {
  ordersToday: number
  revenueToday: number
  activeOrders: number
  occupiedTables: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ ordersToday: 0, revenueToday: 0, activeOrders: 0, occupiedTables: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createClient()
        const today = new Date().toISOString().split('T')[0]
        const [{ data: ordersToday }, { data: activeOrders }, { data: tables }] = await Promise.all([
          supabase.from('orders').select('total').gte('created_at', today),
          supabase.from('orders').select('id').in('status', ['new', 'preparing', 'ready']),
          supabase.from('tables').select('status').eq('status', 'occupied'),
        ])
        setStats({
          ordersToday: ordersToday?.length ?? 0,
          revenueToday: ordersToday?.reduce((s, o) => s + (o.total ?? 0), 0) ?? 0,
          activeOrders: activeOrders?.length ?? 0,
          occupiedTables: tables?.length ?? 0,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Pesanan Hari Ini', value: stats.ordersToday.toString(), icon: ShoppingBag, color: 'bg-[#1e2a1a] border-[#2d4020]', iconColor: 'text-[#7ab648]' },
    { label: 'Pendapatan Hari Ini', value: formatRupiah(stats.revenueToday), icon: TrendingUp, color: 'bg-[#1a1e2a] border-[#20283d]', iconColor: 'text-[#4882c4]' },
    { label: 'Pesanan Aktif', value: stats.activeOrders.toString(), icon: Flame, color: 'bg-[#2a1a14] border-[#3d2010]', iconColor: 'text-[#c4622d]' },
    { label: 'Meja Terisi', value: stats.occupiedTables.toString(), icon: LayoutGrid, color: 'bg-[#1a1a2a] border-[#28203d]', iconColor: 'text-[#9b6dc4]' },
  ]

  const quickLinks = [
    { label: 'Dashboard Dapur', sub: 'Lihat antrian masak', href: '/kitchen', icon: UtensilsCrossed },
    { label: 'Dashboard Kasir', sub: 'Proses pembayaran', href: '/cashier', icon: ClipboardList },
    { label: 'Dashboard Pelayan', sub: 'Kelola pesanan meja', href: '/waiter', icon: Users },
  ]

  return (
    <div className="px-4 py-5 space-y-6">
      {/* Stats Grid */}
      <div>
        <p className="text-xs text-[#c4a882] font-medium uppercase tracking-widest mb-3">Overview Hari Ini</p>
        <div className="grid grid-cols-2 gap-3">
          {statCards.map(({ label, value, icon: Icon, color, iconColor }) => (
            <div key={label} className={`${color} border rounded-2xl p-4`}>
              <Icon className={`w-5 h-5 ${iconColor} mb-3`} strokeWidth={1.5} />
              {loading
                ? <div className="h-7 w-16 bg-[#2a2016] rounded-lg animate-pulse mb-1" />
                : <p className="text-2xl font-bold text-white leading-none mb-1">{value}</p>
              }
              <p className="text-[#c4a882] text-[11px] leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <p className="text-xs text-[#c4a882] font-medium uppercase tracking-widest mb-3">Akses Cepat Staff</p>
        <div className="space-y-2">
          {quickLinks.map(({ label, sub, href, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-4 bg-[#2a1f14] hover:bg-[#3a2a1a] active:scale-[0.98] border border-[#3d2b1f] rounded-2xl px-4 py-3.5 transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#1a1108] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#c4622d]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#f5f0e8] text-sm font-medium">{label}</p>
                <p className="text-[#c4a882] text-xs">{sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6b4c3b] shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
