'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OrderWithItems } from '@/types'
export function useOrders(statusFilter?: string[]) {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const supabase = createClient()
    async function fetchOrders() {
      let query = supabase.from('orders').select('*, tables(code), order_items(*, menu_items(name, image_url))').order('created_at', { ascending: false })
      if (statusFilter?.length) query = query.in('status', statusFilter)
      const { data } = await query
      if (data) setOrders(data as OrderWithItems[])
      setLoading(false)
    }
    fetchOrders()
    const channel = supabase.channel('orders-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchOrders()).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])
  return { orders, loading }
}
