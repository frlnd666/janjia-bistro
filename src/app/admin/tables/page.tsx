'use client'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'react-qr-code'
import { createClient } from '@/lib/supabase/client'
import { Table } from '@/types'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [newCode, setNewCode] = useState('')
  const [adding, setAdding] = useState(false)
  const [qrModal, setQrModal] = useState<Table | null>(null)

  async function fetchTables() {
    const supabase = createClient()
    const { data } = await supabase.from('tables').select('*').order('code')
    setTables(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchTables() }, [])

  async function addTable() {
    if (!newCode.trim()) return
    setAdding(true)
    const supabase = createClient()
    await supabase.from('tables').insert({ code: newCode.trim().toUpperCase(), status: 'available' })
    setNewCode('')
    await fetchTables()
    setAdding(false)
  }

  async function deleteTable(id: string) {
    if (!confirm('Hapus meja ini?')) return
    const supabase = createClient()
    await supabase.from('tables').delete().eq('id', id)
    await fetchTables()
  }

  function downloadQR(code: string) {
    const svg = document.getElementById(`qr-${code}`)
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = 300; canvas.height = 300
    const ctx = canvas.getContext('2d')!
    const img = new window.Image()
    img.onload = () => { ctx.fillStyle = 'white'; ctx.fillRect(0,0,300,300); ctx.drawImage(img,0,0,300,300); const a = document.createElement('a'); a.download = `QR-Meja-${code}.png`; a.href = canvas.toDataURL('image/png'); a.click() }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="px-4 py-5">
      <p className="text-xs text-[#c4a882] font-medium uppercase tracking-widest mb-4">Kelola Meja</p>
      <div className="flex gap-2 mb-5">
        <input value={newCode} onChange={e => setNewCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTable()} placeholder="Kode meja (A1, B2...)" className="flex-1 border border-[#e2d9cc] rounded-xl px-3 py-2.5 text-sm text-[#3d2b1f] bg-white focus:outline-none focus:border-[#c4622d] min-h-[44px]" />
        <Button loading={adding} onClick={addTable}>Tambah</Button>
      </div>
      {loading ? (
        <div className="grid grid-cols-3 gap-3">{[1,2,3,4,5,6].map(i => <div key={i} className="h-24 bg-[#e2d9cc] rounded-2xl animate-pulse" />)}</div>
      ) : tables.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🪑</p>
          <p className="text-[#6b4c3b] text-sm">Belum ada meja</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {tables.map((table, i) => (
            <motion.div key={table.id} className="bg-white rounded-2xl border border-[#e2d9cc] p-3 text-center"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${table.status === 'occupied' ? 'bg-[#c4622d]' : 'bg-[#5c6b3a]'}`} />
              <p className="font-bold text-[#3d2b1f] text-lg">{table.code}</p>
              <p className={`text-[10px] font-medium mb-3 ${table.status === 'occupied' ? 'text-[#c4622d]' : 'text-[#5c6b3a]'}`}>
                {table.status === 'occupied' ? 'Terisi' : 'Kosong'}
              </p>
              <div className="flex gap-1">
                <button onClick={() => setQrModal(table)} className="flex-1 text-[10px] bg-[#3d2b1f] text-[#f5f0e8] py-1.5 rounded-lg min-h-[28px]">QR</button>
                <button onClick={() => deleteTable(table.id)} className="flex-1 text-[10px] text-red-500 border border-red-200 py-1.5 rounded-lg min-h-[28px]">Hapus</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={!!qrModal} onClose={() => setQrModal(null)} title={`QR Meja ${qrModal?.code}`}>
        {qrModal && (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#e2d9cc]">
              <QRCode id={`qr-${qrModal.code}`} value={`${APP_URL}/table/${qrModal.code}`} size={200} />
            </div>
            <p className="text-xs text-[#6b4c3b] text-center break-all">{APP_URL}/table/{qrModal.code}</p>
            <Button fullWidth onClick={() => downloadQR(qrModal.code)}>⬇️ Download QR PNG</Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
