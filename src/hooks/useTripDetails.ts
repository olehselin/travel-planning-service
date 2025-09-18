import { useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTripsStore } from '@/stores/tripsStore'
import { tripsService } from '@/services/tripsService'
import { canAccessTrip } from '@/lib/permissions'

export const useTripDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentTrip, places, setCurrentTrip, setPlaces, setLoading, isLoading } = useTripsStore()

  const loadTripDetails = useCallback(async () => {
    if (!id || !user) return
    
    setLoading(true)
    try {
      const trip = await tripsService.getTrip(id, user.email, user.uid)
      if (trip) {
        // Check if user has access to this trip
        if (!canAccessTrip(user, trip)) {
          navigate('/trips')
          return
        }
        
        setCurrentTrip(trip)
        const tripPlaces = await tripsService.getPlaces(id)
        setPlaces(tripPlaces)
      } else {
        navigate('/trips')
      }
    } catch (error) {
      console.error('Error loading trip details:', error)
      navigate('/trips')
    } finally {
      setLoading(false)
    }
  }, [id, user, setCurrentTrip, setPlaces, setLoading, navigate])

  const handleDeleteTrip = useCallback(async () => {
    if (!id || !currentTrip || !user) return
    
    if (currentTrip.ownerId !== user.uid) {
      alert('You can only delete your own trips')
      return
    }

    if (confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      try {
        const success = await tripsService.deleteTrip(id, user.uid)
        if (success) {
          navigate('/trips')
        } else {
          alert('Failed to delete trip')
        }
      } catch (error) {
        console.error('Error deleting trip:', error)
        alert('Failed to delete trip')
      }
    }
  }, [id, currentTrip, user, navigate])

  const handleDeletePlace = useCallback(async (placeId: string) => {
    if (!user || !currentTrip) return

    if (confirm('Are you sure you want to delete this place?')) {
      try {
        const success = await tripsService.deletePlace(placeId, user.uid, user.email)
        if (success) {
          setPlaces(places.filter(p => p.id !== placeId))
        } else {
          alert('Failed to delete place')
        }
      } catch (error) {
        console.error('Error deleting place:', error)
        alert('Failed to delete place')
      }
    }
  }, [user, currentTrip, places, setPlaces])

  return {
    tripId: id,
    currentTrip,
    places,
    isLoading,
    loadTripDetails,
    handleDeleteTrip,
    handleDeletePlace
  }
}
