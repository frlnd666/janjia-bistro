'use client'
import { MenuCategory } from '@/types'
type Props = { categories: MenuCategory[]; active: string; onChange: (id: string) => void }
export function CategoryTabs({ categories, active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 py-3 bg-[#faf7f2] sticky top-0 z-10 border-b border-[#e2d9cc]">
      {categories.map(cat => (
        <button key={cat.id} onClick={() => onChange(cat.id)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[36px] ${active === cat.id ? 'bg-[#3d2b1f] text-[#f5f0e8]' : 'bg-[#ede5d8] text-[#6b4c3b]'}`}>
          {cat.name}
        </button>
      ))}
    </div>
  )
}
