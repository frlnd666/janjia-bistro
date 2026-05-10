'use client'
import { create } from 'zustand'
import { CartItem, CartSummary } from '@/types'
import { calculateTax } from '@/lib/utils'
type CartStore = {
  items: CartItem[]; tableCode: string | null; sessionId: string | null
  setTable: (code: string, sessionId: string) => void
  addItem: (item: Omit<CartItem, 'qty' | 'notes'>) => void
  updateQty: (menu_item_id: string, qty: number) => void
  updateNotes: (menu_item_id: string, notes: string) => void
  removeItem: (menu_item_id: string) => void
  clearCart: () => void
  getSummary: () => CartSummary
}
export const useCart = create<CartStore>((set, get) => ({
  items: [], tableCode: null, sessionId: null,
  setTable: (code, sessionId) => set({ tableCode: code, sessionId }),
  addItem: (incoming) => {
    const { items } = get()
    const existing = items.find(i => i.menu_item_id === incoming.menu_item_id)
    if (existing) { set({ items: items.map(i => i.menu_item_id === incoming.menu_item_id ? { ...i, qty: i.qty + 1 } : i) }) }
    else { set({ items: [...items, { ...incoming, qty: 1, notes: '' }] }) }
  },
  updateQty: (menu_item_id, qty) => {
    if (qty <= 0) { get().removeItem(menu_item_id); return }
    set({ items: get().items.map(i => i.menu_item_id === menu_item_id ? { ...i, qty } : i) })
  },
  updateNotes: (menu_item_id, notes) => set({ items: get().items.map(i => i.menu_item_id === menu_item_id ? { ...i, notes } : i) }),
  removeItem: (menu_item_id) => set({ items: get().items.filter(i => i.menu_item_id !== menu_item_id) }),
  clearCart: () => set({ items: [], tableCode: null, sessionId: null }),
  getSummary: () => {
    const subtotal = get().items.reduce((acc, item) => acc + item.price * item.qty, 0)
    const tax = calculateTax(subtotal)
    return { subtotal, tax, total: subtotal + tax }
  },
}))
