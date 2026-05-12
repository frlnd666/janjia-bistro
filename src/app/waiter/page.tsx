'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useOrders } from '@/hooks/useOrders'
import { useWaiterCalls } from '@/hooks/useWaiterCalls'
import { StatusChip } from '@/components/ui/StatusChip'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { formatTime, formatRupiah } from '@/lib/utils'
import { OrderStatus } from '@/types'
import { BellRing, Loader2, Sparkles, ReceiptText, CheckCircle2 } from 'lucide-react'

export default function WaiterPage() {
  const { orders, loading: ordersLoading } = useOrders(['ready', 'new', 'preparing'])
  const { calls, loading: callsLoading } = useWaiterCalls()

  async function completeOrder(id: string) {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('orders').update({ status: 'completed' }).eq('id', id)
      if (error) throw error
    } catch (e) {
      console.error('completeOrder error:', e)
      alert(e instanceof Error ? e.message : 'Gagal menyelesaikan pesanan')
    }
  }

  async function resolveCall(id: string) {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('waiter_calls').update({ status: 'resolved' }).eq('id', id)
      if (error) throw error
    } catch (e) {
      console.error('resolveCall error:', e)
      alert(e instanceof Error ? e.message : 'Gagal menyelesaikan panggilan')
    }
  }

  const readyCount = orders.filter(order => order.status === 'ready').length
  const activeCount = orders.length
  const totalCalls = calls.length

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(255,248,242,0.92)] backdrop-blur-xl">
        <div className="px-4 py-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(232,114,58,0.28)]">
            <BellRing className="w-5 h-5" strokeWidth={2} />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)] font-semibold">Waiter Dashboard</p>
            <h1 className="text-[22px] leading-tight font-extrabold text-[var(--text-primary)]">Dashboard Pelayan</h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {(ordersLoading || callsLoading) && <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />}
            <div className="px-3 py-1.5 rounded-full bg-[rgba(72,187,120,0.12)] text-[#2f8f58] text-xs font-bold border border-[rgba(72,187,120,0.18)]">
              Live
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-1)] p-4 shadow-[0_10px_30px_rgba(35,25,20,0.05)]">
            <div className="mb-3 w-10 h-10 rounded-2xl bg-[rgba(232,114,58,0.12)] flex items-center justify-center text-[var(--accent)]">
              <BellRing className="w-4 h-4" strokeWidth={2} />
            </div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] font-semibold">Panggilan</p>
            <p className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">{totalCalls}</p>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-1)] p-4 shadow-[0_10px_30px_rgba(35,25,20,0.05)]">
            <div className="mb-3 w-10 h-10 rounded-2xl bg-[rgba(212,170,65,0.14)] flex items-center justify-center text-[#c39216]">
              <Sparkles className="w-4 h-4" strokeWidth={2} />
            </div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] font-semibold">Siap Antar</p>
            <p className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">{readyCount}</p>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-1)] p-4 shadow-[0_10px_30px_rgba(35,25,20,0.05)]">
            <div className="mb-3 w-10 h-10 rounded-2xl bg-[rgba(72,187,120,0.14)] flex items-center justify-center text-[#2f8f58]">
              <ReceiptText className="w-4 h-4" strokeWidth={2} />
            </div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] font-semibold">Aktif</p>
            <p className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">{activeCount}</p>
          </div>
        </div>

        {calls.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] font-semibold">Panggilan Pelayan</p>
              <span className="rounded-full border border-[rgba(232,114,58,0.18)] bg-[rgba(232,114,58,0.10)] px-3 py-1 text-xs font-bold text-[var(--accent)]">
                {calls.length} aktif
              </span>
            </div>

            <AnimatePresence>
              {calls.map(call => (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-[28px] border border-[rgba(232,114,58,0.18)] bg-[linear-gradient(135deg,rgba(232,114,58,0.12),rgba(255,255,255,0.72))] p-4 shadow-[0_12px_32px_rgba(232,114,58,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] font-semibold">Butuh Bantuan</p>
                      <h2 className="mt-1 text-[22px] font-extrabold leading-tight text-[var(--text-primary)]">Meja {call.tables.code}</h2>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{formatTime(call.created_at)}</p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-[0_10px_24px_rgba(232,114,58,0.25)]">
                      <BellRing className="w-5 h-5" strokeWidth={2} />
                    </div>
                  </div>

                  <button
                    onClick={() => resolveCall(call.id)}
                    className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] text-sm font-bold text-white shadow-[0_10px_25px_rgba(232,114,58,0.22)] transition-all active:scale-[0.98]"
                  >
                    <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                    Tandai Selesai
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] font-semibold">Pesanan Aktif</p>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-3 py-1 text-xs font-bold text-[var(--text-secondary)]">
              {activeCount} pesanan
            </span>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-7 h-7 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-1)] px-6 py-16 text-center shadow-[0_10px_30px_rgba(35,25,20,0.05)]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[rgba(72,187,120,0.14)] text-[#2f8f58]">
                <CheckCircle2 className="w-8 h-8" strokeWidth={1.8} />
              </div>
              <p className="text-base font-bold text-[var(--text-primary)]">Semua pesanan tertangani</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Tidak ada order aktif untuk diantar saat ini.</p>
            </div>
          ) : (
            <AnimatePresence>
              {orders.map(order => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-1)] p-4 shadow-[0_10px_30px_rgba(35,25,20,0.05)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] font-semibold">Order Service</p>
                      <h2 className="mt-1 text-[22px] font-extrabold leading-tight text-[var(--text-primary)]">
                        Meja {order.tables.code}
                      </h2>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{formatTime(order.created_at)}</p>
                    </div>

                    <StatusChip status={order.status as OrderStatus} />
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.order_items.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-3"
                      >
                        <div className="min-w-0 pr-3">
                          <p className="text-sm font-bold text-[var(--text-primary)]">{item.menu_items.name}</p>
                        </div>
                        <div className="flex h-9 min-w-9 items-center justify-center rounded-2xl bg-[rgba(232,114,58,0.12)] px-3 text-sm font-extrabold text-[var(--accent)]">
                          {item.qty}x
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-lg font-extrabold text-[var(--accent)]">{formatRupiah(order.total)}</span>
                    {order.status === 'ready' && (
                      <Button onClick={() => completeOrder(order.id)}>Sudah Diantar</Button>
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
