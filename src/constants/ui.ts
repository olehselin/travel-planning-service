import { TripUserRole, TripAccessStatus } from '@/types'

// Стилі для бейджів ролей
export const ROLE_BADGE_STYLES: Record<TripUserRole, string> = {
  Owner: 'bg-blue-100 text-blue-800',
  Collaborator: 'bg-green-100 text-green-800'
} as const

// Стилі для статусів запрошень
export const INVITE_STATUS_STYLES: Record<TripAccessStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800'
} as const

// Стилі для статусів запрошень з іконками
export const INVITE_STATUS_CONFIG = {
  pending: {
    style: 'bg-yellow-100 text-yellow-800',
    icon: 'Clock',
    text: 'Pending'
  },
  accepted: {
    style: 'bg-green-100 text-green-800',
    icon: 'CheckCircle',
    text: 'Accepted'
  },
  declined: {
    style: 'bg-red-100 text-red-800',
    icon: 'XCircle',
    text: 'Declined'
  }
} as const

// Розміри для сітки поїздок
export const GRID_LAYOUTS = {
  trips: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
  places: 'grid gap-4 md:grid-cols-2 lg:grid-cols-3',
  access: 'grid gap-4 md:grid-cols-1 lg:grid-cols-2'
} as const
