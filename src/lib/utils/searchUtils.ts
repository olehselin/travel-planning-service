import { Trip } from '@/types'

// Фільтрація поїздок за пошуковим запитом
export const filterTrips = (trips: Trip[], searchTerm: string): Trip[] => {
  if (!searchTerm.trim()) return trips
  const term = searchTerm.toLowerCase()
  return trips.filter(trip =>
    trip.title.toLowerCase().includes(term) ||
    (trip.description && trip.description.toLowerCase().includes(term))
  )
}

// Сортування поїздок
export const sortTrips = (trips: Trip[], sortBy: 'title' | 'date' | 'created' = 'created'): Trip[] => {
  return [...trips].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'date':
        const aDate = a.startDate ? new Date(a.startDate).getTime() : 0
        const bDate = b.startDate ? new Date(b.startDate).getTime() : 0
        return bDate - aDate
      case 'created':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })
}
