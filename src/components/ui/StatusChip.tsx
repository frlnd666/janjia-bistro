import { OrderStatus } from '@/types'
const cfg: Record<OrderStatus, { label: string; className: string }> = {
  new:       { label: 'Baru',    className: 'bg-blue-100 text-blue-700' },
  preparing: { label: 'Dimasak', className: 'bg-amber-100 text-amber-700' },
  ready:     { label: 'Siap',    className: 'bg-green-100 text-green-700' },
  completed: { label: 'Selesai', className: 'bg-gray-100 text-gray-500' },
  cancelled: { label: 'Dibatal', className: 'bg-red-100 text-red-600' },
}
export function StatusChip({ status }: { status: OrderStatus }) {
  const c = cfg[status]
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${c.className}`}>{c.label}</span>
}
