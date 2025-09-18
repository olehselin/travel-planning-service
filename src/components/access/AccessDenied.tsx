import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface AccessDeniedProps {
  tripId: string
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ tripId }) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
      <p className="text-muted-foreground mb-4">
        Only trip owners can manage access to this trip.
      </p>
      <Button asChild>
        <Link to={`/trips/${tripId}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Trip
        </Link>
      </Button>
    </div>
  )
}
