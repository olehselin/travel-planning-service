// Валідація email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Валідація паролю
export const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

// Валідація обов'язкових полів
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}

// Валідація назви поїздки
export const validateTripTitle = (title: string): boolean => {
  return title.trim().length >= 3 && title.trim().length <= 100
}

// Валідація діапазону дат
export const validateDateRange = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return true
  return new Date(startDate) <= new Date(endDate)
}

// Очищення об'єкта від undefined значень
export const cleanObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const cleaned: Partial<T> = {}
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key as keyof T] = value
    }
  })
  return cleaned
}
