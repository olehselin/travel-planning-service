import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Trip } from '@/types'

interface AccessPageHeaderProps {
  trip: Trip
  tripId: string
}

export const AccessPageHeader: React.FC<AccessPageHeaderProps> = ({
  trip,
  tripId
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/trips/${tripId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trip
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Manage Access</h1>
          <p className="text-muted-foreground">{trip.title}</p>
        </div>
      </div>
    </div>
  )
}
