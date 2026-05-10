'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { formatRupiah } from '@/lib/utils'

type Stats = { totalOrders: number; totalRevenue: number; activeOrders: number; activeTables: number }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalRevenue: 0, activeOrders: 0, activeTables: 0 })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()
      const today = new Date(); today.setHours(0, 0, 0, 0)
      const [ordersRes, activeRes, tablesRes] = await Promise.all([
        supabase.from('orders').select('total, status').gte('created_at', today.toISOString()),
        supabase.from('orders').select('id').in('status', ['new', 'preparing', 'ready']),
        supabase.from('tables').select('id').eq('status', 'occupied'),
      ])
      const orders = ordersRes.data ?? []
      const revenue = orders.filter(o => o.status === 'completed').reduce((acc, o) => acc + o.total, 0)
      setStats({ totalOrders: orders.length, totalRevenue: revenue, activeOrders: activeRes.data?.length ?? 0, activeTables: tablesRes.data?.length ?? 0 })
      setLoading(false)
    }
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const cards = [
    { label: 'Pesanan Hari Ini', value: stats.totalOrders.toString(), icon: '🧾', color: 'bg-[#3d2b1f] text-[#f5f0e8]' },
    { label: 'Pendapatan Hari Ini', value: formatRupiah(stats.totalRevenue), icon: '💰', color: 'bg-[#5c6b3a] text-[#f5f0e8]' },
    { label: 'Pesanan Aktif', value: stats.activeOrders.toString(), icon: '🔥', color: 'bg-[#c4622d] text-white' },
    { label: 'Meja Terisi', value: stats.activeTables.toString(), icon: '🪑', color: 'bg-[#6b4c3b] text-[#f5f0e8]' },
  ]

  return (
    <div className="px-4 py-5">
      <p className="text-xs text-[#c4a882] font-medium uppercase tracking-widest mb-4">Overview Hari Ini</p>
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-[#e2d9cc] rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {cards.map((card, i) => (
            <motion.div key={card.label} className={`rounded-2xl p-4 ${card.color}`}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <p className="text-2xl mb-2">{card.icon}</p>
              <p className="font-bold text-xl leading-tight">{card.value}</p>
              <p className="text-xs opacity-70 mt-1">{card.label}</p>
            </motion.div>
          ))}
        </div>
      )}
      <div className="mt-6 bg-white rounded-2xl border border-[#e2d9cc] p-4">
        <p className="text-sm font-semibold text-[#3d2b1f] mb-2">Akses Cepat Staff</p>
        <div className="space-y-2">
          {[
            { href: '/kitchen', label: '👨‍🍳 Buka Dashboard Dapur' },
            { href: '/waiter', label: '🛎️ Buka Dashboard Pelayan' },
          ].map(link => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 bg-[#f5f0e8] rounded-xl text-sm text-[#3d2b1f] font-medium border border-[#e2d9cc]">
              {link.label} <span className="text-[#c4a882]">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
