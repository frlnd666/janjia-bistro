'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MenuCategory, MenuItem } from '@/types'
import { CategoryTabs } from '@/components/menu/CategoryTabs'
import { MenuCard } from '@/components/menu/MenuCard'
import { CartButton } from '@/components/menu/CartButton'
import { useCart } from '@/hooks/useCart'
type Props = { categories: MenuCategory[]; menuItems: MenuItem[]; tableCode: string; tableId: string; sessionId: string }
export function MenuPageClient({ categories, menuItems, tableCode, tableId, sessionId }: Props) {
  const { setTable } = useCart()
  const [activeCategory, setActiveCategory] = useState<string>('')
  const allCategory: MenuCategory = { id: 'all', name: 'Semua', sort_order: -1 }
  const allCategories = [allCategory, ...categories]
  useEffect(() => {
    setTable(tableCode, sessionId)
    setActiveCategory('all')
  }, [])
  const filtered = activeCategory === 'all' ? menuItems : menuItems.filter(i => i.category_id === activeCategory)
  return (
    <div className="min-h-dvh bg-[#f5f0e8] pb-32">
      <div className="bg-[#3d2b1f] px-4 pt-12 pb-6">
        <p className="text-[#c4a882] text-xs font-medium tracking-widest uppercase">Meja</p>
        <h1 className="font-display text-2xl text-[#f5f0e8] font-semibold">{tableCode}</h1>
      </div>
      <CategoryTabs categories={allCategories} active={activeCategory} onChange={setActiveCategory} />
      <div className="px-4 pt-4 space-y-3">
        {filtered.length === 0
          ? <div className="text-center py-16 text-[#c4a882]"><p className="text-4xl mb-3">🍽️</p><p className="text-sm">Belum ada menu tersedia</p></div>
          : filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <MenuCard item={item} />
            </motion.div>
          ))}
      </div>
      <CartButton />
    </div>
  )
}
