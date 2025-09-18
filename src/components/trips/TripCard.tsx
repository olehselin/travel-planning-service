import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trip } from '@/types'
import { safeFormatDate } from '@/lib/utils/dateUtils'
import { Calendar, MapPin } from 'lucide-react'

interface TripCardProps {
  trip: Trip
  onEdit?: () => void
}

const TripRoleBadge: React.FC<{ role?: string }> = ({ role }) => {
  if (!role) return null
  
  const getBadgeStyle = (role: string) => {
    switch (role) {
      case 'Owner':
        return 'bg-blue-100 text-blue-800'
      case 'Collaborator':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyle(role)}`}>
      {role}
    </span>
  )
}

const TripDescription: React.FC<{ description?: string }> = ({ description }) => {
  return (
    <div className="min-h-[1.5rem]">
      {description ? (
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      ) : (
        <div className="h-6"></div>
      )}
    </div>
  )
}

const TripDates: React.FC<{ startDate?: string; endDate?: string }> = ({ startDate, endDate }) => {
  if (!startDate) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center text-sm text-muted-foreground">
        <Calendar className="h-4 w-4 mr-2" />
        {safeFormatDate(startDate)}
        {endDate && (
          <>
            <span className="mx-2">-</span>
            {safeFormatDate(endDate)}
          </>
        )}
      </div>
    </div>
  )
}

const TripActions: React.FC<{ trip: Trip; onEdit?: () => void }> = ({ trip, onEdit }) => {
  return (
    <div className="flex justify-between items-center pt-4 mt-auto">
      <span className="text-xs text-muted-foreground">
        Created {safeFormatDate(trip.createdAt)}
      </span>
      <div className="flex space-x-2">
        <Button asChild size="sm" variant="outline">
          <Link to={`/trips/${trip.id}`}>View Details</Link>
        </Button>
        {trip.userRole === 'Owner' && onEdit && (
          <Button asChild size="sm">
            <Link to={`/trips/${trip.id}?edit=true`}>Edit</Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onEdit }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{trip.title}</span>
          <div className="flex items-center space-x-2">
            <TripRoleBadge role={trip.userRole} />
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardTitle>
        <TripDescription description={trip.description} />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <TripDates startDate={trip.startDate} endDate={trip.endDate} />
        <TripActions trip={trip} onEdit={onEdit} />
      </CardContent>
    </Card>
  )
}
