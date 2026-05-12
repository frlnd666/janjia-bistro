'use client'

export const dynamic = 'force-dynamic'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Plus, QrCode, Trash2, Loader2, LayoutGrid, X,
  AlertTriangle, CheckCircle, XCircle, Download, ExternalLink, Copy
} from 'lucide-react'

interface Table { id: string; code: string; status: string }
type Toast = { id: number; type: 'success' | 'error'; msg: string }

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [newCode, setNewCode] = useState('')
  const [adding, setAdding] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Table | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [qrTarget, setQrTarget] = useState<Table | null>(null)
  const [downloading, setDownloading] = useState(false)

  const toast = (type: 'success' | 'error', msg: string) => {
    const id = Date.now()
    setToasts(p => [...p, { id, type, msg }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }

  const fetchData = useCallback(async () => {
    const sb = createClient()
    const { data, error } = await sb.from('tables').select('*').order('code')
    if (error) {
      toast('error', 'Gagal memuat data: ' + error.message)
      setLoading(false)
      return
    }
    setTables(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function addTable() {
    const code = newCode.trim().toUpperCase()
    if (!code) return
    setAdding(true)
    try {
      const sb = createClient()
      const { error } = await sb.from('tables').insert({ code, status: 'available' })
      if (error) throw error
      setNewCode('')
      await fetchData()
      toast('success', `Meja ${code} berhasil ditambahkan`)
    } catch (e: any) {
      toast('error', 'Gagal tambah meja: ' + (e?.message ?? 'Unknown error'))
    } finally {
      setAdding(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeletingId(deleteTarget.id)
    setDeleteTarget(null)
    try {
      const sb = createClient()
      const { error } = await sb.from('tables').delete().eq('id', deleteTarget.id)
      if (error) throw error
      await fetchData()
      toast('success', `Meja ${deleteTarget.code} berhasil dihapus`)
    } catch (e: any) {
      toast('error', 'Gagal hapus meja: ' + (e?.message ?? 'Unknown error'))
    } finally {
      setDeletingId(null)
    }
  }

  async function copyLink(table: Table) {
    try {
      const url = `https://janjia-bistro.vercel.app/menu/${table.code}`
      await navigator.clipboard.writeText(url)
      toast('success', `Link meja ${table.code} berhasil disalin`)
    } catch {
      toast('error', 'Gagal menyalin link')
    }
  }

  async function downloadQr(table: Table) {
    try {
      setDownloading(true)
      const res = await fetch(`/api/qr/${encodeURIComponent(table.code)}`)
      if (!res.ok) throw new Error('QR gagal diunduh')
      const svg = await res.text()
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qr-meja-${table.code}.svg`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast('success', `QR meja ${table.code} berhasil diunduh`)
    } catch (e: any) {
      toast('error', e?.message ?? 'Gagal download QR')
    } finally {
      setDownloading(false)
    }
  }

  const occupied = tables.filter(t => t.status === 'occupied').length
  const empty = tables.filter(t => t.status !== 'occupied').length

  return (
    <div style={{ padding: '24px 20px 120px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none' }}>
        {toasts.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--surface-1)', border: `1px solid ${t.type === 'success' ? 'rgba(106,176,76,0.4)' : 'rgba(224,80,80,0.4)'}`, borderRadius: '14px', padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', maxWidth: '280px', pointerEvents: 'auto' }}>
            {t.type === 'success'
              ? <CheckCircle size={16} color="var(--green)" strokeWidth={2} style={{ flexShrink: 0 }} />
              : <XCircle size={16} color="#e05050" strokeWidth={2} style={{ flexShrink: 0 }} />}
            <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.4 }}>{t.msg}</span>
          </div>
        ))}
      </div>

      {qrTarget && (
        <div
          onClick={() => setQrTarget(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(7,10,18,0.72)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              background: 'linear-gradient(180deg, var(--surface-1) 0%, var(--surface-2) 100%)',
              borderRadius: '28px',
              border: '1px solid var(--border)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.32)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '999px', background: 'var(--surface-3)', border: '1px solid var(--border)' }}>
                  <QrCode size={14} color="var(--accent)" strokeWidth={2} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    QR Meja
                  </span>
                </div>
                <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '12px', letterSpacing: '-0.5px' }}>
                  Meja {qrTarget.code}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
                  Scan QR untuk membuka menu meja ini secara langsung.
                </p>
              </div>

              <button
                onClick={() => setQrTarget(null)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '14px',
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <X size={17} color="var(--text-primary)" />
              </button>
            </div>

            <div style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)',
              borderRadius: '24px',
              padding: '18px',
              border: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img
                src={`/api/qr/${encodeURIComponent(qrTarget.code)}`}
                alt={`QR meja ${qrTarget.code}`}
                width={260}
                height={260}
                style={{
                  width: '100%',
                  maxWidth: '260px',
                  height: 'auto',
                  aspectRatio: '1 / 1',
                  objectFit: 'contain'
                }}
              />
            </div>

            <div style={{
              background: 'var(--surface-3)',
              borderRadius: '18px',
              padding: '14px 16px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Link tujuan
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6, wordBreak: 'break-all' }}>
                {`https://janjia-bistro.vercel.app/menu/${qrTarget.code}`}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => window.open(`/api/qr/${encodeURIComponent(qrTarget.code)}`, '_blank')}
                style={{
                  height: '48px',
                  borderRadius: '14px',
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <ExternalLink size={16} />
                Buka File
              </button>

              <button
                onClick={() => copyLink(qrTarget)}
                style={{
                  height: '48px',
                  borderRadius: '14px',
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Copy size={16} />
                Salin Link
              </button>
            </div>

            <button
              onClick={() => downloadQr(qrTarget)}
              disabled={downloading}
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '16px',
                background: downloading ? 'var(--surface-3)' : 'var(--accent)',
                border: 'none',
                color: downloading ? 'var(--text-muted)' : 'white',
                fontWeight: 800,
                fontSize: '14px',
                cursor: downloading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: downloading ? 'none' : '0 14px 32px rgba(232,114,58,0.28)'
              }}
            >
              <Download size={16} />
              {downloading ? 'Mengunduh QR...' : `Download QR ${qrTarget.code}`}
            </button>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '0 0 24px' }}
          onClick={() => setDeleteTarget(null)}>
          <div style={{ background: 'var(--surface-1)', borderRadius: '24px', padding: '28px 24px', width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--border)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(224,80,80,0.1)', border: '1px solid rgba(224,80,80,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={24} color="#e05050" strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Hapus Meja {deleteTarget.code}?</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>Tindakan ini tidak dapat dibatalkan. Data meja akan dihapus permanen.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, height: '48px', borderRadius: '14px', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit' }}>
                Batal
              </button>
              <button onClick={confirmDelete} style={{ flex: 1, height: '48px', borderRadius: '14px', background: 'rgba(224,80,80,0.15)', border: '1px solid rgba(224,80,80,0.3)', color: '#e05050', fontWeight: 700, fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit' }}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ background: 'var(--accent-dim)', borderRadius: '20px', border: '1px solid rgba(232,114,58,0.2)', padding: '18px 20px' }}>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1 }}>{occupied}</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>Meja Terisi</p>
        </div>
        <div style={{ background: 'var(--green-dim)', borderRadius: '20px', border: '1px solid rgba(106,176,76,0.2)', padding: '18px 20px' }}>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1 }}>{empty}</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>Meja Kosong</p>
        </div>
      </div>

      <section>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>Tambah Meja</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            value={newCode}
            onChange={e => setNewCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTable()}
            placeholder="Kode meja (A1, B2...)"
            maxLength={10}
            style={{ flex: 1, background: 'var(--surface-2)', border: '1px solid var(--border-strong)', borderRadius: '14px', padding: '14px 16px', fontSize: '15px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', minHeight: '52px' }}
          />
          <button
            onClick={addTable}
            disabled={adding || !newCode.trim()}
            style={{ height: '52px', paddingInline: '20px', borderRadius: '14px', background: adding || !newCode.trim() ? 'var(--surface-3)' : 'var(--accent)', border: 'none', color: adding || !newCode.trim() ? 'var(--text-muted)' : 'white', fontWeight: 700, fontSize: '14px', cursor: adding || !newCode.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0, fontFamily: 'inherit' }}>
            {adding ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={16} strokeWidth={2.5} />}
            Tambah
          </button>
        </div>
      </section>

      <section>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>Semua Meja ({tables.length})</p>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: '110px', background: 'var(--surface-1)', borderRadius: '18px' }} />)}
          </div>
        ) : tables.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutGrid size={24} color="var(--text-muted)" strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Belum ada meja</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tambah meja di atas</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {tables.map(table => {
              const isOccupied = table.status === 'occupied'
              return (
                <div key={table.id} style={{ background: isOccupied ? 'var(--accent-dim)' : 'var(--surface-1)', borderRadius: '18px', border: `1px solid ${isOccupied ? 'rgba(232,114,58,0.25)' : 'var(--border)'}`, padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOccupied ? 'var(--accent)' : 'var(--green)' }} />
                  <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1 }}>{table.code}</p>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: isOccupied ? 'var(--accent)' : 'var(--green)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {isOccupied ? 'Terisi' : 'Kosong'}
                  </span>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', width: '100%' }}>
                    <button
                      onClick={() => setQrTarget(table)}
                      style={{ flex: 1, height: '32px', borderRadius: '10px', background: 'var(--surface-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      title="Lihat QR"
                    >
                      <QrCode size={14} color="var(--text-muted)" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(table)}
                      disabled={deletingId === table.id}
                      style={{ flex: 1, height: '32px', borderRadius: '10px', background: 'rgba(224,80,80,0.1)', border: '1px solid rgba(224,80,80,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      {deletingId === table.id
                        ? <Loader2 size={13} color="#e05050" style={{ animation: 'spin 1s linear infinite' }} />
                        : <Trash2 size={13} color="#e05050" strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}
