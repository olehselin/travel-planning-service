import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Place } from '@/types'
import { PlaceCard } from './PlaceCard'
import { MapPin, Plus } from 'lucide-react'

interface PlacesListProps {
  places: Place[]
  canAddPlace: boolean
  canEditPlace: boolean
  canDeletePlace: boolean
  onAddPlace: () => void
  onEditPlace: (place: Place) => void
  onDeletePlace: (placeId: string) => void
}

export const PlacesList: React.FC<PlacesListProps> = ({
  places,
  canAddPlace,
  canEditPlace,
  canDeletePlace,
  onAddPlace,
  onEditPlace,
  onDeletePlace
}) => {
  const sortedPlaces = [...places].sort((a, b) => a.dayNumber - b.dayNumber)

  if (places.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No places added yet</h3>
          <p className="text-muted-foreground mb-4">
            Start building your itinerary by adding places to visit
          </p>
          {canAddPlace && (
            <Button onClick={onAddPlace}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Place
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sortedPlaces.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          canEdit={canEditPlace}
          canDelete={canDeletePlace}
          onEdit={onEditPlace}
          onDelete={onDeletePlace}
        />
      ))}
    </div>
  )
}
