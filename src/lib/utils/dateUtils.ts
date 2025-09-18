import { format } from 'date-fns'

// Допоміжна функція для безпечного форматування дат
export const safeFormatDate = (dateString: string | undefined, fallback: string = 'Recently'): string => {
  if (!dateString) return fallback
  const date = new Date(dateString)
  if (date.toString() === 'Invalid Date') return fallback
  return format(date, 'MMM dd, yyyy')
}

// Довгий формат дати
export const safeFormatDateLong = (dateString: string | undefined, fallback: string = 'Recently'): string => {
  if (!dateString) return fallback
  const date = new Date(dateString)
  if (date.toString() === 'Invalid Date') return fallback
  return format(date, 'MMMM dd, yyyy')
}

// Валідація діапазону дат (перенесено в formUtils для уникнення конфліктів)

// Перевірка чи дата в минулому
export const isDateInPast = (dateString: string): boolean => {
  const date = new Date(dateString)
  return date < new Date()
}

// Перевірка чи дата в майбутньому
export const isDateInFuture = (dateString: string): boolean => {
  const date = new Date(dateString)
  return date > new Date()
}
