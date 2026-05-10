'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useOrders } from '@/hooks/useOrders'
import { useWaiterCalls } from '@/hooks/useWaiterCalls'
import { StatusChip } from '@/components/ui/StatusChip'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { formatTime, formatRupiah } from '@/lib/utils'
import { OrderWithItems, OrderStatus } from '@/types'

export default function WaiterPage() {
  const { orders, loading: ordersLoading } = useOrders(['ready', 'new', 'preparing'])
  const { calls, loading: callsLoading } = useWaiterCalls()

  async function completeOrder(id: string) {
    const supabase = createClient()
    await supabase.from('orders').update({ status: 'completed' }).eq('id', id)
  }
  async function resolveCall(id: string) {
    const supabase = createClient()
    await supabase.from('waiter_calls').update({ status: 'resolved' }).eq('id', id)
  }

  return (
    <div className="min-h-dvh bg-[#f5f0e8]">
      <div className="sticky top-0 z-10 bg-[#3d2b1f] px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[#f5f0e8] font-semibold">Pelayan</h1>
          <p className="text-xs text-[#c4a882]">JANJIA Bistro & Space</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Panggilan Pelayan */}
        {calls.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#c4622d] uppercase tracking-widest">🔔 Panggilan ({calls.length})</p>
            <AnimatePresence>
              {calls.map(call => (
                <motion.div key={call.id} className="bg-[#c4622d] rounded-2xl p-4 flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div>
                    <p className="font-bold text-white text-lg">Meja {call.tables.code}</p>
                    <p className="text-xs text-orange-200">{formatTime(call.created_at)}</p>
                  </div>
                  <Button variant="secondary" onClick={() => resolveCall(call.id)}>Selesai</Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pesanan Siap */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#3d2b1f] uppercase tracking-widest">Pesanan Aktif</p>
          {ordersLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-4 border-[#c4622d] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">✨</p>
              <p className="text-[#6b4c3b] text-sm">Semua pesanan sudah tertangani</p>
            </div>
          ) : (
            <AnimatePresence>
              {orders.map(order => (
                <motion.div key={order.id} layout className="bg-white rounded-2xl border border-[#e2d9cc] p-4"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-[#3d2b1f]">Meja {order.tables.code}</p>
                      <p className="text-xs text-[#c4a882]">{formatTime(order.created_at)}</p>
                    </div>
                    <StatusChip status={order.status as OrderStatus} />
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.order_items.map(item => (
                      <p key={item.id} className="text-sm text-[#6b4c3b]">{item.qty}× {item.menu_items.name}</p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#c4622d]">{formatRupiah(order.total)}</span>
                    {order.status === 'ready' && (
                      <Button onClick={() => completeOrder(order.id)}>Sudah Diantar ✓</Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
