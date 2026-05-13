'use client'

import Link from 'next/link'
import Image from 'next/image'
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
           // SESUDAH — ganti dengan ini:
<Image
  src="/logo.png"
  alt="JANJIA Logo"
  width={46}
  height={46}
  priority
  style={{
    borderRadius: '16px',
    objectFit: 'contain',
    boxShadow: '0 14px 30px rgba(232,114,58,0.22)'
  }}
/>
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
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 18px 60px rgba(40,24,16,0.10)',
                minHeight: '520px',
                background: '#1a120d'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: "url('/images/about-janjia.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.82,
                  transform: 'scale(1.03)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(20,14,10,0.22) 0%, rgba(20,14,10,0.38) 36%, rgba(20,14,10,0.78) 100%)'
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: '24px 20px 22px',
                  minHeight: '520px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255,255,255,0.14)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.16)',
                      borderRadius: '999px',
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '16px',
                      backdropFilter: 'blur(8px)'
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
                      color: 'white',
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
                      color: 'rgba(255,255,255,0.86)',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.76)', fontSize: '12px', fontWeight: 600 }}>
                      <MapPin size={14} color="#ffd6c3" strokeWidth={1.8} />
                      Serang, Banten
                    </div>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.35)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.76)', fontSize: '12px', fontWeight: 600 }}>
                      <Star size={14} color="#ffd6c3" strokeWidth={1.8} />
                      Premium dining vibes
                    </div>
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
                      boxShadow: '0 10px 30px rgba(232,114,58,0.32)',
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
                        background: 'rgba(255,255,255,0.14)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.16)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>Masukkan Kode Meja</p>
                        <button onClick={() => setShowInput(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                          <X size={16} color="rgba(255,255,255,0.72)" />
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
                            background: 'rgba(255,255,255,0.16)',
                            border: '1px solid rgba(255,255,255,0.16)',
                            borderRadius: '13px',
                            padding: '12px 14px',
                            fontSize: '15px',
                            color: 'white',
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

                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.74)' }}>Atau langsung scan QR code di meja kamu.</p>
                    </div>
                  )}

                  <Link
                    href="/scan"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(255,255,255,0.14)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '18px',
                      padding: '18px 20px',
                      border: '1px solid rgba(255,255,255,0.16)',
                      textDecoration: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <QrCode size={18} color="white" strokeWidth={1.8} />
                      </div>
                      <div>
                        <p style={{ fontSize: '16px', fontWeight: 700, color: 'white', lineHeight: 1 }}>Scan QR</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.74)', marginTop: '3px' }}>Masuk cepat ke meja dan mulai pesan</p>
                      </div>
                    </div>
                    <ChevronRight size={18} color="rgba(255,255,255,0.74)" strokeWidth={1.7} />
                  </Link>
                </div>
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
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Gallery
              </p>
              <h2 style={{ fontSize: '24px', lineHeight: 1.08, letterSpacing: '-0.8px', color: 'var(--text-primary)', fontWeight: 900, margin: 0 }}>
                Sudut hangat dari Janjia.
              </h2>
              <p style={{ marginTop: '10px', fontSize: '14px', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: '32rem' }}>
                Beberapa potret suasana, meja, dan ambience yang membuat pengalaman makan di Janjia terasa lebih dekat dan nyaman.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}
            >
              {[
                { src: '/images/janjia1.jpg', title: 'Dining Corner', height: '210px' },
                { src: '/images/janjia2.jpg', title: 'Table Setup', height: '160px' },
                { src: '/images/janjia3.jpg', title: 'Warm Ambience', height: '160px' },
                { src: '/images/janjia4.jpg', title: 'Janjia Moments', height: '210px' }
              ].map((photo) => (
                <div
                  key={photo.title}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '24px',
                    height: photo.height,
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 14px 30px rgba(40,24,16,0.06)'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url('${photo.src}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transform: 'scale(1.03)'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(20,14,10,0.06) 0%, rgba(20,14,10,0.55) 100%)'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: '12px',
                      right: '12px',
                      bottom: '12px'
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '8px 10px',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.14)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.14)'
                      }}
                    >
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'white', letterSpacing: '0.04em' }}>
                        {photo.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '30px',
              minHeight: '280px',
              backgroundImage: "linear-gradient(180deg, rgba(232,114,58,0.08) 0%, rgba(25,16,12,0.82) 100%), url('/images/quick-start.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid rgba(232,114,58,0.14)'
            }}
          >
            <div
              style={{
                padding: '22px 20px',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}
            >
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.74)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Quick Start
              </p>
              <h2 style={{ fontSize: '24px', lineHeight: 1.1, letterSpacing: '-0.9px', color: 'white', fontWeight: 900, margin: 0, maxWidth: '290px' }}>
                Duduk, scan, lalu pesan tanpa ribet.
              </h2>
              <p style={{ marginTop: '12px', fontSize: '14px', lineHeight: 1.75, color: 'rgba(255,255,255,0.82)', maxWidth: '310px' }}>
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
                      background: 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.10)',
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
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'white' }}>{step}</p>
                  </div>
                ))}
              </div>
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
