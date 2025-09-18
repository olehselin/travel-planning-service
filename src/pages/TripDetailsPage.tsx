import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useTripsStore } from '@/stores/tripsStore'
import { tripsService } from '@/services/tripsService'
import { hasPermission, getUserRoleInTrip, canAccessTrip } from '@/lib/permissions'
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin, 
  Users
} from 'lucide-react'
import { format } from 'date-fns'
import { Trip, TripUserRole } from '@/types'

// Допоміжна функція для безпечного форматування дат
const safeFormatDate = (dateString: string | undefined, fallback: string = 'Recently'): string => {
  if (!dateString) return fallback
  const date = new Date(dateString)
  if (date.toString() === 'Invalid Date') return fallback
  return format(date, 'MMMM dd, yyyy')
}

export const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { currentTrip, places, setCurrentTrip, setPlaces, setLoading } = useTripsStore()
  const [showCreatePlaceForm, setShowCreatePlaceForm] = useState(false)
  const [showEditTripForm, setShowEditTripForm] = useState(false)

  useEffect(() => {
    if (id && user) {
      loadTripDetails()
    }
  }, [id, user])

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
        navigate(`/trips/${id}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`, { replace: true })
      }
    }
  }, [searchParams, currentTrip, user, id, navigate])

  const loadTripDetails = async () => {
    if (!id || !user) return
    
    setLoading(true)
    const trip = await tripsService.getTrip(id, user.email)
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
    setLoading(false)
  }

  const handleDeleteTrip = async () => {
    if (!id || !currentTrip || !user) return
    
    if (currentTrip.ownerId !== user.uid) {
      alert('You can only delete your own trips')
      return
    }

    if (confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      const success = await tripsService.deleteTrip(id, user.uid)
      if (success) {
        navigate('/trips')
      } else {
        alert('Failed to delete trip')
      }
    }
  }

  const handleDeletePlace = async (placeId: string) => {
    if (!user || !currentTrip) return
    
    // Check permissions
    if (currentTrip.ownerId !== user.uid) {
      alert('You can only delete places from your own trips')
      return
    }

    if (confirm('Are you sure you want to delete this place?')) {
      const success = await tripsService.deletePlace(placeId, user.uid)
      if (success) {
        setPlaces(places.filter(p => p.id !== placeId))
      } else {
        alert('Failed to delete place')
      }
    }
  }

  if (!currentTrip) {
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
  const sortedPlaces = [...places].sort((a, b) => a.dayNumber - b.dayNumber)

  // Permission checks
  const canEditTrip = user ? hasPermission('trip.update', { user, trip: currentTrip, userRole }) : false
  const canDeleteTrip = user ? hasPermission('trip.delete', { user, trip: currentTrip, userRole }) : false
  const canManageAccess = user ? hasPermission('trip.invite', { user, trip: currentTrip, userRole }) : false
  const canAddPlace = user ? hasPermission('place.create', { user, trip: currentTrip, userRole }) : false
  const canEditPlace = user ? hasPermission('place.update', { user, trip: currentTrip, userRole }) : false
  const canDeletePlace = user ? hasPermission('place.delete', { user, trip: currentTrip, userRole }) : false

  // Debug logging
  console.log('TripDetailsPage Debug:', {
    user: user ? { uid: user.uid, email: user.email, role: user.role } : null,
    currentTrip: currentTrip ? { id: currentTrip.id, ownerId: currentTrip.ownerId, title: currentTrip.title } : null,
    userRole,
    canManageAccess,
    isOwner: currentTrip && user ? currentTrip.ownerId === user.uid : false
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/trips">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trips
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{currentTrip.title}</h1>
            {currentTrip.description && (
              <p className="text-muted-foreground">{currentTrip.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {(canManageAccess || (currentTrip && user && currentTrip.ownerId === user.uid)) && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/trips/${id}/access`}>
                <Users className="h-4 w-4 mr-2" />
                Manage Access
              </Link>
            </Button>
          )}
          {canEditTrip && (
            <Button variant="outline" size="sm" onClick={() => setShowEditTripForm(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Trip
            </Button>
          )}
          {canDeleteTrip && (
            <Button variant="destructive" size="sm" onClick={handleDeleteTrip}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Trip Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Trip Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentTrip.startDate && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                <p className="text-lg">{safeFormatDate(currentTrip.startDate)}</p>
              </div>
            )}
            {currentTrip.endDate && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">End Date</label>
                <p className="text-lg">{safeFormatDate(currentTrip.endDate)}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="text-lg">{safeFormatDate(currentTrip.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Places</label>
              <p className="text-lg">{places.length} locations</p>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {showCreatePlaceForm && (
        <CreatePlaceForm
          tripId={id!}
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

      <div className="space-y-4">
        {sortedPlaces.map((place) => (
          <Card key={place.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-medium">
                      Day {place.dayNumber}
                    </span>
                    <h3 className="text-lg font-semibold">{place.locationName}</h3>
                  </div>
                  {place.notes && (
                    <p className="text-muted-foreground">{place.notes}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {canEditPlace && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {canDeletePlace && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeletePlace(place.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {places.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No places added yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your itinerary by adding places to visit
            </p>
            <Button onClick={() => setShowCreatePlaceForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Place
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Create Place Form Component
interface CreatePlaceFormProps {
  tripId: string
  onClose: () => void
  onSuccess: () => void
}

const CreatePlaceForm: React.FC<CreatePlaceFormProps> = ({ tripId, onClose, onSuccess }) => {
  const { user } = useAuth()
  const [locationName, setLocationName] = useState('')
  const [notes, setNotes] = useState('')
  const [dayNumber, setDayNumber] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Early return if user is not authenticated
  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-destructive">You must be logged in to add a place.</p>
        </CardContent>
      </Card>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Створюємо об'єкт без undefined значень
    const placeData: any = {
      tripId,
      locationName,
      dayNumber
    }

    // Додаємо notes тільки якщо вони не пусті
    if (notes.trim()) {
      placeData.notes = notes
    }

    const placeId = await tripsService.createPlace(placeData)
    
    if (placeId) {
      onSuccess()
    } else {
      setError('Failed to create place')
    }
    
    setIsLoading(false)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Place</CardTitle>
        <CardDescription>
          Add a location to your trip itinerary
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location Name *</label>
            <Input
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Enter location name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Day Number *</label>
            <Input
              type="number"
              min="1"
              value={dayNumber}
              onChange={(e) => setDayNumber(parseInt(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this place"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Place'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Edit Trip Form Component
interface EditTripFormProps {
  trip: Trip
  onClose: () => void
  onSuccess: () => void
}

const EditTripForm: React.FC<EditTripFormProps> = ({ trip, onClose, onSuccess }) => {
  const { user } = useAuth()
  const [title, setTitle] = useState(trip.title)
  const [description, setDescription] = useState(trip.description || '')
  const [startDate, setStartDate] = useState(trip.startDate || '')
  const [endDate, setEndDate] = useState(trip.endDate || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [dateError, setDateError] = useState('')

  // Early return if user is not authenticated
  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-destructive">You must be logged in to edit a trip.</p>
        </CardContent>
      </Card>
    )
  }

  // Validate dates in real-time
  const validateDates = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setDateError('Дата початку повинна бути не пізніше дати завершення')
      return false
    }
    setDateError('')
    return true
  }

  // Check if form is valid (without side effects)
  const isFormValid = title.trim() && (startDate && endDate ? new Date(startDate) <= new Date(endDate) : true)

  // Validate dates when they change
  useEffect(() => {
    validateDates()
  }, [startDate, endDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) {
      setError('Будь ласка, виправте помилки в формі')
      return
    }

    setIsLoading(true)
    setError('')

    // Створюємо об'єкт без undefined значень
    const updates: any = {
      title
    }

    // Додаємо поля тільки якщо вони не пусті
    if (description.trim()) {
      updates.description = description
    }
    if (startDate) {
      updates.startDate = startDate
    }
    if (endDate) {
      updates.endDate = endDate
    }

    const success = await tripsService.updateTrip(trip.id, updates, user?.uid || '')
    
    if (success) {
      onSuccess()
    } else {
      setError('Failed to update trip')
    }
    
    setIsLoading(false)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Trip</CardTitle>
        <CardDescription>
          Update your trip information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter trip title"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your trip"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  validateDates()
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  validateDates()
                }}
              />
            </div>
          </div>

          {dateError && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {dateError}
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !isFormValid}>
              {isLoading ? 'Updating...' : 'Update Trip'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
