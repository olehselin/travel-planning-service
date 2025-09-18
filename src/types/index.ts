export interface User {
  uid: string
  email: string
  displayName?: string
  role: 'User' | 'Owner' | 'Collaborator'
}

export type UserRole = 'User' | 'Owner' | 'Collaborator'
export type TripUserRole = 'Owner' | 'Collaborator'

export interface Trip {
  id: string
  title: string
  description?: string
  startDate?: string
  endDate?: string
  ownerId: string
  createdAt: string
  updatedAt: string
  userRole?: TripUserRole
}

export interface Place {
  id: string
  tripId: string
  locationName: string
  notes?: string
  dayNumber: number
  createdAt: string
  updatedAt: string
}

export interface TripAccess {
  id: string
  tripId: string
  email: string
  role: 'Collaborator'
  status: 'pending' | 'accepted' | 'declined'
  invitedBy: string
  invitedAt: string
  acceptedAt?: string
}

export interface Invite {
  id: string
  tripId: string
  email: string
  token: string
  expiresAt: string
  createdAt: string
}

export type TripAccessStatus = 'pending' | 'accepted' | 'declined'

// Re-export form types
export * from './forms'