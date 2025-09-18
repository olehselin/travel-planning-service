import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trip } from '@/types'
import { safeFormatDate } from '@/lib/utils/dateUtils'
import { Calendar } from 'lucide-react'

interface TripInfoProps {
  trip: Trip
  placesCount: number
}

export const TripInfo: React.FC<TripInfoProps> = ({ trip, placesCount }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Trip Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trip.startDate && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Start Date</label>
              <p className="text-lg">{safeFormatDate(trip.startDate)}</p>
            </div>
          )}
          {trip.endDate && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">End Date</label>
              <p className="text-lg">{safeFormatDate(trip.endDate)}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Created</label>
            <p className="text-lg">{safeFormatDate(trip.createdAt)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Places</label>
            <p className="text-lg">{placesCount} locations</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
