'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { UtensilsCrossed, QrCode, Clock, Wifi, Star, ChevronRight, ArrowRight } from 'lucide-react'

function HomeContent() {
  const params = useSearchParams()
  const tableId = params.get('table')

  return (
    <div style={{ minHeight:'100dvh', background:'var(--bg)', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'fixed', top:'-120px', left:'50%', transform:'translateX(-50%)', width:'400px', height:'400px', background:'radial-gradient(circle, rgba(232,114,58,0.12) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 24px 32px', position:'relative', zIndex:1 }}>
        <div style={{ width:'72px', height:'72px', borderRadius:'24px', background:'linear-gradient(135deg, #e8723a, #c4521a)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'24px', boxShadow:'0 20px 60px rgba(232,114,58,0.35)' }}>
          <UtensilsCrossed size={32} color="white" strokeWidth={1.5} />
        </div>
        <p style={{ fontSize:'12px', color:'var(--text-muted)', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'8px' }}>Selamat Datang di</p>
        <h1 style={{ fontSize:'44px', fontWeight:800, color:'var(--text-primary)', letterSpacing:'-1.5px', lineHeight:1, marginBottom:'6px' }}>JANJIA</h1>
        <p style={{ fontSize:'15px', color:'var(--accent)', fontWeight:600, letterSpacing:'0.15em', marginBottom:'16px' }}>BISTRO & SPACE</p>
        <p style={{ fontSize:'14px', color:'var(--text-secondary)', textAlign:'center', maxWidth:'260px', lineHeight:1.6, marginBottom:'40px' }}>Nikmati pengalaman bersantap premium. Pesan langsung dari mejamu.</p>
        <div style={{ width:'100%', maxWidth:'320px', display:'flex', flexDirection:'column', gap:'12px', marginBottom:'32px' }}>
          <Link href={tableId ? `/menu?table=${tableId}` : '/menu'} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--accent)', borderRadius:'18px', padding:'18px 22px', textDecoration:'none', boxShadow:'0 8px 32px rgba(232,114,58,0.4)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'12px', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <UtensilsCrossed size={18} color="white" strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize:'16px', fontWeight:700, color:'white', lineHeight:1 }}>Lihat Menu</p>
                <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.7)', marginTop:'2px' }}>Pilih makanan favoritmu</p>
              </div>
            </div>
            <ArrowRight size={20} color="white" strokeWidth={2} />
          </Link>
          <Link href="/scan" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--surface-2)', borderRadius:'18px', padding:'18px 22px', border:'1px solid var(--border-strong)', textDecoration:'none' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'12px', background:'var(--surface-3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <QrCode size={18} color="var(--text-secondary)" strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize:'16px', fontWeight:600, color:'var(--text-primary)', lineHeight:1 }}>Scan QR Meja</p>
                <p style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'2px' }}>Scan untuk pesan di meja</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" strokeWidth={1.5} />
          </Link>
        </div>
        <div style={{ display:'flex', gap:'10px', marginBottom:'40px', flexWrap:'wrap', justifyContent:'center' }}>
          {[{icon:Clock,label:'10:00 – 22:00'},{icon:Wifi,label:'WiFi Gratis'},{icon:Star,label:'4.9 / 5'}].map(({icon:Icon,label})=>(
            <div key={label} style={{ display:'flex', alignItems:'center', gap:'6px', background:'var(--surface-2)', borderRadius:'50px', border:'1px solid var(--border)', padding:'8px 14px' }}>
              <Icon size={13} color="var(--accent)" strokeWidth={1.5} />
              <span style={{ fontSize:'12px', fontWeight:600, color:'var(--text-secondary)' }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ width:'100%', maxWidth:'320px', background:'var(--surface-1)', borderRadius:'20px', border:'1px solid var(--border)', padding:'20px', marginBottom:'24px' }}>
          <p style={{ fontSize:'11px', color:'var(--text-muted)', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'16px' }}>Cara Memesan</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {[{n:'01',icon:QrCode,text:'Scan QR di meja kamu'},{n:'02',icon:UtensilsCrossed,text:'Pilih menu favoritmu'},{n:'03',icon:Clock,text:'Tunggu pesanan datang'},{n:'04',icon:Star,text:'Bayar di kasir saat selesai'}].map(({n,icon:Icon,text})=>(
              <div key={n} style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                <span style={{ fontSize:'11px', fontWeight:700, color:'var(--text-muted)', minWidth:'20px' }}>{n}</span>
                <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'var(--surface-3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={15} color="var(--accent)" strokeWidth={1.5} />
                </div>
                <p style={{ fontSize:'14px', color:'var(--text-primary)', fontWeight:500 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ textAlign:'center', padding:'16px', position:'relative', zIndex:1 }}>
        <p style={{ fontSize:'11px', color:'var(--text-muted)' }}>© 2026 JANJIA Bistro & Space</p>
        <Link href="/login" style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'4px', display:'block' }}>Staff Login</Link>
      </div>
    </div>
  )
}

export default function HomePage() {
  return <Suspense fallback={<div style={{minHeight:'100dvh',background:'var(--bg)'}}/>}><HomeContent /></Suspense>
}
