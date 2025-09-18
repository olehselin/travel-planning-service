import React from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, Plus } from 'lucide-react'

interface EmptyStateProps {
  searchTerm?: string
  onCreateTrip?: () => void
  canCreateTrip?: boolean
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  searchTerm, 
  onCreateTrip, 
  canCreateTrip = false 
}) => {
  return (
    <div className="text-center py-12">
      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No trips found</h3>
      <p className="text-muted-foreground mb-4">
        {searchTerm ? 'Try adjusting your search terms' : 'Start planning your first trip'}
      </p>
      {!searchTerm && canCreateTrip && onCreateTrip && (
        <Button onClick={onCreateTrip}>
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Trip
        </Button>
      )}
    </div>
  )
}
