'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError('Email atau password salah'); setLoading(false); return }
    router.push('/admin')
  }
  return (
    <div className="min-h-dvh bg-[#3d2b1f] flex flex-col items-center justify-center px-6">
      <motion.div className="w-full max-w-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-[#f5f0e8] font-semibold">JANJIA</h1>
          <p className="text-[#c4a882] text-sm mt-1">Bistro & Space — Staff Portal</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-[#c4a882] font-medium block mb-1.5">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="email@janjia.id" className="w-full bg-[#2a1e15] border border-[#6b4c3b] text-[#f5f0e8] rounded-xl px-4 py-3 text-sm placeholder:text-[#6b4c3b] focus:outline-none focus:border-[#c4622d] min-h-[44px]" />
          </div>
          <div>
            <label className="text-xs text-[#c4a882] font-medium block mb-1.5">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-[#2a1e15] border border-[#6b4c3b] text-[#f5f0e8] rounded-xl px-4 py-3 text-sm placeholder:text-[#6b4c3b] focus:outline-none focus:border-[#c4622d] min-h-[44px]" />
          </div>
          {error && <p className="text-sm text-red-400 bg-red-900/30 rounded-xl px-4 py-3">{error}</p>}
          <Button fullWidth loading={loading} type="submit" className="mt-2">Masuk</Button>
        </form>
      </motion.div>
    </div>
  )
}
