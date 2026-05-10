import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'JANJIA Bistro & Space',
  description: 'Pesan makanan langsung dari mejamu',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
}

export const viewport: Viewport = {
  themeColor: '#c4622d',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
