import { CartSummary } from '@/types'
import { formatRupiah } from '@/lib/utils'
export function OrderSummary({ summary }: { summary: CartSummary }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e2d9cc] p-4 space-y-2">
      <h3 className="font-semibold text-[#3d2b1f] text-sm mb-3">Ringkasan Pesanan</h3>
      <div className="flex justify-between text-sm text-[#6b4c3b]">
        <span>Subtotal</span>
        <span>{formatRupiah(summary.subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm text-[#6b4c3b]">
        <span>PPN 11%</span>
        <span>{formatRupiah(summary.tax)}</span>
      </div>
      <div className="border-t border-[#e2d9cc] pt-2 flex justify-between font-bold text-[#3d2b1f]">
        <span>Total</span>
        <span className="text-[#c4622d]">{formatRupiah(summary.total)}</span>
      </div>
    </div>
  )
}
