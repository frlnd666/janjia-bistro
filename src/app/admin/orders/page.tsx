'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatRupiah, formatTime } from '@/lib/utils'
import { Clock, ChevronDown, Loader2 } from 'lucide-react'

type Status = 'new'|'preparing'|'ready'|'completed'|'cancelled'
const STATUS_LABEL: Record<Status, string> = { new:'Baru', preparing:'Dimasak', ready:'Siap', completed:'Selesai', cancelled:'Batal' }
const STATUS_COLOR: Record<Status, {bg:string, text:string}> = {
  new: { bg:'var(--accent-dim)', text:'var(--accent)' },
  preparing: { bg:'var(--amber-dim)', text:'var(--amber)' },
  ready: { bg:'var(--green-dim)', text:'var(--green)' },
  completed: { bg:'rgba(255,255,255,0.05)', text:'var(--text-muted)' },
  cancelled: { bg:'rgba(255,0,0,0.08)', text:'#e05050' },
}

interface OrderItem { id:string; qty:number; menu_items:{name:string} }
interface Order { id:string; created_at:string; status:Status; total:number; tables:{code:string} | {code:string}[]; order_items:OrderItem[] }

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string|null>(null)

  const load = useCallback(async () => {
    const sb = createClient()
    const { data } = await sb.from('orders')
      .select('id,created_at,status,total,tables(code),order_items(id,qty,menu_items(name))')
      .order('created_at', { ascending: false })
      .limit(50)
    setOrders((data as unknown as Order[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const sb = createClient()
    const ch = sb.channel('admin-orders')
      .on('postgres_changes', { event:'*', schema:'public', table:'orders' }, load)
      .subscribe()
    return () => { sb.removeChannel(ch) }
  }, [load])

  async function updateStatus(id: string, status: Status) {
    setUpdating(id)
    const sb = createClient()
    await sb.from('orders').update({ status }).eq('id', id)
    await load()
    setUpdating(null)
  }

  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Semua Pesanan</p>

      {loading ? (
        [1,2,3].map(i => <div key={i} style={{ height: '140px', background: 'var(--surface-1)', borderRadius: '20px', animation: 'pulse 1.5s infinite' }} />)
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <ShoppingBagIcon />
          <p style={{ marginTop: '12px', fontSize: '14px' }}>Belum ada pesanan</p>
        </div>
      ) : orders.map(order => {
        const s = STATUS_COLOR[order.status]
        return (
          <div key={order.id} style={{
            background: 'var(--surface-1)', borderRadius: '20px',
            border: '1px solid var(--border)', overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Meja {Array.isArray(order.tables) ? order.tables[0]?.code : order.tables.code}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px', color: 'var(--text-muted)' }}>
                  <Clock size={12} strokeWidth={1.5} />
                  <span style={{ fontSize: '12px' }}>{formatTime(order.created_at)}</span>
                </div>
              </div>
              <span style={{ background: s.bg, color: s.text, fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '50px' }}>
                {STATUS_LABEL[order.status]}
              </span>
            </div>

            {/* Items */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {order.order_items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>{item.qty}</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{item.menu_items.name}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.3px' }}>{formatRupiah(order.total)}</p>
              <div style={{ position: 'relative' }}>
                {updating === order.id
                  ? <Loader2 size={20} color="var(--text-muted)" className="animate-spin" />
                  : (
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value as Status)}
                        style={{
                          appearance: 'none', WebkitAppearance: 'none',
                          background: 'var(--surface-3)', border: '1px solid var(--border-strong)',
                          borderRadius: '12px', color: 'var(--text-primary)',
                          fontSize: '13px', fontWeight: 500,
                          padding: '10px 36px 10px 14px',
                          minHeight: '44px', cursor: 'pointer',
                        }}>
                        {(Object.keys(STATUS_LABEL) as Status[]).map(s => (
                          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ShoppingBagIcon() {
  return <div style={{ width: '48px', height: '48px', margin: '0 auto', borderRadius: '16px', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingBag size={24} color="var(--text-muted)" strokeWidth={1.5} /></div>
}

import { ShoppingBag } from 'lucide-react'
