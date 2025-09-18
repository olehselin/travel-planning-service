import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { hasPermission, getUserRoleInTrip } from '@/lib/permissions'
import { useTripDetails } from '@/hooks/useTripDetails'
import { TripHeader } from '@/components/trips/TripHeader'
import { TripInfo } from '@/components/trips/TripInfo'
import { EditTripForm } from '@/components/trips/EditTripForm'
import { PlacesList } from '@/components/places/PlacesList'
import { PlaceForm } from '@/components/places/PlaceForm'
import { Plus, MapPin } from 'lucide-react'
import { TripUserRole, Place } from '@/types'

export const TripDetailsPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { tripId, currentTrip, places, isLoading, loadTripDetails, handleDeleteTrip, handleDeletePlace } = useTripDetails()
  const [showCreatePlaceForm, setShowCreatePlaceForm] = useState(false)
  const [showEditTripForm, setShowEditTripForm] = useState(false)
  const [editingPlace, setEditingPlace] = useState<Place | null>(null)

  useEffect(() => {
    if (tripId && user) {
      loadTripDetails()
    }
  }, [tripId, user, loadTripDetails])

  // Auto-open edit form if edit=true in URL
  useEffect(() => {
    if (searchParams.get('edit') === 'true' && currentTrip && user) {
      // Check if user can edit this trip
      const userRole = getUserRoleInTrip(user, currentTrip)
      if (userRole === 'Owner') {
        setShowEditTripForm(true)
        // Remove the edit parameter from URL
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.delete('edit')
        // Note: navigate logic moved to useTripDetails hook
      }
    }
  }, [searchParams, currentTrip, user])

  const handleEditPlace = (place: Place) => {
    setEditingPlace(place)
  }

  if (isLoading || !currentTrip) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading trip details...</p>
        </div>
      </div>
    )
  }

  const userRole: TripUserRole | undefined = user ? getUserRoleInTrip(user, currentTrip) : undefined

  // Permission checks
  const canEditTrip = user ? hasPermission('trip.update', { user, trip: currentTrip, userRole }) : false
  const canDeleteTrip = user ? hasPermission('trip.delete', { user, trip: currentTrip, userRole }) : false
  const canManageAccess = user ? hasPermission('trip.invite', { user, trip: currentTrip, userRole }) : false
  const canAddPlace = user ? hasPermission('place.create', { user, trip: currentTrip, userRole }) : false
  const canEditPlace = user ? hasPermission('place.update', { user, trip: currentTrip, userRole }) : false
  const canDeletePlace = user ? hasPermission('place.delete', { user, trip: currentTrip, userRole }) : false

  return (
    <div className="space-y-6">
      {/* Trip Header */}
      <TripHeader
        trip={currentTrip}
        canEditTrip={canEditTrip}
        canDeleteTrip={canDeleteTrip}
        canManageAccess={canManageAccess || !!(currentTrip && user && currentTrip.ownerId === user.uid)}
        onEditTrip={() => setShowEditTripForm(true)}
        onDeleteTrip={handleDeleteTrip}
      />

      {/* Trip Info */}
      <TripInfo trip={currentTrip} placesCount={places.length} />

      {/* Places Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <MapPin className="h-6 w-6 mr-2" />
          Places ({places.length})
        </h2>
        {canAddPlace && (
          <Button onClick={() => setShowCreatePlaceForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Place
          </Button>
        )}
      </div>

      {/* Forms */}
      {showCreatePlaceForm && (
        <PlaceForm
          tripId={tripId!}
          onClose={() => setShowCreatePlaceForm(false)}
          onSuccess={() => {
            setShowCreatePlaceForm(false)
            loadTripDetails()
          }}
        />
      )}

      {showEditTripForm && (
        <EditTripForm
          trip={currentTrip}
          onClose={() => setShowEditTripForm(false)}
          onSuccess={() => {
            setShowEditTripForm(false)
            loadTripDetails()
          }}
        />
      )}

      {editingPlace && (
        <PlaceForm
          tripId={tripId!}
          place={editingPlace}
          onClose={() => setEditingPlace(null)}
          onSuccess={() => {
            setEditingPlace(null)
            loadTripDetails()
          }}
        />
      )}

      {/* Places List */}
      <PlacesList
        places={places}
        canAddPlace={canAddPlace}
        canEditPlace={canEditPlace}
        canDeletePlace={canDeletePlace}
        onAddPlace={() => setShowCreatePlaceForm(true)}
        onEditPlace={handleEditPlace}
        onDeletePlace={handleDeletePlace}
      />
    </div>
  )
}
