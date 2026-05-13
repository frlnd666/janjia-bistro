'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useRef, useState } from 'react'
import {
  UtensilsCrossed,
  QrCode,
  Clock3,
  Wifi,
  Star,
  ChevronRight,
  ArrowRight,
  X,
  MapPin,
  Sparkles,
  Coffee,
  Armchair
} from 'lucide-react'

function HomeContent() {
  const params = useSearchParams()
  const router = useRouter()
  const tableId = params.get('table')
  const [showInput, setShowInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function goToMenu() {
    if (tableId) {
      router.push(`/table/${tableId}`)
    } else {
      setShowInput(true)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  function submitTable() {
    const code = inputRef.current?.value.trim().toUpperCase()
    if (code) router.push(`/table/${code}`)
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        color: 'var(--text-primary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-140px',
          right: '-120px',
          width: '360px',
          height: '360px',
          borderRadius: '999px',
          background: 'radial-gradient(circle, rgba(232,114,58,0.16) 0%, rgba(232,114,58,0.05) 42%, transparent 72%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '280px',
          left: '-120px',
          width: '280px',
          height: '280px',
          borderRadius: '999px',
          background: 'radial-gradient(circle, rgba(232,114,58,0.09) 0%, transparent 72%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <header
          style={{
            padding: '20px 20px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #e8723a, #c4521a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 14px 30px rgba(232,114,58,0.22)'
              }}
            >
              <UtensilsCrossed size={22} color="white" strokeWidth={1.8} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700 }}>
                JANJIA
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 800, letterSpacing: '-0.2px' }}>
                Bistro & Space
              </p>
            </div>
          </div>

          <Link
            href="/login"
            style={{
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '999px',
              padding: '10px 14px'
            }}
          >
            Staff Login
          </Link>
        </header>

        <main style={{ padding: '10px 20px 32px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <section
            style={{
              display: 'grid',
              gap: '18px'
            }}
          >
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.74) 0%, rgba(255,248,242,0.96) 100%)',
                border: '1px solid var(--border)',
                borderRadius: '30px',
                padding: '24px 20px 22px',
                boxShadow: '0 18px 60px rgba(40,24,16,0.06)',
                backdropFilter: 'blur(12px)'
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(232,114,58,0.10)',
                  color: 'var(--accent)',
                  border: '1px solid rgba(232,114,58,0.14)',
                  borderRadius: '999px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '16px'
                }}
              >
                <Sparkles size={13} strokeWidth={2} />
                Dining Experience
              </div>

              <h1
                style={{
                  fontSize: '42px',
                  lineHeight: 0.96,
                  letterSpacing: '-1.8px',
                  color: 'var(--text-primary)',
                  fontWeight: 900,
                  margin: 0
                }}
              >
                Taste,
                <br />
                Gather,
                <br />
                Enjoy.
              </h1>

              <p
                style={{
                  marginTop: '16px',
                  fontSize: '15px',
                  lineHeight: 1.75,
                  color: 'var(--text-secondary)',
                  maxWidth: '30rem'
                }}
              >
                JANJIA Bistro & Space menghadirkan tempat makan yang hangat, modern, dan nyaman untuk santai, bekerja, atau berkumpul bersama orang terdekat.
              </p>

              <div
                style={{
                  marginTop: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
                  <MapPin size={14} color="var(--accent)" strokeWidth={1.8} />
                  Serang, Banten
                </div>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-strong)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
                  <Star size={14} color="var(--accent)" strokeWidth={1.8} />
                  Premium dining vibes
                </div>
              </div>

              <div
                style={{
                  marginTop: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <button
                  onClick={goToMenu}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--accent)',
                    borderRadius: '18px',
                    padding: '18px 20px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '0 10px 30px rgba(232,114,58,0.28)',
                    width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.18)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <UtensilsCrossed size={18} color="white" strokeWidth={1.8} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontSize: '16px', fontWeight: 800, color: 'white', lineHeight: 1 }}>Lihat Menu</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.76)', marginTop: '3px' }}>
                        {tableId ? `Meja ${tableId}` : 'Buka menu digital Janjia'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={20} color="white" strokeWidth={2.2} />
                </button>

                {showInput && !tableId && (
                  <div
                    style={{
                      background: 'var(--surface-2)',
                      borderRadius: '20px',
                      border: '1px solid var(--border-strong)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Masukkan Kode Meja</p>
                      <button onClick={() => setShowInput(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                        <X size={16} color="var(--text-muted)" />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        ref={inputRef}
                        placeholder="Contoh: A1, B2..."
                        maxLength={10}
                        onKeyDown={e => e.key === 'Enter' && submitTable()}
                        style={{
                          flex: 1,
                          background: 'var(--surface-3)',
                          border: '1px solid var(--border)',
                          borderRadius: '13px',
                          padding: '12px 14px',
                          fontSize: '15px',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          fontFamily: 'inherit',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      />
                      <button
                        onClick={submitTable}
                        style={{
                          height: '46px',
                          paddingInline: '16px',
                          borderRadius: '13px',
                          background: 'var(--accent)',
                          border: 'none',
                          color: 'white',
                          fontWeight: 800,
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          flexShrink: 0
                        }}
                      >
                        Masuk
                      </button>
                    </div>

                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Atau langsung scan QR code di meja kamu.</p>
                  </div>
                )}

                <Link
                  href="/scan"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--surface-2)',
                    borderRadius: '18px',
                    padding: '18px 20px',
                    border: '1px solid var(--border-strong)',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        background: 'var(--surface-3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <QrCode size={18} color="var(--text-secondary)" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>Scan QR</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>Masuk cepat ke meja dan mulai pesan</p>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" strokeWidth={1.7} />
                </Link>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}
            >
              <div
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '24px',
                  padding: '16px',
                  minHeight: '148px'
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'rgba(232,114,58,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <Coffee size={18} color="var(--accent)" strokeWidth={1.8} />
                </div>
                <p style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '8px' }}>Curated Menu</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Pilihan menu yang cocok untuk santai, meeting, dan quality time.
                </p>
              </div>

              <div
                style={{
                  background: 'linear-gradient(180deg, rgba(232,114,58,0.12), rgba(232,114,58,0.06))',
                  border: '1px solid rgba(232,114,58,0.14)',
                  borderRadius: '24px',
                  padding: '16px',
                  minHeight: '148px'
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <Armchair size={18} color="var(--accent)" strokeWidth={1.8} />
                </div>
                <p style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '8px' }}>Warm Space</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Suasana nyaman dengan sentuhan modern untuk kerja dan berkumpul.
                </p>
              </div>
            </div>
          </section>

          <section
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: '30px',
              padding: '20px',
              boxShadow: '0 16px 40px rgba(40,24,16,0.04)'
            }}
          >
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '10px' }}>
              About Janjia
            </p>
            <h2 style={{ fontSize: '26px', lineHeight: 1.08, letterSpacing: '-1px', color: 'var(--text-primary)', fontWeight: 900, margin: 0 }}>
              Tempat makan yang terasa hangat, tenang, dan tetap berkelas.
            </h2>
            <p style={{ marginTop: '12px', fontSize: '14px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              Kami merancang pengalaman makan yang sederhana namun berkesan — dari ambience, pelayanan, hingga menu yang nyaman dinikmati kapan saja.
            </p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
              {[{ icon: Clock3, label: '10:00 – 22:00' }, { icon: Wifi, label: 'WiFi Gratis' }, { icon: Star, label: '4.9 / 5' }].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    background: 'var(--surface-2)',
                    borderRadius: '999px',
                    border: '1px solid var(--border)',
                    padding: '9px 14px'
                  }}
                >
                  <Icon size={13} color="var(--accent)" strokeWidth={1.8} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section
            style={{
              background: 'linear-gradient(180deg, rgba(232,114,58,0.10), rgba(255,248,242,0.88))',
              border: '1px solid rgba(232,114,58,0.14)',
              borderRadius: '30px',
              padding: '22px 20px'
            }}
          >
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Quick Start
            </p>
            <h2 style={{ fontSize: '24px', lineHeight: 1.1, letterSpacing: '-0.9px', color: 'var(--text-primary)', fontWeight: 900, margin: 0 }}>
              Duduk, scan, lalu pesan tanpa ribet.
            </h2>
            <p style={{ marginTop: '12px', fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
              Kalau sudah ada di meja, cukup scan QR atau masukkan kode meja untuk langsung membuka menu digital Janjia.
            </p>

            <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
              {[
                'Scan QR di meja kamu.',
                'Atau masukkan kode meja secara manual.',
                'Pilih menu favorit dan kirim pesanan langsung.'
              ].map(step => (
                <div
                  key={step}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(232,114,58,0.12)',
                    borderRadius: '18px',
                    padding: '14px 14px'
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '999px',
                      background: 'var(--accent)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 800,
                      flexShrink: 0
                    }}
                  >
                    •
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{step}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer style={{ padding: '0 20px 22px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>© 2026 JANJIA Bistro & Space</p>
        </footer>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100dvh', background: 'var(--bg)' }} />}>
      <HomeContent />
    </Suspense>
  )
}
