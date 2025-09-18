import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { tripsService } from '@/services/tripsService'
import { Trip, Invite } from '@/types'

export type InviteStatus = 'loading' | 'valid' | 'expired' | 'invalid' | 'accepted'

export const useInviteAcceptance = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [invite, setInvite] = useState<Invite | null>(null)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [status, setStatus] = useState<InviteStatus>('loading')

  const loadInviteDetails = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    setError('')

    try {
      const inviteData = await tripsService.getInviteByToken(token)
      
      if (!inviteData) {
        setStatus('invalid')
        setError('Invalid invitation link')
        setIsLoading(false)
        return
      }

      setInvite(inviteData)

      // Check if invite is expired
      if (new Date() > new Date(inviteData.expiresAt)) {
        setStatus('expired')
        setError('This invitation has expired')
        setIsLoading(false)
        return
      }

      // Load trip details
      const tripData = await tripsService.getTrip(inviteData.tripId)
      if (!tripData) {
        setStatus('invalid')
        setError('Trip not found')
        setIsLoading(false)
        return
      }

      setTrip(tripData)
      setStatus('valid')
    } catch (error) {
      console.error('Error loading invite details:', error)
      setStatus('invalid')
      setError('Failed to load invitation details')
    }

    setIsLoading(false)
  }, [token])

  const handleAcceptInvite = useCallback(async (): Promise<boolean> => {
    if (!token || !user || !invite) return false

    setIsAccepting(true)
    setError('')

    try {
      const success = await tripsService.acceptInvite(token, user.uid)
      
      if (success) {
        setStatus('accepted')
        setSuccess('You have successfully joined this trip!')
        
        // Redirect to trip details after 2 seconds
        setTimeout(() => {
          navigate(`/trips/${invite.tripId}`)
        }, 2000)
        return true
      } else {
        setError('Failed to accept invitation. Please try again.')
        return false
      }
    } catch (error) {
      console.error('Error accepting invite:', error)
      setError('Failed to accept invitation. Please try again.')
      return false
    } finally {
      setIsAccepting(false)
    }
  }, [token, user, invite, navigate])

  const clearMessages = useCallback(() => {
    setError('')
    setSuccess('')
  }, [])

  return {
    token,
    invite,
    trip,
    isLoading,
    isAccepting,
    error,
    success,
    status,
    loadInviteDetails,
    handleAcceptInvite,
    clearMessages
  }
}
