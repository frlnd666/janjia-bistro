'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { createClient } from '@/lib/supabase/client'
import { CartItem } from '@/components/cart/CartItem'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { Button } from '@/components/ui/Button'
export default function CartPage() {
  const router = useRouter()
  const { items, tableCode, sessionId, getSummary, clearCart } = useCart()
  const summary = getSummary()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function handleOrder() {
    if (!sessionId || !tableCode || items.length === 0) return
    setLoading(true); setError(null)
    try {
      const supabase = createClient()
      const { data: tableData } = await supabase.from('tables').select('id').eq('code', tableCode).single()
      if (!tableData) throw new Error('Meja tidak ditemukan')
      const { data: order, error: orderErr } = await supabase.from('orders').insert({
        session_id: sessionId, table_id: tableData.id,
        status: 'new', subtotal: summary.subtotal, tax: summary.tax, total: summary.total,
      }).select('id').single()
      if (orderErr || !order) throw new Error('Gagal membuat pesanan')
      const orderItems = items.map(i => ({ order_id: order.id, menu_item_id: i.menu_item_id, qty: i.qty, notes: i.notes || null, price: i.price }))
      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
      if (itemsErr) throw new Error('Gagal menyimpan item')
      clearCart()
      router.push(`/track?order=${order.id}&table=${tableCode}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan')
      setLoading(false)
    }
  }
  if (items.length === 0) {
    return (
      <div className="min-h-dvh bg-[#f5f0e8] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-xl font-semibold text-[#3d2b1f] mb-2">Keranjang kosong</h2>
        <p className="text-sm text-[#6b4c3b] mb-8">Yuk, pilih menu favoritmu!</p>
        <Button onClick={() => router.back()}>Kembali ke Menu</Button>
      </div>
    )
  }
  return (
    <div className="min-h-dvh bg-[#f5f0e8] pb-40">
      <div className="bg-[#3d2b1f] px-4 pt-12 pb-6 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center text-[#f5f0e8] text-xl" aria-label="Kembali">←</button>
        <h1 className="font-display text-2xl text-[#f5f0e8] font-semibold">Keranjang</h1>
        <span className="ml-auto text-xs text-[#c4a882]">Meja {tableCode}</span>
      </div>
      <div className="px-4 pt-4 space-y-3">
        <AnimatePresence>
          {items.map(item => (
            <motion.div key={item.menu_item_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <CartItem item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
        <OrderSummary summary={summary} />
        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-[#faf7f2] border-t border-[#e2d9cc] px-4 py-4">
        <Button fullWidth loading={loading} onClick={handleOrder}>
          Pesan Sekarang · {items.reduce((a, i) => a + i.qty, 0)} item
        </Button>
      </div>
    </div>
  )
}
