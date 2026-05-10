import type { Metadata, Viewport } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'JANJIA Bistro & Space',
  description: 'Pesan makanan & minuman langsung dari mejamu',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'JANJIA' },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#3d2b1f' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
