'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatTime } from '@/lib/utils'
import { ChefHat, Clock3, CheckCircle2, Loader2, Flame, Soup, Sparkles } from 'lucide-react'

interface OrderItem {
  id: string
  qty: number
  notes?: string
  menu_items: { name: string }
}

interface Order {
  id: string
  created_at: string
  status: string
  tables: { code: string }[]
  order_items: OrderItem[]
}

const statusLabel: Record<string, string> = {
  new: 'Baru',
  preparing: 'Dimasak',
  ready: 'Siap',
}

const statusTone: Record<string, string> = {
  new: 'bg-[rgba(232,114,58,0.12)] text-[var(--accent)] border-[rgba(232,114,58,0.22)]',
  preparing: 'bg-[rgba(212,170,65,0.14)] text-[#c39216] border-[rgba(212,170,65,0.24)]',
  ready: 'bg-[rgba(72,187,120,0.12)] text-[#2f8f58] border-[rgba(72,187,120,0.24)]',
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
      setOrders((data as unknown as Order[]) ?? [])
    } catch (e) {
      console.error('fetchOrders error:', e)
      alert(e instanceof Error ? e.message : 'Gagal memuat pesanan dapur')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    const supabase = createClient()
    const channel = supabase
      .channel('kitchen-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchOrders])

  async function nextStatus(order: Order) {
    const next: Record<string, string> = {
      new: 'preparing',
      preparing: 'ready',
    }

    if (!next[order.status]) return

    setUpdating(order.id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('orders').update({ status: next[order.status] }).eq('id', order.id)
      if (error) throw error
      await fetchOrders()
    } catch (e) {
      console.error('nextStatus error:', e)
      alert(e instanceof Error ? e.message : 'Gagal update status pesanan')
    } finally {
      setUpdating(null)
    }
  }

  const totalItems = orders.reduce((sum, order) => sum + order.order_items.reduce((s, item) => s + item.qty, 0), 0)
  const newCount = orders.filter(order => order.status === 'new').length
  const preparingCount = orders.filter(order => order.status === 'preparing').length
  const readyCount = orders.filter(order => order.status === 'ready').length

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(255,248,242,0.92)] backdrop-blur-xl">
        <div className="px-4 py-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(232,114,58,0.28)]">
            <ChefHat className="w-5 h-5" strokeWidth={2} />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)] font-semibold">Kitchen Dashboard</p>
            <h1 className="text-[22px] leading-tight font-extrabold text-[var(--text-primary)]">Dashboard Dapur</h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />}
            <div className="px-3 py-1.5 rounded-full bg-[rgba(232,114,58,0.12)] text-[var(--accent)] text-xs font-bold border border-[rgba(232,114,58,0.18)]">
              {orders.length} Pesanan
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-1)] p-4 shadow-[0_10px_30px_rgba(35,25,20,0.05)]">
            <div className="mb-3 w-10 h-10 rounded-2xl bg-[rgba(232,114,58,0.12)] flex items-center justify-center text-[var(--accent)]">
              <Sparkles className="w-4 h-4" strokeWidth={2} />
            </div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] font-semibold">Baru</p>
            <p className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">{newCount}</p>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-1)] p-4 shadow-[0_10px_30px_rgba(35,25,20,0.05)]">
            <div className="mb-3 w-10 h-10 rounded-2xl bg-[rgba(212,170,65,0.14)] flex items-center justify-center text-[#c39216]">
              <Flame className="w-4 h-4" strokeWidth={2} />
            </div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] font-semibold">Dimasak</p>
            <p className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">{preparingCount}</p>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-1)] p-4 shadow-[0_10px_30px_rgba(35,25,20,0.05)]">
            <div className="mb-3 w-10 h-10 rounded-2xl bg-[rgba(72,187,120,0.14)] flex items-center justify-center text-[#2f8f58]">
              <Soup className="w-4 h-4" strokeWidth={2} />
            </div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] font-semibold">Siap</p>
            <p className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">{readyCount}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(135deg,rgba(232,114,58,0.10),rgba(255,255,255,0.65))] p-4 shadow-[0_12px_32px_rgba(232,114,58,0.08)]">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] font-semibold">Ringkasan Dapur</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-extrabold text-[var(--text-primary)]">{totalItems}</p>
              <p className="text-sm text-[var(--text-secondary)]">Total item yang sedang diproses</p>
            </div>
            <div className="flex items-center gap-2 text-[var(--accent)] text-sm font-semibold">
              <Clock3 className="w-4 h-4" strokeWidth={2} />
              Live update
            </div>
          </div>
        </div>

        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-44 rounded-3xl bg-[var(--surface-1)] border border-[var(--border)] animate-pulse" />
          ))
        ) : orders.length === 0 ? (
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-1)] px-6 py-16 text-center shadow-[0_10px_30px_rgba(35,25,20,0.05)]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[rgba(72,187,120,0.14)] text-[#2f8f58]">
              <CheckCircle2 className="w-8 h-8" strokeWidth={1.8} />
            </div>
            <p className="text-base font-bold text-[var(--text-primary)]">Semua pesanan selesai</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Belum ada antrean baru di dapur saat ini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-1)] p-4 shadow-[0_10px_30px_rgba(35,25,20,0.05)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] font-semibold">Pesanan Aktif</p>
                    <h2 className="mt-1 text-[22px] font-extrabold leading-tight text-[var(--text-primary)]">
                      Meja {order.tables[0]?.code ?? '-'}
                    </h2>
                  </div>

                  <div className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${statusTone[order.status]}`}>
                    {statusLabel[order.status]}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <Clock3 className="w-4 h-4" strokeWidth={2} />
                  <span>{formatTime(order.created_at)}</span>
                  <span className="text-[var(--border-strong)]">•</span>
                  <span>{order.order_items.length} item</span>
                </div>

                <div className="mt-4 space-y-3">
                  {order.order_items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgba(232,114,58,0.12)] text-sm font-extrabold text-[var(--accent)]">
                        {item.qty}x
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[var(--text-primary)]">{item.menu_items.name}</p>
                        {item.notes && <p className="mt-1 text-xs text-[var(--text-muted)]">Catatan: {item.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {order.status !== 'ready' ? (
                  <button
                    onClick={() => nextStatus(order)}
                    disabled={updating === order.id}
                    className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] text-sm font-bold text-white shadow-[0_10px_25px_rgba(232,114,58,0.22)] transition-all active:scale-[0.98] disabled:opacity-60"
                  >
                    {updating === order.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                    )}
                    {order.status === 'new' ? 'Mulai Masak' : 'Tandai Siap Disajikan'}
                  </button>
                ) : (
                  <div className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(72,187,120,0.22)] bg-[rgba(72,187,120,0.12)] text-sm font-bold text-[#2f8f58]">
                    <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                    Siap Diambil Pelayan
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
