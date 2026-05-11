'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, QrCode, Trash2, Loader2, LayoutGrid } from 'lucide-react'

interface Table { id: string; code: string; status: string }

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [newCode, setNewCode] = useState('')
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    const sb = createClient()
    const { data } = await sb.from('tables').select('*').order('code')
    setTables(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function addTable() {
    if (!newCode.trim()) return
    setAdding(true)
    const sb = createClient()
    await sb.from('tables').insert({ code: newCode.trim().toUpperCase(), status: 'empty' })
    setNewCode('')
    await fetchData()
    setAdding(false)
  }

  async function deleteTable(id: string) {
    if (!confirm('Hapus meja ini?')) return
    setDeletingId(id)
    const sb = createClient()
    await sb.from('tables').delete().eq('id', id)
    await fetchData()
    setDeletingId(null)
  }

  const occupied = tables.filter(t => t.status === 'occupied').length
  const empty = tables.filter(t => t.status !== 'occupied').length

  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Stats */}
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

      {/* Add Table */}
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
            style={{ height: '52px', paddingInline: '20px', borderRadius: '14px', background: adding || !newCode.trim() ? 'var(--surface-3)' : 'var(--accent)', border: 'none', color: 'white', fontWeight: 700, fontSize: '14px', cursor: adding || !newCode.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0, fontFamily: 'inherit', transition: 'background 0.15s', boxShadow: newCode.trim() ? '0 4px 16px rgba(232,114,58,0.35)' : 'none' }}>
            {adding ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={16} strokeWidth={2.5} />}
            Tambah
          </button>
        </div>
      </section>

      {/* Table Grid */}
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
                  {/* Status dot */}
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOccupied ? 'var(--accent)' : 'var(--green)', boxShadow: isOccupied ? '0 0 6px var(--accent)' : '0 0 6px var(--green)' }} />

                  {/* Code */}
                  <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1 }}>{table.code}</p>

                  {/* Status label */}
                  <span style={{ fontSize: '10px', fontWeight: 600, color: isOccupied ? 'var(--accent)' : 'var(--green)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {isOccupied ? 'Terisi' : 'Kosong'}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', width: '100%' }}>
                    <a
                      href={`/api/qr/${table.code}`}
                      target="_blank"
                      style={{ flex: 1, height: '32px', borderRadius: '10px', background: 'var(--surface-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textDecoration: 'none' }}
                      title="QR Code">
                      <QrCode size={14} color="var(--text-muted)" strokeWidth={1.5} />
                    </a>
                    <button
                      onClick={() => deleteTable(table.id)}
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
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
