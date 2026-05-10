import Link from 'next/link'
import { UtensilsCrossed, QrCode, Clock, MapPin, Star, ChevronRight, Wifi } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#1a1108] text-[#f5f0e8] flex flex-col">

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-16 pb-10 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#c4622d] opacity-10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo Mark */}
        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#c4622d] flex items-center justify-center mb-4 shadow-lg shadow-[#c4622d]/30">
            <UtensilsCrossed className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <p className="text-[#c4a882] text-xs font-medium tracking-[0.3em] uppercase mb-1">Selamat Datang di</p>
          <h1 className="text-4xl font-bold tracking-tight text-white text-center leading-tight">JANJIA</h1>
          <p className="text-[#c4a882] text-base tracking-widest mt-0.5">Bistro & Space</p>
        </div>

        {/* Tagline */}
        <p className="relative z-10 text-center text-[#c4a882] text-sm leading-relaxed max-w-xs mb-10">
          Nikmati pengalaman bersantap premium.<br />Pesan langsung dari mejamu, mudah & cepat.
        </p>

        {/* CTA Buttons */}
        <div className="relative z-10 w-full max-w-xs space-y-3">
          <Link href="/menu" className="flex items-center justify-between w-full bg-[#c4622d] hover:bg-[#b5521f] active:scale-95 text-white font-semibold py-4 px-5 rounded-2xl transition-all duration-200 shadow-lg shadow-[#c4622d]/30">
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="w-5 h-5" strokeWidth={1.5} />
              <span>Lihat Menu</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-70" />
          </Link>

          <Link href="/scan" className="flex items-center justify-between w-full bg-[#2a1f14] hover:bg-[#3a2a1a] active:scale-95 border border-[#3d2b1f] text-[#f5f0e8] font-semibold py-4 px-5 rounded-2xl transition-all duration-200">
            <div className="flex items-center gap-3">
              <QrCode className="w-5 h-5 text-[#c4a882]" strokeWidth={1.5} />
              <span>Scan QR Meja</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-40" />
          </Link>
        </div>
      </section>

      {/* Info Cards */}
      <section className="px-5 pb-6 grid grid-cols-3 gap-3 max-w-xs mx-auto w-full">
        {[
          { icon: Clock, label: 'Buka', value: '10:00 – 22:00' },
          { icon: Wifi, label: 'WiFi', value: 'Gratis' },
          { icon: Star, label: 'Rating', value: '4.9 / 5' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-[#2a1f14] border border-[#3d2b1f] rounded-2xl p-3 flex flex-col items-center gap-1.5">
            <Icon className="w-5 h-5 text-[#c4622d]" strokeWidth={1.5} />
            <p className="text-[#c4a882] text-[10px] font-medium uppercase tracking-wider">{label}</p>
            <p className="text-white text-[11px] font-semibold text-center leading-tight">{value}</p>
          </div>
        ))}
      </section>

      {/* How to Order */}
      <section className="px-5 pb-8 max-w-xs mx-auto w-full">
        <p className="text-[#c4a882] text-xs font-medium uppercase tracking-widest mb-4 text-center">Cara Memesan</p>
        <div className="space-y-3">
          {[
            { step: '01', icon: QrCode, text: 'Scan QR di meja kamu' },
            { step: '02', icon: UtensilsCrossed, text: 'Pilih menu favoritmu' },
            { step: '03', icon: Clock, text: 'Tunggu pesanan datang' },
            { step: '04', icon: MapPin, text: 'Bayar di kasir saat selesai' },
          ].map(({ step, icon: Icon, text }) => (
            <div key={step} className="flex items-center gap-4 bg-[#2a1f14] border border-[#3d2b1f] rounded-2xl px-4 py-3">
              <span className="text-[#c4622d] font-bold text-sm w-6 shrink-0">{step}</span>
              <Icon className="w-4 h-4 text-[#c4a882] shrink-0" strokeWidth={1.5} />
              <p className="text-[#f5f0e8] text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-5 pb-8 pt-4 border-t border-[#2a1f14] text-center">
        <p className="text-[#6b4c3b] text-xs">© 2026 JANJIA Bistro & Space</p>
        <Link href="/login" className="text-[#6b4c3b] text-xs hover:text-[#c4a882] transition-colors mt-1 inline-block">
          Staff Login
        </Link>
      </footer>

    </main>
  )
}
