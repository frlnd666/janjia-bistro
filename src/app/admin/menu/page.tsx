'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatRupiah } from '@/lib/utils'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2, X, UtensilsCrossed, Upload } from 'lucide-react'

interface Category { id: string; name: string }
interface MenuItem { id: string; name: string; description: string; price: number; image_url?: string; category_id: string; available: boolean; badge?: string }

const EMPTY_FORM = { name: '', description: '', price: '', category_id: '', badge: '', available: true }

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchData = useCallback(async () => {
    const sb = createClient()
    const [m, c] = await Promise.all([
      sb.from('menu_items').select('*').order('created_at', { ascending: true }),
      sb.from('menu_categories').select('*').order('created_at', { ascending: true }),
    ])
    setItems(m.data ?? [])
    setCategories(c.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  function openAdd() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setImagePreview('')
    setModalOpen(true)
  }

  function openEdit(item: MenuItem) {
    setEditing(item)
    setForm({ name: item.name, description: item.description ?? '', price: String(item.price), category_id: item.category_id ?? '', badge: item.badge ?? '', available: item.available })
    setImagePreview(item.image_url ?? '')
    setImageFile(null)
    setModalOpen(true)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function uploadImage(file: File): Promise<string> {
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: data })
    const json = await res.json()
    return json.secure_url
  }

  async function handleSave() {
    if (!form.name || !form.price) return
    setSaving(true)
    try {
      const sb = createClient()
      let image_url = editing?.image_url ?? null
      if (imageFile) image_url = await uploadImage(imageFile)
      const payload = {
        name: form.name,
        description: form.description,
        price: parseInt(form.price.replace(/D/g, '')),
        category_id: form.category_id || null,
        badge: form.badge || null,
        available: form.available,
        image_url,
      }
      if (editing) {
        await sb.from('menu_items').update(payload).eq('id', editing.id)
      } else {
        await sb.from('menu_items').insert(payload)
      }
      await fetchData()
      setModalOpen(false)
    } finally { setSaving(false) }
  }

  async function toggleAvailable(item: MenuItem) {
    setTogglingId(item.id)
    const sb = createClient()
    await sb.from('menu_items').update({ available: !item.available }).eq('id', item.id)
    await fetchData()
    setTogglingId(null)
  }

  async function deleteItem(id: string) {
    if (!confirm('Hapus menu ini?')) return
    setDeletingId(id)
    const sb = createClient()
    await sb.from('menu_items').delete().eq('id', id)
    await fetchData()
    setDeletingId(null)
  }

  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Kelola Menu</p>
          <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginTop: '2px' }}>{items.length} Item</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'var(--accent)', border: 'none', borderRadius: '14px', padding: '12px 18px', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(232,114,58,0.4)', fontFamily: 'inherit' }}>
          <Plus size={16} strokeWidth={2.5} />
          Tambah
        </button>
      </div>

      {/* List */}
      {loading ? (
        [1,2,3].map(i => <div key={i} style={{ height: '100px', background: 'var(--surface-1)', borderRadius: '20px' }} />)
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UtensilsCrossed size={24} color="var(--text-muted)" strokeWidth={1.5} />
          </div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Belum ada menu</p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tambah item menu pertama</p>
        </div>
      ) : items.map(item => (
        <div key={item.id} style={{ background: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', overflow: 'hidden', opacity: item.available ? 1 : 0.5 }}>
          {/* Image */}
          <div style={{ width: '90px', flexShrink: 0, background: 'var(--surface-3)', position: 'relative', minHeight: '100px' }}>
            {item.image_url
              ? <img src={item.image_url} alt={item.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🍽</div>
            }
            {item.badge && (
              <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'var(--accent)', color: 'white', fontSize: '8px', fontWeight: 700, padding: '2px 6px', borderRadius: '50px', textTransform: 'uppercase' }}>{item.badge}</span>
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
              <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)' }}>{formatRupiah(item.price)}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => openEdit(item)} style={{ flex: 1, height: '36px', borderRadius: '10px', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontFamily: 'inherit' }}>
                <Edit2 size={13} strokeWidth={2} /> Edit
              </button>
              <button onClick={() => toggleAvailable(item)} disabled={togglingId === item.id} style={{ flex: 1, height: '36px', borderRadius: '10px', background: item.available ? 'var(--green-dim)' : 'var(--surface-3)', border: `1px solid ${item.available ? 'rgba(106,176,76,0.3)' : 'var(--border)'}`, color: item.available ? 'var(--green)' : 'var(--text-muted)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontFamily: 'inherit' }}>
                {togglingId === item.id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : item.available ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                {item.available ? 'Aktif' : 'Nonaktif'}
              </button>
              <button onClick={() => deleteItem(item.id)} disabled={deletingId === item.id} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(224,80,80,0.1)', border: '1px solid rgba(224,80,80,0.2)', color: '#e05050', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {deletingId === item.id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={13} strokeWidth={2} />}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <div onClick={() => !saving && setModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--surface-1)', borderRadius: '24px 24px 0 0', maxHeight: '92dvh', overflowY: 'auto', borderTop: '1px solid var(--border-strong)' }}>
            <div style={{ width: '36px', height: '4px', borderRadius: '50px', background: 'var(--surface-3)', margin: '12px auto 4px' }} />
            <div style={{ padding: '12px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{editing ? 'Edit Menu' : 'Tambah Menu'}</p>
              <button onClick={() => setModalOpen(false)} style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--surface-3)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} color="var(--text-primary)" strokeWidth={2} />
              </button>
            </div>

            <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Image upload */}
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Foto Menu</p>
                <button onClick={() => fileRef.current?.click()} style={{ width: '100%', height: '140px', borderRadius: '16px', border: '2px dashed var(--border-strong)', background: 'var(--surface-2)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', overflow: 'hidden', position: 'relative' }}>
                  {imagePreview
                    ? <img src={imagePreview} alt="preview" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <><Upload size={24} color="var(--text-muted)" strokeWidth={1.5} /><span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tap untuk upload foto</span></>
                  }
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </div>

              {/* Name */}
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nama Menu *</p>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama menu" style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border-strong)', borderRadius: '14px', padding: '14px 16px', fontSize: '15px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} />
              </div>

              {/* Description */}
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Deskripsi</p>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi singkat..." rows={3} style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border-strong)', borderRadius: '14px', padding: '14px 16px', fontSize: '15px', color: 'var(--text-primary)', outline: 'none', resize: 'none', fontFamily: 'inherit' }} />
              </div>

              {/* Price */}
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Harga (Rp) *</p>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="25000" style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border-strong)', borderRadius: '14px', padding: '14px 16px', fontSize: '15px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} />
              </div>

              {/* Category */}
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Kategori</p>
                <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border-strong)', borderRadius: '14px', padding: '14px 16px', fontSize: '15px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', appearance: 'none' }}>
                  <option value="">Tanpa kategori</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Badge */}
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Badge</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['', 'Terlaris', 'Baru', 'Rekomendasi', 'Promo'].map(b => (
                    <button key={b} onClick={() => setForm(f => ({ ...f, badge: b }))} style={{ padding: '8px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none', background: form.badge === b ? 'var(--accent)' : 'var(--surface-3)', color: form.badge === b ? 'white' : 'var(--text-secondary)', fontFamily: 'inherit' }}>
                      {b || 'Tidak Ada'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save */}
              <button onClick={handleSave} disabled={saving || !form.name || !form.price} style={{ width: '100%', height: '56px', borderRadius: '16px', background: form.name && form.price ? 'var(--accent)' : 'var(--surface-3)', border: 'none', color: 'white', fontSize: '16px', fontWeight: 700, cursor: form.name && form.price ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: form.name && form.price ? '0 8px 24px rgba(232,114,58,0.4)' : 'none', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}>
                {saving ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah Menu'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
