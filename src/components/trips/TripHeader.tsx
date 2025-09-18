import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Trip } from '@/types'
import { ArrowLeft, Edit, Trash2, Users } from 'lucide-react'

interface TripHeaderProps {
  trip: Trip
  canEditTrip: boolean
  canDeleteTrip: boolean
  canManageAccess: boolean
  onEditTrip: () => void
  onDeleteTrip: () => void
}

export const TripHeader: React.FC<TripHeaderProps> = ({
  trip,
  canEditTrip,
  canDeleteTrip,
  canManageAccess,
  onEditTrip,
  onDeleteTrip
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/trips">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trips
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{trip.title}</h1>
          {trip.description && (
            <p className="text-muted-foreground">{trip.description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {canManageAccess && (
          <Button variant="outline" size="sm" asChild>
            <Link to={`/trips/${trip.id}/access`}>
              <Users className="h-4 w-4 mr-2" />
              Manage Access
            </Link>
          </Button>
        )}
        {canEditTrip && (
          <Button variant="outline" size="sm" onClick={onEditTrip}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Trip
          </Button>
        )}
        {canDeleteTrip && (
          <Button variant="destructive" size="sm" onClick={onDeleteTrip}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
