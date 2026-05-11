import QRCode from 'qrcode'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const menuUrl = `https://janjia-bistro.vercel.app/menu/${encodeURIComponent(code)}`

  try {
    const svg = await QRCode.toString(menuUrl, {
      type: 'svg',
      width: 512,
      margin: 1,
      color: {
        dark: '#111111',
        light: '#FFFFFF',
      },
    })

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to generate QR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
