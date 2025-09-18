import { useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTripsStore } from '@/stores/tripsStore'
import { tripsService } from '@/services/tripsService'

export const useTrips = () => {
  const { user } = useAuth()
  const { trips, setTrips, setLoading, isLoading } = useTripsStore()

  const loadTrips = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const userTrips = await tripsService.getTrips(user.uid, user.email)
      setTrips(userTrips)
    } catch (error) {
      console.error('Error loading trips:', error)
    } finally {
      setLoading(false)
    }
  }, [user, setTrips, setLoading])

  return {
    trips,
    loadTrips,
    isLoading
  }
}
