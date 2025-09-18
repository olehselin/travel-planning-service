import { User, Trip, TripUserRole } from '@/types'

export type Permission = 
  | 'trip.create'
  | 'trip.read'
  | 'trip.update'
  | 'trip.delete'
  | 'trip.invite'
  | 'place.create'
  | 'place.read'
  | 'place.update'
  | 'place.delete'

export interface PermissionContext {
  user: User | null
  trip?: Trip
  userRole?: TripUserRole
}

/**
 * Check if user has permission for a specific action
 */
export function hasPermission(
  permission: Permission,
  context: PermissionContext
): boolean {
  const { user } = context

  if (!user) {
    return false
  }

  // User role permissions
  switch (user.role) {
    case 'User':
      return hasUserPermission(permission, context)
    case 'Owner':
      return hasOwnerPermission(permission, context)
    case 'Collaborator':
      return hasCollaboratorPermission(permission, context)
    default:
      return false
  }
}

/**
 * User role permissions (basic user without special access)
 */
function hasUserPermission(permission: Permission, _context: PermissionContext): boolean {
  // const { trip } = context

  switch (permission) {
    case 'trip.create':
      return true // Users can create their own trips
    case 'trip.read':
      return false // Users can't see trips they don't own or aren't invited to
    case 'trip.update':
    case 'trip.delete':
    case 'trip.invite':
      return false // Users can't modify trips they don't own
    case 'place.create':
    case 'place.read':
    case 'place.update':
    case 'place.delete':
      return false // Users can't access places in trips they don't have access to
    default:
      return false
  }
}

/**
 * Owner role permissions (trip owner)
 */
function hasOwnerPermission(permission: Permission, context: PermissionContext): boolean {
  const { user, trip } = context

  // Owner can do everything with their own trips
  if (trip && trip.ownerId === user?.uid) {
    return true
  }

  // For trips where user is not owner, check trip-specific role
  if (trip && trip.ownerId !== user?.uid) {
    return hasTripSpecificPermission(permission, context)
  }

  // For general permissions (no specific trip context)
  switch (permission) {
    case 'trip.create':
      return true
    default:
      return false
  }
}

/**
 * Collaborator role permissions (user with collaborator role)
 */
function hasCollaboratorPermission(permission: Permission, context: PermissionContext): boolean {
  const { trip } = context

  // If user has collaborator role globally, check trip-specific permissions
  if (trip) {
    return hasTripSpecificPermission(permission, context)
  }

  // For general permissions (no specific trip context)
  switch (permission) {
    case 'trip.create':
      return true // Collaborators can create their own trips
    default:
      return false
  }
}

/**
 * Trip-specific permissions based on user's role in that trip
 */
function hasTripSpecificPermission(permission: Permission, context: PermissionContext): boolean {
  const { user, trip, userRole } = context

  if (!trip || !user) {
    return false
  }

  // If user is the owner of this trip
  if (trip.ownerId === user.uid) {
    return true // Owner can do everything
  }

  // If user is a collaborator in this trip
  if (userRole === 'Collaborator') {
    switch (permission) {
      case 'trip.read':
        return true
      case 'place.create':
      case 'place.read':
      case 'place.update':
      case 'place.delete':
        return true // Collaborators can manage places
      case 'trip.update':
      case 'trip.delete':
      case 'trip.invite':
        return false // Collaborators can't modify trip or invite others
      default:
        return false
    }
  }

  return false
}

/**
 * Get user's role in a specific trip
 */
export function getUserRoleInTrip(user: User, trip: Trip): TripUserRole | undefined {
  if (trip.ownerId === user.uid) {
    return 'Owner'
  }
  
  // In a real app, you would check the tripAccess collection here
  // For now, we'll use the userRole from the trip object
  return trip.userRole
}

/**
 * Check if user can access a trip
 */
export function canAccessTrip(user: User, trip: Trip): boolean {
  const userRole = getUserRoleInTrip(user, trip)
  return userRole !== undefined
}
