'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MenuItem } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { formatRupiah } from '@/lib/utils'
import { getImageUrl } from '@/lib/cloudinary'
import { useCart } from '@/hooks/useCart'
export function MenuCard({ item }: { item: MenuItem }) {
  const { items, addItem, updateQty } = useCart()
  const cartItem = items.find(i => i.menu_item_id === item.id)
  const qty = cartItem?.qty ?? 0
  const soldOut = !item.available || item.badge === 'sold_out'
  function handleAdd() {
    if (soldOut) return
    addItem({ menu_item_id: item.id, name: item.name, price: item.price, image_url: item.image_url })
  }
  return (
    <motion.div className={`flex gap-3 p-4 bg-white rounded-2xl shadow-sm border border-[#e2d9cc] ${soldOut ? 'opacity-60' : ''}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#ede5d8]">
        {item.image_url ? (
          <Image src={getImageUrl(item.image_url, 200)} alt={item.name} fill className="object-cover" sizes="96px" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-1 flex-wrap mb-1"><Badge badge={item.badge} /></div>
        <h3 className="font-semibold text-[#3d2b1f] text-sm leading-tight">{item.name}</h3>
        {item.description && <p className="text-xs text-[#6b4c3b] mt-1 line-clamp-2">{item.description}</p>}
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-[#c4622d] text-sm">{formatRupiah(item.price)}</span>
          {soldOut ? <span className="text-xs text-gray-400 font-medium">Habis</span> : qty === 0 ? (
            <button onClick={handleAdd} className="w-8 h-8 rounded-full bg-[#c4622d] text-white flex items-center justify-center text-xl font-light active:scale-95 transition-transform" aria-label={`Tambah ${item.name}`}>+</button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.id, qty - 1)} className="w-8 h-8 rounded-full bg-[#ede5d8] text-[#3d2b1f] flex items-center justify-center text-xl font-light active:scale-95 transition-transform" aria-label="Kurangi">−</button>
              <span className="w-5 text-center text-sm font-semibold text-[#3d2b1f]">{qty}</span>
              <button onClick={handleAdd} className="w-8 h-8 rounded-full bg-[#c4622d] text-white flex items-center justify-center text-xl font-light active:scale-95 transition-transform" aria-label="Tambah">+</button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
