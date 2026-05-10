'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
type Props = { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }
export function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/50 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed bottom-0 left-0 right-0 z-50 bg-[#faf7f2] rounded-t-2xl p-6 max-h-[90dvh] overflow-y-auto" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
            <div className="w-10 h-1 bg-[#e2d9cc] rounded-full mx-auto mb-4" />
            {title && <h2 className="text-lg font-semibold text-[#3d2b1f] mb-4">{title}</h2>}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
