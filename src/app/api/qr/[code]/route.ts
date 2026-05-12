import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function GET(
  _req: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code: rawCode = 'UNKNOWN' } = await context.params
    const code = rawCode.toUpperCase()
    const menuUrl = `https://janjia-bistro.vercel.app/menu/${encodeURIComponent(code)}`

    const qrSvg = await QRCode.toString(menuUrl, {
      type: 'svg',
      width: 320,
      margin: 1,
      color: {
        dark: '#111111',
        light: '#FFFFFF',
      },
    })

    const match = qrSvg.match(/viewBox="([^"]+)"/)
    const viewBox = match ? match[1].split(' ').map(Number) : [0, 0, 41, 41]
    const vbWidth = viewBox[2] || 41
    const vbHeight = viewBox[3] || 41

    const qrInner = qrSvg
      .replace(/<?xml.*??>/g, '')
      .replace(/<!DOCTYPE.*?>/g, '')
      .replace(/<svg[^>]*>/, '')
      .replace('</svg>', '')

    const finalSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="420" viewBox="0 0 360 420" fill="none">
  <rect width="360" height="420" rx="28" fill="#FFFFFF"/>
  <rect x="20" y="20" width="320" height="380" rx="24" fill="#FFFFFF" stroke="#E5E7EB"/>
  <text x="180" y="52" text-anchor="middle" font-size="16" font-family="Arial, sans-serif" font-weight="700" fill="#111111">
    Janjia Bistro
  </text>
  <text x="180" y="76" text-anchor="middle" font-size="22" font-family="Arial, sans-serif" font-weight="800" fill="#111111">
    Meja ${escapeXml(code)}
  </text>
  <g transform="translate(20, 96)">
    <rect width="320" height="320" rx="20" fill="#FFFFFF"/>
    <g transform="translate(0, 0) scale(${320 / vbWidth} ${320 / vbHeight})">
      ${qrInner}
    </g>
  </g>
  <text x="180" y="392" text-anchor="middle" font-size="13" font-family="Arial, sans-serif" font-weight="600" fill="#6B7280">
    Scan untuk buka menu
  </text>
</svg>`.trim()

    return new NextResponse(finalSvg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal generate QR code' },
      { status: 500 }
    )
  }
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
