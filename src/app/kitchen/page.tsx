'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useOrders } from '@/hooks/useOrders'
import { StatusChip } from '@/components/ui/StatusChip'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { formatTime } from '@/lib/utils'
import { OrderWithItems, OrderStatus } from '@/types'

function KitchenCard({ order }: { order: OrderWithItems }) {
  async function updateStatus(status: OrderStatus) {
    const supabase = createClient()
    await supabase.from('orders').update({ status }).eq('id', order.id)
  }
  const nextStatus: Partial<Record<OrderStatus, { label: string; status: OrderStatus }>> = {
    new:       { label: '👨‍🍳 Mulai Masak', status: 'preparing' },
    preparing: { label: '✅ Siap Disajikan', status: 'ready' },
  }
  const action = nextStatus[order.status as OrderStatus]
  return (
    <motion.div layout className="bg-white rounded-2xl border-2 border-[#e2d9cc] p-4 space-y-3"
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-[#3d2b1f] text-lg">Meja {order.tables.code}</p>
          <p className="text-xs text-[#c4a882]">{formatTime(order.created_at)}</p>
        </div>
        <StatusChip status={order.status as OrderStatus} />
      </div>
      <div className="space-y-1.5 border-t border-[#e2d9cc] pt-3">
        {order.order_items.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="font-semibold text-[#3d2b1f]">{item.qty}×</span>
            <span className="flex-1 ml-2 text-[#3d2b1f]">{item.menu_items.name}</span>
            {item.notes && <span className="text-xs text-[#c4622d] italic">📝 {item.notes}</span>}
          </div>
        ))}
      </div>
      {action && (
        <Button fullWidth onClick={() => updateStatus(action.status)}>{action.label}</Button>
      )}
    </motion.div>
  )
}

export default function KitchenPage() {
  const { orders, loading } = useOrders(['new', 'preparing'])
  return (
    <div className="min-h-dvh bg-[#1a1108]">
      <div className="sticky top-0 z-10 bg-[#1a1108] border-b border-[#3d2b1f] px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[#f5f0e8] font-semibold">Dapur</h1>
          <p className="text-xs text-[#c4a882]">JANJIA Bistro & Space</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex justify-center pt-20">
            <div className="w-8 h-8 border-4 border-[#c4622d] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🍳</p>
            <p className="text-[#c4a882] font-medium">Belum ada pesanan masuk</p>
            <p className="text-[#6b4c3b] text-sm mt-1">Santai dulu, pesanan akan muncul otomatis</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-[#c4a882] font-medium">{orders.length} pesanan aktif</p>
            <AnimatePresence>
              {orders.map(order => <KitchenCard key={order.id} order={order} />)}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
