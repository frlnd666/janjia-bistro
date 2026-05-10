'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatTime } from '@/lib/utils'
import { ChefHat, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface OrderItem { id: string; qty: number; notes?: string; menu_items: { name: string } }
interface Order { id: string; created_at: string; status: string; tables: { code: string }; order_items: OrderItem[] }

const statusLabel: Record<string, string> = { new: 'Baru', preparing: 'Dimasak', ready: 'Siap' }
const statusColor: Record<string, string> = {
  new: 'border-[#c4622d] bg-[#2a1a14]',
  preparing: 'border-[#c4a030] bg-[#2a2014]',
  ready: 'border-[#5c8a30] bg-[#1a2a14]',
}
const statusBadge: Record<string, string> = {
  new: 'bg-[#c4622d]/20 text-[#e8834d]',
  preparing: 'bg-[#c4a030]/20 text-[#e8c050]',
  ready: 'bg-[#5c8a30]/20 text-[#7ab648]',
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('orders')
        .select('id, created_at, status, tables(code), order_items(id, qty, notes, menu_items(name))')
        .in('status', ['new', 'preparing', 'ready'])
        .order('created_at', { ascending: true })
      if (error) throw error
      setOrders((data as Order[]) ?? [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    const supabase = createClient()
    const channel = supabase.channel('kitchen-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchOrders])

  async function nextStatus(order: Order) {
    const next: Record<string, string> = { new: 'preparing', preparing: 'ready' }
    if (!next[order.status]) return
    setUpdating(order.id)
    try {
      const supabase = createClient()
      await supabase.from('orders').update({ status: next[order.status] }).eq('id', order.id)
      await fetchOrders()
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#120d08] text-[#f5f0e8]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#1a1108]/95 backdrop-blur border-b border-[#2a1f14] px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#c4622d] flex items-center justify-center">
          <ChefHat className="w-4 h-4 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">Dapur</p>
          <p className="text-[#c4a882] text-xs">JANJIA Bistro & Space</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 text-[#c4a882] animate-spin" />}
          <span className="bg-[#c4622d] text-white text-xs font-bold px-2.5 py-1 rounded-full">{orders.length}</span>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-36 bg-[#2a1f14] rounded-2xl animate-pulse" />)
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <CheckCircle2 className="w-12 h-12 text-[#5c8a30]" strokeWidth={1} />
            <p className="text-[#c4a882] text-sm">Semua pesanan selesai</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className={`border-2 ${statusColor[order.status]} rounded-2xl p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white text-lg">Meja {order.tables.code}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge[order.status]}`}>
                    {statusLabel[order.status]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#c4a882]">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{formatTime(order.created_at)}</span>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                {order.order_items.map(item => (
                  <div key={item.id} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#1a1108] flex items-center justify-center text-xs font-bold text-[#c4622d] shrink-0">{item.qty}</span>
                    <div>
                      <p className="text-[#f5f0e8] text-sm font-medium">{item.menu_items.name}</p>
                      {item.notes && <p className="text-[#c4a882] text-xs mt-0.5">📝 {item.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {order.status !== 'ready' && (
                <button
                  onClick={() => nextStatus(order)}
                  disabled={updating === order.id}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 bg-[#c4622d] hover:bg-[#b5521f] text-white">
                  {updating === order.id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                  }
                  {order.status === 'new' ? 'Mulai Masak' : 'Tandai Siap'}
                </button>
              )}
              {order.status === 'ready' && (
                <div className="w-full py-3 rounded-xl bg-[#5c8a30]/20 border border-[#5c8a30]/40 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7ab648]" strokeWidth={1.5} />
                  <span className="text-[#7ab648] text-sm font-semibold">Siap Disajikan</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
