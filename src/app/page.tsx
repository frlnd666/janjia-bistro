import Link from 'next/link'
export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#3d2b1f] text-[#f5f0e8] flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        <p className="text-xs text-[#e07a45] tracking-widest uppercase font-medium mb-4">Selamat Datang di</p>
        <h1 className="font-display text-5xl font-semibold leading-tight mb-2">JANJIA</h1>
        <p className="text-[#c4a882] text-lg font-light mb-8">Bistro & Space</p>
        <p className="text-[#e2d9cc] text-sm max-w-xs leading-relaxed mb-12">Nikmati pengalaman bersantap yang nyaman. Pesan langsung dari mejamu, cukup scan QR code.</p>
        <div className="w-16 h-px bg-[#6b4c3b] mb-12" />
        <div className="bg-[#f5f0e8] text-[#3d2b1f] rounded-2xl p-6 w-full max-w-xs">
          <p className="text-sm font-semibold mb-2">Cara memesan</p>
          <ol className="text-sm text-[#6b4c3b] space-y-2 text-left">
            <li className="flex gap-2"><span className="text-[#c4622d] font-bold">1.</span> Scan QR di mejamu</li>
            <li className="flex gap-2"><span className="text-[#c4622d] font-bold">2.</span> Pilih menu kesukaanmu</li>
            <li className="flex gap-2"><span className="text-[#c4622d] font-bold">3.</span> Pesan & tunggu sajian</li>
            <li className="flex gap-2"><span className="text-[#c4622d] font-bold">4.</span> Bayar di kasir saat selesai</li>
          </ol>
        </div>
      </section>
      <footer className="px-6 py-6 text-center border-t border-[#2a1e15]">
        <p className="text-xs text-[#6b4c3b]">© 2026 JANJIA Bistro & Space</p>
        <Link href="/login" className="text-xs text-[#6b4c3b] mt-1 block">Staff Login</Link>
      </footer>
    </div>
  )
}
