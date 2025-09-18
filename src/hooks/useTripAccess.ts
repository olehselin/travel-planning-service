import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTripsStore } from '@/stores/tripsStore'
import { tripsService } from '@/services/tripsService'

export const useTripAccess = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { currentTrip, tripAccess, setCurrentTrip, setTripAccess } = useTripsStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadTripAndAccess = useCallback(async () => {
    if (!id) return
    
    setIsLoading(true)
    try {
      const trip = await tripsService.getTrip(id, user?.email, user?.uid)
      if (trip) {
        setCurrentTrip(trip)
        const access = await tripsService.getTripAccess(id)
        setTripAccess(access)
      }
    } catch (error) {
      console.error('Error loading trip access:', error)
      setError('Failed to load trip access')
    } finally {
      setIsLoading(false)
    }
  }, [id, user, setCurrentTrip, setTripAccess])

  const handleInviteUser = useCallback(async (email: string): Promise<boolean> => {
    if (!id || !user || !currentTrip) return false

    // Check if user is owner
    if (currentTrip.ownerId !== user.uid) {
      setError('Only trip owners can invite collaborators')
      return false
    }

    // Check if inviting self
    if (email === user.email) {
      setError('You cannot invite yourself')
      return false
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await tripsService.sendInvite(id, email, user.uid)
      
      if (result.success) {
        setSuccess(result.message)
        // Reload trip access to show the new invitation
        await loadTripAndAccess()
        return true
      } else {
        setError(result.message)
        return false
      }
    } catch (error) {
      console.error('Error sending invite:', error)
      setError('Failed to send invitation. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [id, user, currentTrip, loadTripAndAccess])

  const handleReinvite = useCallback(async (email: string): Promise<boolean> => {
    if (!id || !user || !currentTrip) return false

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await tripsService.sendInvite(id, email, user.uid)
      
      if (result.success) {
        setSuccess(result.message)
        // Reload trip access to show the updated invitation
        await loadTripAndAccess()
        return true
      } else {
        setError(result.message)
        return false
      }
    } catch (error) {
      console.error('Error resending invite:', error)
      setError('Failed to resend invitation. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [id, user, currentTrip, loadTripAndAccess])

  const handleRevokeAccess = useCallback(async (accessId: string): Promise<boolean> => {
    if (!user || !currentTrip) return false
    
    if (currentTrip.ownerId !== user.uid) {
      setError('Only trip owners can revoke access')
      return false
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Find the access record to get the email
      const accessRecord = tripAccess.find(access => access.id === accessId)
      if (!accessRecord) {
        setError('Access record not found')
        return false
      }

      // Delete from database
      const success = await tripsService.deleteTripAccess(accessId)
      
      if (success) {
        // Update local state
        setTripAccess(tripAccess.filter(access => access.id !== accessId))
        setSuccess('Access revoked successfully')
        return true
      } else {
        setError('Failed to revoke access')
        return false
      }
    } catch (error) {
      console.error('Error revoking access:', error)
      setError('Failed to revoke access')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [user, currentTrip, tripAccess, setTripAccess])

  const clearMessages = useCallback(() => {
    setError('')
    setSuccess('')
  }, [])

  return {
    tripId: id,
    currentTrip,
    tripAccess,
    isLoading,
    error,
    success,
    loadTripAndAccess,
    handleInviteUser,
    handleReinvite,
    handleRevokeAccess,
    clearMessages
  }
}
