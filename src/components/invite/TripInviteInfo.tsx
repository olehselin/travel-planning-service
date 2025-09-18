import React from 'react'
import { Calendar, Mail } from 'lucide-react'
import { format } from 'date-fns'
import { Trip, Invite } from '@/types'

interface TripInviteInfoProps {
  trip: Trip
  invite: Invite
}

export const TripInviteInfo: React.FC<TripInviteInfoProps> = ({ trip, invite }) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
        {trip.description && (
          <p className="text-muted-foreground">{trip.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trip.startDate && (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Start Date</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(trip.startDate), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        )}
        {trip.endDate && (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">End Date</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(trip.endDate), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Invited as</p>
          <p className="text-sm text-muted-foreground">
            {invite.email} (Collaborator)
          </p>
        </div>
      </div>
    </div>
  )
}
