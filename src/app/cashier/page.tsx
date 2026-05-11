'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatRupiah, formatTime } from '@/lib/utils'
import { Receipt, CheckCircle2, Loader2, Banknote, Clock } from 'lucide-react'

interface OrderItem { id:string; qty:number; menu_items:{name:string; price:number} }
interface Order { id:string; created_at:string; status:string; total:number; tables:{code:string} | {code:string}[]; order_items:OrderItem[] }

export default function CashierPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string|null>(null)

  const load = useCallback(async () => {
    try {
      const sb = createClient()
      const { data } = await sb.from('orders')
        .select('id,created_at,status,total,tables(code),order_items(id,qty,menu_items(name,price))')
        .eq('status','ready').order('created_at', { ascending: true })
      setOrders((data as unknown as Order[]) ?? [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    load()
    const sb = createClient()
    const ch = sb.channel('cashier').on('postgres_changes',{event:'*',schema:'public',table:'orders'},load).subscribe()
    return () => { sb.removeChannel(ch) }
  }, [load])

  async function complete(id: string) {
    setCompleting(id)
    const sb = createClient()
    await sb.from('orders').update({ status:'completed' }).eq('id',id)
    await load()
    setCompleting(null)
  }

  return (
    <div style={{ minHeight:'100dvh', background:'var(--bg)' }}>
      <header style={{ position:'sticky', top:0, zIndex:50, background:'rgba(15,11,7,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)', padding:'0 20px', height:'60px', display:'flex', alignItems:'center', gap:'12px' }}>
        <div style={{ width:'36px', height:'36px', borderRadius:'12px', background:'var(--blue-dim)', border:'1px solid rgba(77,157,224,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Receipt size={18} color="var(--blue)" strokeWidth={1.5} />
        </div>
        <div style={{ flex:1 }}>
          <p style={{ fontWeight:700, fontSize:'15px', color:'var(--text-primary)', lineHeight:1 }}>Kasir</p>
          <p style={{ fontSize:'11px', color:'var(--text-muted)' }}>JANJIA Bistro & Space</p>
        </div>
        <div style={{ background:'var(--blue-dim)', border:'1px solid rgba(77,157,224,0.3)', borderRadius:'50px', padding:'4px 12px' }}>
          <span style={{ fontSize:'13px', fontWeight:700, color:'var(--blue)' }}>{orders.length}</span>
        </div>
      </header>

      <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:'12px' }}>
        {loading ? [1,2].map(i=><div key={i} style={{height:'180px',background:'var(--surface-1)',borderRadius:'20px'}}/>)
        : orders.length===0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'64px', height:'64px', borderRadius:'20px', background:'var(--blue-dim)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Banknote size={28} color="var(--blue)" strokeWidth={1.5} />
            </div>
            <p style={{ fontSize:'15px', fontWeight:600, color:'var(--text-primary)' }}>Tidak ada antrian</p>
            <p style={{ fontSize:'13px', color:'var(--text-muted)' }}>Pesanan yang siap akan muncul di sini</p>
          </div>
        ) : orders.map(order=>(
          <div key={order.id} style={{ background:'var(--surface-1)', borderRadius:'20px', border:'1px solid var(--border)', overflow:'hidden' }}>
            <div style={{ padding:'18px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--border)' }}>
              <div>
                <p style={{ fontSize:'20px', fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.5px' }}>Meja {order.tables.code}</p>
                <div style={{ display:'flex', alignItems:'center', gap:'5px', marginTop:'4px', color:'var(--text-muted)' }}>
                  <Clock size={12} strokeWidth={1.5}/>
                  <span style={{ fontSize:'12px' }}>{formatTime(order.created_at)}</span>
                </div>
              </div>
              <p style={{ fontSize:'22px', fontWeight:700, color:'var(--blue)', letterSpacing:'-0.5px' }}>{formatRupiah(order.total)}</p>
            </div>
            <div style={{ padding:'14px 20px', display:'flex', flexDirection:'column', gap:'10px', borderBottom:'1px solid var(--border)' }}>
              {order.order_items.map(item=>(
                <div key={item.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <span style={{ fontSize:'13px', fontWeight:700, color:'var(--accent)', minWidth:'20px' }}>{item.qty}×</span>
                    <span style={{ fontSize:'14px', color:'var(--text-primary)' }}>{item.menu_items.name}</span>
                  </div>
                  <span style={{ fontSize:'13px', color:'var(--text-muted)' }}>{formatRupiah(item.menu_items.price*item.qty)}</span>
                </div>
              ))}
            </div>
            <div style={{ padding:'16px 20px' }}>
              <button onClick={()=>complete(order.id)} disabled={completing===order.id} style={{
                width:'100%', height:'52px', borderRadius:'14px',
                background:'var(--blue)', border:'none',
                color:'white', fontSize:'15px', fontWeight:700,
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                cursor:'pointer', transition:'opacity 0.15s', opacity:completing===order.id?0.6:1,
              }}>
                {completing===order.id ? <Loader2 size={18} className="animate-spin"/> : <CheckCircle2 size={18} strokeWidth={1.5}/>}
                Selesai & Bayar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
