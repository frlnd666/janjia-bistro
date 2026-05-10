'use client'
import { useOrders } from '@/hooks/useOrders'
import { StatusChip } from '@/components/ui/StatusChip'
import { formatRupiah, formatTime } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { OrderStatus } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

const allStatus: OrderStatus[] = ['new', 'preparing', 'ready', 'completed', 'cancelled']

export default function AdminOrdersPage() {
  const { orders, loading } = useOrders()
  async function updateStatus(id: string, status: OrderStatus) {
    const supabase = createClient()
    await supabase.from('orders').update({ status }).eq('id', id)
  }
  return (
    <div className="px-4 py-5">
      <p className="text-xs text-[#c4a882] font-medium uppercase tracking-widest mb-4">Semua Pesanan</p>
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-[#e2d9cc] rounded-2xl animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🧾</p>
          <p className="text-[#6b4c3b] text-sm">Belum ada pesanan</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {orders.map(order => (
              <motion.div key={order.id} layout className="bg-white rounded-2xl border border-[#e2d9cc] p-4"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-[#3d2b1f]">Meja {order.tables.code}</p>
                    <p className="text-xs text-[#c4a882]">{formatTime(order.created_at)}</p>
                  </div>
                  <StatusChip status={order.status as OrderStatus} />
                </div>
                <div className="space-y-1 py-2 border-t border-b border-[#e2d9cc] my-2">
                  {order.order_items.map(item => (
                    <p key={item.id} className="text-xs text-[#6b4c3b]">{item.qty}× {item.menu_items.name}</p>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#c4622d] text-sm">{formatRupiah(order.total)}</span>
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                    className="text-xs border border-[#e2d9cc] rounded-lg px-2 py-1.5 text-[#3d2b1f] bg-[#faf7f2] min-h-[36px]">
                    {allStatus.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
