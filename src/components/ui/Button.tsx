import { ButtonHTMLAttributes } from 'react'
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; fullWidth?: boolean; loading?: boolean }
const variants: Record<Variant, string> = {
  primary:   'bg-[#c4622d] text-white active:bg-[#a0501f] disabled:opacity-50',
  secondary: 'bg-[#3d2b1f] text-[#f5f0e8] active:bg-[#2a1e15] disabled:opacity-50',
  ghost:     'bg-transparent border border-[#c4622d] text-[#c4622d] active:bg-[#c4622d]/10',
  danger:    'bg-red-600 text-white active:bg-red-700 disabled:opacity-50',
}
export function Button({ variant = 'primary', fullWidth = false, loading = false, children, className = '', disabled, ...props }: Props) {
  return (
    <button disabled={disabled || loading} className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 min-h-[44px] ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
      {children}
    </button>
  )
}
