import { createClient } from '@/lib/supabase/server'
import { MenuPageClient } from './MenuPageClient'
type Props = { params: Promise<{ table: string }>; searchParams: Promise<{ session?: string }> }
export default async function MenuPage({ params, searchParams }: Props) {
  const { table: tableCode } = await params
  const { session: sessionId } = await searchParams
  const supabase = await createClient()
  const [{ data: categories }, { data: menuItems }, { data: table }] = await Promise.all([
    supabase.from('menu_categories').select('*').order('sort_order'),
    supabase.from('menu_items').select('*').eq('available', true).order('sort_order'),
    supabase.from('tables').select('id, code').eq('code', tableCode.toUpperCase()).single(),
  ])
  return (
    <MenuPageClient
      categories={categories ?? []}
      menuItems={menuItems ?? []}
      tableCode={tableCode.toUpperCase()}
      tableId={table?.id ?? ''}
      sessionId={sessionId ?? ''}
    />
  )
}
