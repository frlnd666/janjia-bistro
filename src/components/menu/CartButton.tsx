'use client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { formatRupiah } from '@/lib/utils'
export function CartButton() {
  const router = useRouter()
  const { items, getSummary } = useCart()
  const totalQty = items.reduce((acc, i) => acc + i.qty, 0)
  const { subtotal } = getSummary()
  return (
    <AnimatePresence>
      {totalQty > 0 && (
        <motion.div className="fixed bottom-6 left-4 right-4 z-30" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
          <button onClick={() => router.push('/cart')} className="w-full bg-[#3d2b1f] text-[#f5f0e8] rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg active:scale-[0.98] transition-transform">
            <span className="bg-[#c4622d] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{totalQty}</span>
            <span className="font-semibold">Lihat Keranjang</span>
            <span className="font-semibold text-[#e07a45]">{formatRupiah(subtotal)}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
