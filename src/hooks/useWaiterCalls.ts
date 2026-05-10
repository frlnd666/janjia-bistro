'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WaiterCallWithTable } from '@/types'
export function useWaiterCalls() {
  const [calls, setCalls] = useState<WaiterCallWithTable[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const supabase = createClient()
    async function fetchCalls() {
      const { data } = await supabase.from('waiter_calls').select('*, tables(code)').eq('status', 'pending').order('created_at', { ascending: true })
      if (data) setCalls(data as WaiterCallWithTable[])
      setLoading(false)
    }
    fetchCalls()
    const channel = supabase.channel('waiter-calls-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'waiter_calls' }, () => fetchCalls()).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])
  return { calls, loading }
}
