import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JANJIA Bistro & Space',
  description: 'Pesan makanan langsung dari mejamu',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.svg' },
}

export const viewport: Viewport = {
  themeColor: '#0f0b07',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
