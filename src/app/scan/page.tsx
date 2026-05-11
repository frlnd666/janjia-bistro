'use client'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { QrCode, ArrowRight } from 'lucide-react'

export default function ScanPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function go() {
    const code = inputRef.current?.value.trim().toUpperCase()
    if (code) router.push(`/table/${code}`)
  }

  return (
    <div style={{ minHeight:'100dvh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px', gap:'28px' }}>
      <div style={{ width:'72px', height:'72px', borderRadius:'24px', background:'var(--accent-dim)', border:'1px solid rgba(232,114,58,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <QrCode size={32} color="var(--accent)" strokeWidth={1.5} />
      </div>
      <div style={{ textAlign:'center' }}>
        <h1 style={{ fontSize:'24px', fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.5px', marginBottom:'8px' }}>Masukkan Kode Meja</h1>
        <p style={{ fontSize:'14px', color:'var(--text-muted)', lineHeight:1.6 }}>Lihat kode meja di stiker QR<br/>lalu ketik di bawah ini</p>
      </div>
      <div style={{ width:'100%', maxWidth:'320px', display:'flex', flexDirection:'column', gap:'12px' }}>
        <div style={{ display:'flex', gap:'10px' }}>
          <input
            ref={inputRef}
            placeholder="Contoh: A1, B2, JANJIA1..."
            autoFocus
            maxLength={10}
            onKeyDown={e => e.key === 'Enter' && go()}
            style={{ flex:1, background:'var(--surface-2)', border:'1px solid var(--border-strong)', borderRadius:'14px', padding:'14px 16px', fontSize:'16px', color:'var(--text-primary)', outline:'none', fontFamily:'inherit', textTransform:'uppercase', letterSpacing:'0.05em' }}
          />
          <button onClick={go} style={{ height:'52px', width:'52px', borderRadius:'14px', background:'var(--accent)', border:'none', color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(232,114,58,0.4)', flexShrink:0 }}>
            <ArrowRight size={20} strokeWidth={2.5} />
          </button>
        </div>
        <button onClick={() => router.back()} style={{ background:'none', border:'none', color:'var(--text-muted)', fontSize:'14px', cursor:'pointer', fontFamily:'inherit', padding:'8px 0' }}>
          ← Kembali
        </button>
      </div>
    </div>
  )
}
