import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
type Props = { params: Promise<{ code: string }> }
export default async function TableEntryPage({ params }: Props) {
  const { code } = await params
  const supabase = await createClient()
  const { data: table } = await supabase.from('tables').select('id, code, status').eq('code', code.toUpperCase()).single()
  if (!table) redirect('/?error=table_not_found')
  const { data: session } = await supabase.from('sessions').select('id').eq('table_id', table.id).is('ended_at', null).order('started_at', { ascending: false }).limit(1).single()
  if (session) {
    redirect(`/menu/${table.code}?session=${session.id}`)
  } else {
    const { data: newSession } = await supabase.from('sessions').insert({ table_id: table.id }).select('id').single()
    if (!newSession) redirect('/?error=session_failed')
    redirect(`/menu/${table.code}?session=${newSession.id}`)
  }
}
