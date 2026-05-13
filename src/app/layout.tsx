import type { Metadata, Viewport } from 'next'
import './globals.css'
import InstallPrompt from '@/components/ui/InstallPrompt'

export const metadata: Metadata = {
  title: 'JANJIA Bistro & Space',
  description: 'Pesan makanan langsung dari mejamu',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#c4622d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}
        <InstallPrompt />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `
        }} />
      </body>
    </html>
  )
}
