import { MenuBadge } from '@/types'
const cfg: Record<NonNullable<MenuBadge>, { label: string; className: string }> = {
  bestseller: { label: '⭐ Terlaris', className: 'bg-amber-100 text-amber-800' },
  spicy:      { label: '🌶 Pedas',    className: 'bg-red-100 text-red-700' },
  new:        { label: '✨ Baru',     className: 'bg-[#eef2e6] text-[#3d5a1a]' },
  sold_out:   { label: 'Habis',      className: 'bg-gray-200 text-gray-500' },
}
export function Badge({ badge }: { badge: MenuBadge }) {
  if (!badge) return null
  const c = cfg[badge]
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.className}`}>{c.label}</span>
}
