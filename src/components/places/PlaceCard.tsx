import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Place } from '@/types'
import { Edit, Trash2 } from 'lucide-react'

interface PlaceCardProps {
  place: Place
  canEdit: boolean
  canDelete: boolean
  onEdit: (place: Place) => void
  onDelete: (placeId: string) => void
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ 
  place, 
  canEdit, 
  canDelete, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card>
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
            {canEdit && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(place)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onDelete(place.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
