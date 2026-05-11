'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatRupiah } from '@/lib/utils'
import { UtensilsCrossed, Clock, ChefHat, CheckCircle2, XCircle, BellRing, ArrowLeft, Receipt } from 'lucide-react'

type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled'

interface OrderItem {
  id: string
  qty: number
  price: number
  menu_items: { name: string; image_url?: string }
}

interface Order {
  id: string
  status: OrderStatus
  subtotal: number
  tax: number
  total: number
  created_at: string
  table_id: string
  order_items: OrderItem[]
  tables?: { code: string }
}

const STATUS_CONFIG: Record<OrderStatus, {
  label: string
  desc: string
  icon: React.ReactNode
  color: string
  bg: string
  glow: string
  step: number
}> = {
  new: {
    label: 'Pesanan Diterima',
    desc: 'Pesananmu sudah diterima, dapur sedang mempersiapkan...',
    icon: <Clock size={24} strokeWidth={1.5} />,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    glow: 'rgba(245,158,11,0.3)',
    step: 1,
  },
  preparing: {
    label: 'Sedang Dimasak',
    desc: 'Chef sedang memasak pesananmu dengan penuh semangat! 🍳',
    icon: <ChefHat size={24} strokeWidth={1.5} />,
    color: '#e8723a',
    bg: 'rgba(232,114,58,0.12)',
    glow: 'rgba(232,114,58,0.3)',
    step: 2,
  },
  ready: {
    label: 'Siap Disajikan',
    desc: 'Pesananmu sudah siap! Pelayan akan segera mengantarkan 🎉',
    icon: <UtensilsCrossed size={24} strokeWidth={1.5} />,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    glow: 'rgba(16,185,129,0.3)',
    step: 3,
  },
  completed: {
    label: 'Selesai',
    desc: 'Selamat menikmati! Terima kasih sudah makan di JANJIA 🙏',
    icon: <CheckCircle2 size={24} strokeWidth={1.5} />,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    glow: 'rgba(16,185,129,0.3)',
    step: 4,
  },
  cancelled: {
    label: 'Dibatalkan',
    desc: 'Pesanan dibatalkan. Hubungi kasir jika ada pertanyaan.',
    icon: <XCircle size={24} strokeWidth={1.5} />,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    glow: 'rgba(239,68,68,0.2)',
    step: 0,
  },
}

const STEPS = [
  { key: 'new', label: 'Diterima', icon: <Clock size={14} strokeWidth={2} /> },
  { key: 'preparing', label: 'Dimasak', icon: <ChefHat size={14} strokeWidth={2} /> },
  { key: 'ready', label: 'Siap', icon: <UtensilsCrossed size={14} strokeWidth={2} /> },
  { key: 'completed', label: 'Selesai', icon: <CheckCircle2 size={14} strokeWidth={2} /> },
]

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function PulsingDot({ color }: { color: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: '10px', height: '10px' }}>
      <span style={{
        position: 'absolute', inset: 0, borderRadius: '50%', background: color, opacity: 0.4,
        animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
      }} />
      <span style={{ position: 'relative', borderRadius: '50%', width: '10px', height: '10px', background: color }} />
    </span>
  )
}

function TrackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('order')
  const tableCode = searchParams.get('table')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [calledWaiter, setCalledWaiter] = useState(false)

  async function fetchOrder() {
    if (!orderId) return
    const sb = createClient()
    const { data } = await sb
      .from('orders')
      .select('*, tables(code), order_items(*, menu_items(name, image_url))')
      .eq('id', orderId)
      .single()
    if (data) setOrder(data as Order)
    setLoading(false)
  }

  useEffect(() => {
    fetchOrder()
    const sb = createClient()
    const ch = sb.channel('track')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, fetchOrder)
      .subscribe()
    return () => { sb.removeChannel(ch) }
  }, [orderId])

  async function callWaiter() {
    if (!order || calledWaiter) return
    const sb = createClient()
    await sb.from('waiter_calls').insert({ table_id: order.table_id, status: 'pending' })
    setCalledWaiter(true)
    setTimeout(() => setCalledWaiter(false), 30000)
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg,#e8723a,#c4521a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UtensilsCrossed size={24} color="white" strokeWidth={1.5} />
        </div>
        <div style={{ width: '28px', height: '28px', border: '3px solid rgba(232,114,58,0.2)', borderTopColor: '#e8723a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    </div>
  )

  if (!order) return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>😕</div>
      <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Pesanan tidak ditemukan</p>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>ID pesanan tidak valid atau sudah kadaluarsa</p>
      <button onClick={() => router.push('/')} style={{ padding: '12px 28px', background: 'var(--accent)', borderRadius: '14px', border: 'none', color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
        Kembali ke Beranda
      </button>
    </div>
  )

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.new
  const currentStep = cfg.step
  const displayCode = tableCode || order.tables?.code || '?'
  const tax = order.tax ?? Math.round((order.subtotal ?? order.total) * 0.1)
  const subtotal = order.subtotal ?? (order.total - tax)

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes ping { 75%,100% { transform: scale(2); opacity: 0 } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.5 } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.9) } to { opacity:1; transform:scale(1) } }
        .track-card { animation: fadeUp 0.4s ease both }
        .status-icon-wrap { animation: scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both }
      `}</style>

      <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: '100px' }}>

        {/* Header */}
        <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)', padding: '12px 16px 12px', position: 'sticky', top: 0, zIndex: 40, backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.back()} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <ArrowLeft size={18} color="var(--text-primary)" strokeWidth={1.5} />
            </button>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Meja {displayCode}</p>
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>Status Pesanan</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--surface-2)', borderRadius: '50px', padding: '5px 10px', border: '1px solid var(--border)' }}>
              <PulsingDot color={order.status === 'cancelled' ? '#ef4444' : '#10b981'} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Live</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Status Card */}
          <div className="track-card" style={{ background: cfg.bg, borderRadius: '24px', border: `1px solid ${cfg.color}30`, padding: '24px', textAlign: 'center', animationDelay: '0.05s' }}>
            <div className="status-icon-wrap" style={{ width: '72px', height: '72px', borderRadius: '24px', background: cfg.bg, border: `2px solid ${cfg.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: cfg.color, boxShadow: `0 8px 32px ${cfg.glow}`, animationDelay: '0.15s' }}>
              {cfg.icon}
            </div>
            <p style={{ fontSize: '20px', fontWeight: 800, color: cfg.color, marginBottom: '8px', letterSpacing: '-0.5px' }}>{cfg.label}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '260px', margin: '0 auto 20px' }}>{cfg.desc}</p>

            {/* Progress Steps */}
            {order.status !== 'cancelled' && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {STEPS.map((step, i) => {
                  const stepNum = i + 1
                  const isDone = stepNum < currentStep
                  const isActive = stepNum === currentStep
                  return (
                    <div key={step.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isDone || isActive ? cfg.color : 'var(--surface-3)',
                        color: isDone || isActive ? 'white' : 'var(--text-muted)',
                        border: isActive ? `3px solid ${cfg.color}40` : '2px solid transparent',
                        boxShadow: isActive ? `0 0 0 3px ${cfg.glow}` : 'none',
                        transition: 'all 0.4s ease',
                        position: 'relative',
                      }}>
                        {isDone ? <CheckCircle2 size={14} strokeWidth={2.5} /> : step.icon}
                        {isActive && (
                          <span style={{ position: 'absolute', inset: '-4px', borderRadius: '50%', border: `2px solid ${cfg.color}`, animation: 'ping 1.5s ease infinite', opacity: 0.4 }} />
                        )}
                      </div>
                      <div style={{ height: '2px', width: '100%', background: isDone || isActive ? cfg.color : 'var(--border)', borderRadius: '2px', transition: 'background 0.4s ease' }} />
                      <p style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500, color: isActive ? cfg.color : 'var(--text-muted)', letterSpacing: '0.02em' }}>{step.label}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="track-card" style={{ background: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden', animationDelay: '0.1s' }}>
            <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Receipt size={16} color="var(--accent)" strokeWidth={1.5} />
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Detail Pesanan</p>
              <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>Pukul {formatTime(order.created_at)}</span>
            </div>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '12px' }}>
              {order.order_items.map((item, i) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < order.order_items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '8px', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>{item.qty}×</span>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{item.menu_items.name}</p>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{formatRupiah(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--surface-2)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Subtotal</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{formatRupiah(subtotal)}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pajak (10%)</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{formatRupiah(tax)}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Total</p>
                <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)' }}>{formatRupiah(order.total)}</p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="track-card" style={{ background: 'rgba(232,114,58,0.06)', borderRadius: '16px', border: '1px solid rgba(232,114,58,0.2)', padding: '14px 16px', display: 'flex', gap: '10px', animationDelay: '0.15s' }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Halaman ini otomatis update saat status berubah. Tidak perlu refresh manual!</p>
          </div>

        </div>

        {/* Bottom Action */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px 28px', background: 'var(--surface-1)', borderTop: '1px solid var(--border)', backdropFilter: 'blur(20px)', display: 'flex', gap: '10px', zIndex: 40 }}>
          {order.status !== 'completed' && order.status !== 'cancelled' && (
            <button onClick={callWaiter} disabled={calledWaiter} style={{
              flex: 1, height: '52px', borderRadius: '16px', border: '1.5px solid var(--border)',
              background: calledWaiter ? 'var(--surface-2)' : 'var(--surface-1)',
              color: calledWaiter ? 'var(--text-muted)' : 'var(--text-primary)',
              fontSize: '14px', fontWeight: 600, cursor: calledWaiter ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s ease',
            }}>
              <BellRing size={18} strokeWidth={1.5} />
              {calledWaiter ? 'Pelayan Dipanggil ✓' : 'Panggil Pelayan'}
            </button>
          )}
          {order.status === 'completed' ? (
            <button onClick={() => router.push(`/menu/${displayCode}`)} style={{ flex: 1, height: '52px', borderRadius: '16px', background: 'var(--accent)', border: 'none', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <UtensilsCrossed size={18} strokeWidth={1.5} />
              Pesan Lagi
            </button>
          ) : (
            <button onClick={() => router.push(`/menu/${displayCode}`)} style={{ flex: 1, height: '52px', borderRadius: '16px', background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <UtensilsCrossed size={18} strokeWidth={1.5} />
              Tambah Pesanan
            </button>
          )}
        </div>

      </div>
    </>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '28px', height: '28px', border: '3px solid rgba(232,114,58,0.2)', borderTopColor: '#e8723a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <TrackContent />
    </Suspense>
  )
}
