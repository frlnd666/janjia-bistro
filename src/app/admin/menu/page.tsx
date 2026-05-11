'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { uploadImage, getImageUrl } from '@/lib/cloudinary'
import { formatRupiah } from '@/lib/utils'
import { MenuItem, MenuCategory, MenuBadge } from '@/types'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'

type BadgeValue = NonNullable<MenuBadge> | ''
const emptyForm = { name: '', description: '', price: '', category_id: '', badge: '' as BadgeValue, available: true }

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  async function fetchData() {
    const supabase = createClient()
    const [{ data: menuData }, { data: catData }] = await Promise.all([
      supabase.from('menu_items').select('*').order('sort_order'),
      supabase.from('menu_categories').select('*').order('sort_order'),
    ])
    setItems(menuData ?? [])
    setCategories(catData ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function openAdd() {
    setEditing(null)
    setForm({ ...emptyForm, category_id: categories[0]?.id ?? '' })
    setImageFile(null)
    setModalOpen(true)
  }
  function openEdit(item: MenuItem) {
    setEditing(item)
    setForm({ name: item.name, description: item.description ?? '', price: item.price.toString(), category_id: item.category_id, badge: (item.badge ?? '') as BadgeValue, available: item.available })
    setImageFile(null)
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.category_id) return
    setSaving(true)
    const supabase = createClient()
    let image_url = editing?.image_url ?? null
    if (imageFile) { image_url = await uploadImage(imageFile) }
    const payload = { name: form.name, description: form.description || null, price: parseInt(form.price), category_id: form.category_id, badge: (form.badge || null) as MenuBadge, available: form.available, image_url }
    if (editing) {
      await supabase.from('menu_items').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('menu_items').insert(payload)
    }
    await fetchData()
    setModalOpen(false)
    setSaving(false)
  }

  async function toggleAvailable(item: MenuItem) {
    const supabase = createClient()
    await supabase.from('menu_items').update({ available: !item.available }).eq('id', item.id)
    await fetchData()
  }

  async function deleteItem(id: string) {
    if (!confirm('Hapus menu ini?')) return
    const supabase = createClient()
    await supabase.from('menu_items').delete().eq('id', id)
    await fetchData()
  }

  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[#c4a882] font-medium uppercase tracking-widest">Kelola Menu</p>
        <Button onClick={openAdd}>+ Tambah</Button>
      </div>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-[#e2d9cc] rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {items.map(item => (
              <motion.div key={item.id} layout className={`bg-[var(--bg)] rounded-2xl border border-[#e2d9cc] p-3 flex gap-3 ${!item.available ? 'opacity-50' : ''}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#ede5d8]">
                  {item.image_url
                    ? <Image src={getImageUrl(item.image_url, 150)} alt={item.name} fill className="object-cover" sizes="64px" loading="lazy" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-1 mb-0.5"><Badge badge={item.badge} /></div>
                  <p className="font-semibold text-[#3d2b1f] text-sm leading-tight">{item.name}</p>
                  <p className="text-[#c4622d] text-xs font-semibold">{formatRupiah(item.price)}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => openEdit(item)} className="text-xs text-[#6b4c3b] border border-[#e2d9cc] px-2 py-1 rounded-lg min-h-[28px]">Edit</button>
                    <button onClick={() => toggleAvailable(item)} className={`text-xs px-2 py-1 rounded-lg min-h-[28px] border ${item.available ? 'border-[#5c6b3a] text-[#5c6b3a]' : 'border-[#c4622d] text-[#c4622d]'}`}>
                      {item.available ? 'Aktif' : 'Nonaktif'}
                    </button>
                    <button onClick={() => deleteItem(item.id)} className="text-xs text-red-500 border border-red-200 px-2 py-1 rounded-lg min-h-[28px]">Hapus</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Menu' : 'Tambah Menu'}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[#6b4c3b] block mb-1">Nama Menu *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nasi Goreng Janjia" className="w-full border border-[#e2d9cc] rounded-xl px-3 py-2.5 text-sm text-[#3d2b1f] bg-[#faf7f2] focus:outline-none focus:border-[#c4622d] min-h-[44px]" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b4c3b] block mb-1">Deskripsi</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Deskripsi singkat..." className="w-full border border-[#e2d9cc] rounded-xl px-3 py-2.5 text-sm text-[#3d2b1f] bg-[#faf7f2] focus:outline-none focus:border-[#c4622d] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#6b4c3b] block mb-1">Harga (Rp) *</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="35000" className="w-full border border-[#e2d9cc] rounded-xl px-3 py-2.5 text-sm text-[#3d2b1f] bg-[#faf7f2] focus:outline-none focus:border-[#c4622d] min-h-[44px]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b4c3b] block mb-1">Kategori *</label>
              <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className="w-full border border-[#e2d9cc] rounded-xl px-3 py-2.5 text-sm text-[#3d2b1f] bg-[#faf7f2] focus:outline-none focus:border-[#c4622d] min-h-[44px]">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b4c3b] block mb-1">Badge</label>
            <select value={form.badge as string} onChange={e => setForm(f => ({ ...f, badge: e.target.value as BadgeValue }))} className="w-full border border-[#e2d9cc] rounded-xl px-3 py-2.5 text-sm text-[#3d2b1f] bg-[#faf7f2] focus:outline-none focus:border-[#c4622d] min-h-[44px]">
              <option value="">Tidak ada</option>
              <option value="bestseller">⭐ Terlaris</option>
              <option value="new">✨ Baru</option>
              <option value="spicy">🌶 Pedas</option>
              <option value="sold_out">Habis</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b4c3b] block mb-1">Foto Menu</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} className="w-full text-sm text-[#6b4c3b] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#ede5d8] file:text-[#3d2b1f] file:text-xs" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="available" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} className="w-4 h-4 accent-[#c4622d]" />
            <label htmlFor="available" className="text-sm text-[#3d2b1f]">Menu tersedia</label>
          </div>
          <Button fullWidth loading={saving} onClick={handleSave}>{editing ? 'Simpan Perubahan' : 'Tambah Menu'}</Button>
        </div>
      </Modal>
    </div>
  )
}
