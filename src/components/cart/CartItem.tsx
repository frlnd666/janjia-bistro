'use client'
import Image from 'next/image'
import { CartItem as CartItemType } from '@/types'
import { formatRupiah } from '@/lib/utils'
import { getImageUrl } from '@/lib/cloudinary'
import { useCart } from '@/hooks/useCart'
type Props = { item: CartItemType }
export function CartItem({ item }: Props) {
  const { updateQty, updateNotes, removeItem } = useCart()
  return (
    <div className="bg-white rounded-2xl border border-[#e2d9cc] p-4">
      <div className="flex gap-3">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#ede5d8]">
          {item.image_url
            ? <Image src={getImageUrl(item.image_url, 150)} alt={item.name} fill className="object-cover" sizes="64px" loading="lazy" />
            : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#3d2b1f] text-sm leading-tight">{item.name}</p>
          <p className="text-[#c4622d] text-sm font-semibold mt-0.5">{formatRupiah(item.price)}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.menu_item_id, item.qty - 1)} className="w-8 h-8 rounded-full bg-[#ede5d8] text-[#3d2b1f] flex items-center justify-center text-xl active:scale-95 transition-transform" aria-label="Kurangi">−</button>
              <span className="w-5 text-center text-sm font-bold">{item.qty}</span>
              <button onClick={() => updateQty(item.menu_item_id, item.qty + 1)} className="w-8 h-8 rounded-full bg-[#c4622d] text-white flex items-center justify-center text-xl active:scale-95 transition-transform" aria-label="Tambah">+</button>
            </div>
            <p className="font-bold text-[#3d2b1f] text-sm">{formatRupiah(item.price * item.qty)}</p>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <input type="text" value={item.notes} onChange={e => updateNotes(item.menu_item_id, e.target.value)} placeholder="Catatan (misal: tanpa bawang, tidak pedas...)" className="w-full text-xs border border-[#e2d9cc] rounded-xl px-3 py-2 text-[#3d2b1f] placeholder:text-[#c4a882] focus:outline-none focus:border-[#c4622d] bg-[#faf7f2] min-h-[40px]" />
      </div>
    </div>
  )
}
