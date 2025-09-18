import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useTripsStore } from '@/stores/tripsStore'
import { tripsService } from '@/services/tripsService'
import { hasPermission } from '@/lib/permissions'
import { Plus, Search, Calendar, MapPin } from 'lucide-react'
import { format } from 'date-fns'

// Допоміжна функція для безпечного форматування дат
const safeFormatDate = (dateString: string | undefined, fallback: string = 'Recently'): string => {
  if (!dateString) return fallback
  const date = new Date(dateString)
  if (date.toString() === 'Invalid Date') return fallback
  return format(date, 'MMM dd, yyyy')
}

export const TripsPage: React.FC = () => {
  const { user } = useAuth()
  const { trips, setTrips, setLoading } = useTripsStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    if (user) {
      loadTrips()
    }
  }, [user])

  const loadTrips = async () => {
    if (!user) return
    
    setLoading(true)
    const userTrips = await tripsService.getTrips(user.uid, user.email)
    setTrips(userTrips)
    setLoading(false)
  }

  const filteredTrips = trips.filter(trip =>
    trip.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Check if user can create trips
  const canCreateTrip = user ? hasPermission('trip.create', { user }) : false

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground">
            Manage and organize your travel plans
          </p>
        </div>
        {canCreateTrip && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Trip
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {showCreateForm && (
        <CreateTripForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false)
            loadTrips()
          }}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{trip.title}</span>
                <div className="flex items-center space-x-2">
                  {trip.userRole && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trip.userRole === 'Owner' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {trip.userRole}
                    </span>
                  )}
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardTitle>
              {trip.description && (
                <CardDescription className="line-clamp-2">
                  {trip.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {trip.startDate && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {safeFormatDate(trip.startDate)}
                    {trip.endDate && (
                      <>
                        <span className="mx-2">-</span>
                        {safeFormatDate(trip.endDate)}
                      </>
                    )}
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-muted-foreground">
                    Created {safeFormatDate(trip.createdAt)}
                  </span>
                  <Button asChild size="sm">
                    <Link to={`/trips/${trip.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No trips found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Start planning your first trip'}
          </p>
          {!searchTerm && canCreateTrip && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Trip
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Create Trip Form Component
interface CreateTripFormProps {
  onClose: () => void
  onSuccess: () => void
}

const CreateTripForm: React.FC<CreateTripFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [dateError, setDateError] = useState('')

  // Early return if user is not authenticated
  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-destructive">You must be logged in to create a trip.</p>
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
    if (!user) return

    if (!isFormValid) {
      setError('Будь ласка, виправте помилки в формі')
      return
    }

    setIsLoading(true)
    setError('')

    // Створюємо об'єкт без undefined значень
    const tripData: any = {
      title,
      ownerId: user.uid
    }

    // Додаємо поля тільки якщо вони не пусті
    if (description.trim()) {
      tripData.description = description
    }
    if (startDate) {
      tripData.startDate = startDate
    }
    if (endDate) {
      tripData.endDate = endDate
    }

    const tripId = await tripsService.createTrip(tripData)
    
    if (tripId) {
      onSuccess()
    } else {
      setError('Failed to create trip')
    }
    
    setIsLoading(false)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Trip</CardTitle>
        <CardDescription>
          Plan your next adventure with a new trip
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
              {isLoading ? 'Creating...' : 'Create Trip'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
