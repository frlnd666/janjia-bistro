export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}
export function calculateTax(subtotal: number): number { return Math.round(subtotal * 0.11) }
export function calculateTotal(subtotal: number): number { return subtotal + calculateTax(subtotal) }
export function formatTime(isoString: string): string {
  return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(isoString))
}
export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(isoString))
}
