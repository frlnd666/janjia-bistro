'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { OrderWithItems, OrderStatus } from '@/types'
import { StatusChip } from '@/components/ui/StatusChip'
import { formatRupiah, formatTime } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
const statusFlow: OrderStatus[] = ['new', 'preparing', 'ready', 'completed']
const statusDesc: Record<OrderStatus, string> = {
  new: 'Pesananmu diterima, menunggu dapur mulai memasak...',
  preparing: 'Sedang dimasak dengan penuh cinta! 🍳',
  ready: 'Pesananmu siap! Pelayan akan segera mengantarkan 🎉',
  completed: 'Selesai! Terima kasih sudah makan di JANJIA 🙏',
  cancelled: 'Pesanan dibatalkan. Hubungi kasir jika ada pertanyaan.',
}
function TrackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('order')
  const tableCode = searchParams.get('table')
  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  async function fetchOrder() {
    if (!orderId) return
    const supabase = createClient()
    const { data } = await supabase.from('orders').select('*, tables(code), order_items(*, menu_items(name, image_url))').eq('id', orderId).single()
    if (data) setOrder(data as OrderWithItems)
    setLoading(false)
  }
  useEffect(() => {
    fetchOrder()
    const supabase = createClient()
    const channel = supabase.channel('track-order').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, () => fetchOrder()).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [orderId])
  async function callWaiter() {
    if (!order) return
    const supabase = createClient()
    await supabase.from('waiter_calls').insert({ table_id: order.table_id, status: 'pending' })
    alert('Pelayan sedang menuju mejamu!')
  }
  if (loading) return (
    <div className="min-h-dvh bg-[#f5f0e8] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#c4622d] border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!order) return (
    <div className="min-h-dvh bg-[#f5f0e8] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-[#3d2b1f] font-semibold mb-4">Pesanan tidak ditemukan</p>
      <Button onClick={() => router.push('/')}>Kembali</Button>
    </div>
  )
  const stepIndex = statusFlow.indexOf(order.status as OrderStatus)
  return (
    <div className="min-h-dvh bg-[#f5f0e8] pb-24">
      <div className="bg-[#3d2b1f] px-4 pt-12 pb-6">
        <p className="text-[#c4a882] text-xs tracking-widest uppercase font-medium">Meja {tableCode}</p>
        <h1 className="font-display text-2xl text-[#f5f0e8] font-semibold mt-1">Status Pesanan</h1>
        <p className="text-[#e2d9cc] text-xs mt-1">Dipesan pukul {formatTime(order.created_at)}</p>
      </div>
      <div className="px-4 pt-5 space-y-4">
        <motion.div className="bg-white rounded-2xl border border-[#e2d9cc] p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-[#3d2b1f]">Status</p>
            <StatusChip status={order.status as OrderStatus} />
          </div>
          <div className="flex gap-1 mb-4">
            {statusFlow.map((s, i) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors duration-500 ${i <= stepIndex ? 'bg-[#c4622d]' : 'bg-[#ede5d8]'}`} />
            ))}
          </div>
          <p className="text-sm text-[#6b4c3b]">{statusDesc[order.status as OrderStatus]}</p>
        </motion.div>
        <div className="bg-white rounded-2xl border border-[#e2d9cc] p-4">
          <h3 className="font-semibold text-[#3d2b1f] text-sm mb-3">Detail Pesanan</h3>
          <div className="space-y-2">
            {order.order_items.map(item => (
              <div key={item.id} className="flex justify-between text-sm text-[#6b4c3b]">
                <span>{item.menu_items.name} × {item.qty}</span>
                <span>{formatRupiah(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="border-t border-[#e2d9cc] pt-2 flex justify-between font-bold text-[#3d2b1f]">
              <span>Total</span>
              <span className="text-[#c4622d]">{formatRupiah(order.total)}</span>
            </div>
          </div>
        </div>
        {order.status !== 'completed' && order.status !== 'cancelled' && (
          <Button variant="ghost" fullWidth onClick={callWaiter}>🔔 Panggil Pelayan</Button>
        )}
        {order.status === 'completed' && (
          <Button fullWidth onClick={() => router.push(`/menu/${tableCode}`)}>Pesan Lagi</Button>
        )}
      </div>
    </div>
  )
}
export default function TrackPage() {
  return <Suspense fallback={<div className="min-h-dvh bg-[#f5f0e8] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#c4622d] border-t-transparent rounded-full animate-spin" /></div>}><TrackContent /></Suspense>
}
