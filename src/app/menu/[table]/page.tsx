'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatRupiah } from '@/lib/utils'
import { ShoppingCart, Plus, Minus, Search, ChevronLeft, X, ArrowRight, Loader2, UtensilsCrossed } from 'lucide-react'

interface Category { id: string; name: string }
interface MenuItem { id: string; name: string; description: string; price: number; image_url?: string; category_id: string; is_available: boolean; badge?: string }
type CartItem = MenuItem & { qty: number }

export default function MenuPage() {
  const { table } = useParams<{ table: string }>()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCart, setShowCart] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    try {
      const sb = createClient()
      const [catRes, itemRes] = await Promise.all([
        sb.from('menu_categories').select('id,name').order('created_at', { ascending: true }),
        sb.from('menu_items').select('id,name,description,price,image_url,category_id,is_available,badge').eq('is_available', true).order('created_at', { ascending: true }),
      ])
      setCategories(catRes.data ?? [])
      setItems(itemRes.data ?? [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = items.filter(item => {
    const matchCat = activeCategory === 'all' || item.category_id === activeCategory
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function addToCart(item: MenuItem) {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id)
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  function removeFromCart(id: string) {
    setCart(prev => {
      const item = prev.find(c => c.id === id)
      if (!item) return prev
      if (item.qty <= 1) return prev.filter(c => c.id !== id)
      return prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c)
    })
  }

  function getQty(id: string) { return cart.find(c => c.id === id)?.qty ?? 0 }

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const cartCount = cart.reduce((s, c) => s + c.qty, 0)

  async function submitOrder() {
    if (!table || cart.length === 0) return
    setSubmitting(true)
    try {
      const sb = createClient()
      // Cari table_id dari code
      const { data: tableData } = await sb.from('tables').select('id').eq('code', table).single()
      const tableId = tableData?.id
      if (!tableId) throw new Error('Meja tidak ditemukan')

      const { data: order, error } = await sb.from('orders').insert({
        table_id: tableId, status: 'new', total: cartTotal,
      }).select('id').single()
      if (error) throw error

      await sb.from('order_items').insert(
        cart.map(c => ({ order_id: order.id, menu_item_id: c.id, qty: c.qty, price: c.price }))
      )
      setCart([])
      setShowCart(false)
      router.push(`/track?order=${order.id}`)
    } catch(e) {
      console.error(e)
      alert('Gagal memesan. Coba lagi.')
    } finally { setSubmitting(false) }
  }

  return (
    <div style={{ minHeight:'100dvh', background:'var(--bg)', paddingBottom:'100px' }}>

      {/* Header */}
      <header style={{ position:'sticky', top:0, zIndex:40, background:'rgba(15,11,7,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)' }}>
        <div style={{ padding:'14px 20px 0', display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.back()} style={{ width:'38px', height:'38px', borderRadius:'12px', background:'var(--surface-2)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
            <ChevronLeft size={20} color="var(--text-primary)" strokeWidth={2} />
          </button>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:'17px', fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.3px' }}>Menu</p>
            <p style={{ fontSize:'11px', color:'var(--accent)', marginTop:'1px', fontWeight:600 }}>Meja {table}</p>
          </div>
          {cartCount > 0 && (
            <button onClick={() => setShowCart(true)} style={{ position:'relative', width:'44px', height:'44px', borderRadius:'14px', background:'var(--accent)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 20px rgba(232,114,58,0.4)' }}>
              <ShoppingCart size={20} color="white" strokeWidth={1.5} />
              <span style={{ position:'absolute', top:'-5px', right:'-5px', width:'20px', height:'20px', borderRadius:'50%', background:'#e05050', fontSize:'11px', fontWeight:700, color:'white', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid var(--bg)' }}>{cartCount}</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div style={{ padding:'12px 20px 0', position:'relative' }}>
          <Search size={15} color="var(--text-muted)" strokeWidth={1.5} style={{ position:'absolute', left:'36px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari menu..." style={{ width:'100%', background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'14px', padding:'11px 16px 11px 42px', fontSize:'14px', color:'var(--text-primary)', outline:'none', fontFamily:'inherit' }} />
        </div>

        {/* Category Tabs */}
        <div style={{ overflowX:'auto', padding:'12px 20px 14px', display:'flex', gap:'8px', scrollbarWidth:'none', WebkitOverflowScrolling:'touch' }}>
          {[{ id:'all', name:'Semua' }, ...categories].map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ flexShrink:0, padding:'8px 18px', borderRadius:'50px', fontSize:'13px', fontWeight:600, cursor:'pointer', border:'none', transition:'all 0.15s', background: activeCategory === cat.id ? 'var(--accent)' : 'var(--surface-2)', color: activeCategory === cat.id ? 'white' : 'var(--text-secondary)', boxShadow: activeCategory === cat.id ? '0 4px 16px rgba(232,114,58,0.35)' : 'none', fontFamily:'inherit' }}>
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Menu Items */}
      <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:'12px' }}>
        {loading ? (
          [1,2,3,4].map(i => <div key={i} style={{ height:'110px', background:'var(--surface-1)', borderRadius:'20px', opacity: 1 - i * 0.15 }} />)
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'18px', background:'var(--surface-2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <UtensilsCrossed size={24} color="var(--text-muted)" strokeWidth={1.5} />
            </div>
            <p style={{ fontSize:'15px', fontWeight:600, color:'var(--text-primary)' }}>Menu tidak ditemukan</p>
            <p style={{ fontSize:'13px', color:'var(--text-muted)' }}>Coba kata kunci lain</p>
          </div>
        ) : filtered.map(item => {
          const qty = getQty(item.id)
          return (
            <div key={item.id} style={{ background:'var(--surface-1)', borderRadius:'20px', border:'1px solid var(--border)', display:'flex', overflow:'hidden' }}>
              {/* Image */}
              <div style={{ width:'108px', flexShrink:0, background:'var(--surface-3)', position:'relative', minHeight:'112px' }}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                  : <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px' }}>🍽</div>
                }
                {item.badge && (
                  <span style={{ position:'absolute', top:'8px', left:'8px', background:'var(--accent)', color:'white', fontSize:'9px', fontWeight:700, padding:'3px 8px', borderRadius:'50px', textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{item.badge}</span>
                )}
              </div>

              {/* Content */}
              <div style={{ flex:1, padding:'14px 16px', display:'flex', flexDirection:'column', justifyContent:'space-between', minWidth:0 }}>
                <div>
                  <p style={{ fontSize:'15px', fontWeight:700, color:'var(--text-primary)', lineHeight:1.3, marginBottom:'4px' }}>{item.name}</p>
                  <p style={{ fontSize:'12px', color:'var(--text-muted)', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{item.description}</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'12px' }}>
                  <p style={{ fontSize:'16px', fontWeight:700, color:'var(--accent)' }}>{formatRupiah(item.price)}</p>
                  {qty === 0 ? (
                    <button onClick={() => addToCart(item)} style={{ width:'36px', height:'36px', borderRadius:'12px', background:'var(--accent)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(232,114,58,0.4)', flexShrink:0 }}>
                      <Plus size={18} color="white" strokeWidth={2.5} />
                    </button>
                  ) : (
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
                      <button onClick={() => removeFromCart(item.id)} style={{ width:'32px', height:'32px', borderRadius:'10px', background:'var(--surface-3)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Minus size={15} color="var(--text-primary)" strokeWidth={2.5} />
                      </button>
                      <span style={{ fontSize:'15px', fontWeight:700, color:'var(--text-primary)', minWidth:'20px', textAlign:'center' }}>{qty}</span>
                      <button onClick={() => addToCart(item)} style={{ width:'32px', height:'32px', borderRadius:'10px', background:'var(--accent)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Plus size={15} color="white" strokeWidth={2.5} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Sticky Cart Button */}
      {cartCount > 0 && !showCart && (
        <div style={{ position:'fixed', bottom:'24px', left:'20px', right:'20px', zIndex:30 }}>
          <button onClick={() => setShowCart(true)} style={{ width:'100%', height:'60px', borderRadius:'18px', background:'var(--accent)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', boxShadow:'0 8px 32px rgba(232,114,58,0.5)', fontFamily:'inherit' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ width:'28px', height:'28px', borderRadius:'8px', background:'rgba(255,255,255,0.2)', fontSize:'13px', fontWeight:700, color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>{cartCount}</span>
              <span style={{ fontSize:'15px', fontWeight:700, color:'white' }}>Lihat Keranjang</span>
            </div>
            <span style={{ fontSize:'15px', fontWeight:700, color:'white' }}>{formatRupiah(cartTotal)}</span>
          </button>
        </div>
      )}

      {/* Cart Bottom Sheet */}
      {showCart && (
        <div style={{ position:'fixed', inset:0, zIndex:50 }}>
          <div onClick={() => setShowCart(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }} />
          <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'var(--surface-1)', borderRadius:'24px 24px 0 0', maxHeight:'85dvh', overflowY:'auto', borderTop:'1px solid var(--border-strong)' }}>
            {/* Handle */}
            <div style={{ width:'36px', height:'4px', borderRadius:'50px', background:'var(--surface-3)', margin:'12px auto 4px' }} />
            <div style={{ padding:'12px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <p style={{ fontSize:'18px', fontWeight:700, color:'var(--text-primary)' }}>Keranjang ({cartCount})</p>
              <button onClick={() => setShowCart(false)} style={{ width:'36px', height:'36px', borderRadius:'12px', background:'var(--surface-3)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <X size={18} color="var(--text-primary)" strokeWidth={2} />
              </button>
            </div>

            <div style={{ padding:'0 20px', display:'flex', flexDirection:'column', gap:'10px', marginBottom:'16px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display:'flex', alignItems:'center', gap:'14px', background:'var(--surface-2)', borderRadius:'16px', padding:'14px 16px' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:'15px', fontWeight:600, color:'var(--text-primary)', marginBottom:'3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</p>
                    <p style={{ fontSize:'13px', color:'var(--accent)', fontWeight:700 }}>{formatRupiah(item.price * item.qty)}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
                    <button onClick={() => removeFromCart(item.id)} style={{ width:'32px', height:'32px', borderRadius:'10px', background:'var(--surface-3)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Minus size={14} color="var(--text-primary)" strokeWidth={2.5} />
                    </button>
                    <span style={{ fontSize:'16px', fontWeight:700, color:'var(--text-primary)', minWidth:'24px', textAlign:'center' }}>{item.qty}</span>
                    <button onClick={() => addToCart(item)} style={{ width:'32px', height:'32px', borderRadius:'10px', background:'var(--accent)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Plus size={14} color="white" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ margin:'0 20px', padding:'16px 0', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <span style={{ fontSize:'15px', color:'var(--text-secondary)' }}>Total Pembayaran</span>
              <span style={{ fontSize:'22px', fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.5px' }}>{formatRupiah(cartTotal)}</span>
            </div>

            <div style={{ padding:'0 20px 40px' }}>
              <button onClick={submitOrder} disabled={submitting} style={{ width:'100%', height:'58px', borderRadius:'18px', background:'var(--accent)', border:'none', cursor:'pointer', color:'white', fontSize:'16px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', boxShadow:'0 8px 32px rgba(232,114,58,0.4)', opacity: submitting ? 0.6 : 1, fontFamily:'inherit', transition:'opacity 0.15s' }}>
                {submitting
                  ? <><Loader2 size={20} style={{ animation:'spin 1s linear infinite' }} /> Memproses...</>
                  : <><ArrowRight size={20} strokeWidth={2} /> Pesan Sekarang</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
