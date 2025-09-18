import { create } from 'zustand'
import { Trip, Place, TripAccess } from '@/types'

interface TripsState {
  trips: Trip[]
  currentTrip: Trip | null
  places: Place[]
  tripAccess: TripAccess[]
  isLoading: boolean
  setTrips: (trips: Trip[]) => void
  setCurrentTrip: (trip: Trip | null) => void
  setPlaces: (places: Place[]) => void
  setTripAccess: (access: TripAccess[]) => void
  setLoading: (loading: boolean) => void
  addTrip: (trip: Trip) => void
  updateTrip: (trip: Trip) => void
  removeTrip: (tripId: string) => void
  addPlace: (place: Place) => void
  updatePlace: (place: Place) => void
  removePlace: (placeId: string) => void
  addTripAccess: (access: TripAccess) => void
  updateTripAccess: (access: TripAccess) => void
  clearState: () => void
}

export const useTripsStore = create<TripsState>((set) => ({
  trips: [],
  currentTrip: null,
  places: [],
  tripAccess: [],
  isLoading: false,
  setTrips: (trips) => set({ trips }),
  setCurrentTrip: (currentTrip) => set({ currentTrip }),
  setPlaces: (places) => set({ places }),
  setTripAccess: (tripAccess) => set({ tripAccess }),
  setLoading: (isLoading) => set({ isLoading }),
  addTrip: (trip) => set((state) => ({ trips: [...state.trips, trip] })),
  updateTrip: (trip) => set((state) => ({
    trips: state.trips.map(t => t.id === trip.id ? trip : t),
    currentTrip: state.currentTrip?.id === trip.id ? trip : state.currentTrip
  })),
  removeTrip: (tripId) => set((state) => ({
    trips: state.trips.filter(t => t.id !== tripId),
    currentTrip: state.currentTrip?.id === tripId ? null : state.currentTrip
  })),
  addPlace: (place) => set((state) => ({ places: [...state.places, place] })),
  updatePlace: (place) => set((state) => ({
    places: state.places.map(p => p.id === place.id ? place : p)
  })),
  removePlace: (placeId) => set((state) => ({
    places: state.places.filter(p => p.id !== placeId)
  })),
  addTripAccess: (access) => set((state) => ({ tripAccess: [...state.tripAccess, access] })),
  updateTripAccess: (access) => set((state) => ({
    tripAccess: state.tripAccess.map(a => a.id === access.id ? access : a)
  })),
  clearState: () => set({
    trips: [],
    currentTrip: null,
    places: [],
    tripAccess: [],
    isLoading: false
  }),
}))
