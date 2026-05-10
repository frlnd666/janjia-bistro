import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
const PROTECTED = ['/admin', '/kitchen', '/waiter']
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })
  const isProtected = PROTECTED.some(r => request.nextUrl.pathname.startsWith(r))
  if (!isProtected) return response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(), setAll: (list) => { list.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) } } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))
  return response
}
export const config = { matcher: ['/admin/:path*', '/kitchen/:path*', '/waiter/:path*'] }
