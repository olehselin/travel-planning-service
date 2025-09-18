import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Trip, Place, TripAccess } from '@/types'

export const tripsService = {
  // Trips
  async getTrips(userId: string): Promise<Trip[]> {
    try {
      const tripsQuery = query(
        collection(db, 'trips'),
        where('ownerId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(tripsQuery)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trip))
    } catch (error) {
      console.error('Error fetching trips:', error)
      return []
    }
  },

  async getTrip(tripId: string): Promise<Trip | null> {
    try {
      const docRef = doc(db, 'trips', tripId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Trip
      }
      return null
    } catch (error) {
      console.error('Error fetching trip:', error)
      return null
    }
  },

  async createTrip(trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'trips'), {
        ...trip,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating trip:', error)
      return null
    }
  },

  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<boolean> {
    try {
      const docRef = doc(db, 'trips', tripId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      return true
    } catch (error) {
      console.error('Error updating trip:', error)
      return false
    }
  },

  async deleteTrip(tripId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'trips', tripId))
      return true
    } catch (error) {
      console.error('Error deleting trip:', error)
      return false
    }
  },

  // Places
  async getPlaces(tripId: string): Promise<Place[]> {
    try {
      const placesQuery = query(
        collection(db, 'places'),
        where('tripId', '==', tripId),
        orderBy('dayNumber', 'asc')
      )
      const snapshot = await getDocs(placesQuery)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Place))
    } catch (error) {
      console.error('Error fetching places:', error)
      return []
    }
  },

  async createPlace(place: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'places'), {
        ...place,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating place:', error)
      return null
    }
  },

  async updatePlace(placeId: string, updates: Partial<Place>): Promise<boolean> {
    try {
      const docRef = doc(db, 'places', placeId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      return true
    } catch (error) {
      console.error('Error updating place:', error)
      return false
    }
  },

  async deletePlace(placeId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'places', placeId))
      return true
    } catch (error) {
      console.error('Error deleting place:', error)
      return false
    }
  },

  // Trip Access
  async getTripAccess(tripId: string): Promise<TripAccess[]> {
    try {
      const accessQuery = query(
        collection(db, 'tripAccess'),
        where('tripId', '==', tripId)
      )
      const snapshot = await getDocs(accessQuery)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TripAccess))
    } catch (error) {
      console.error('Error fetching trip access:', error)
      return []
    }
  },

  async createTripAccess(access: Omit<TripAccess, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'tripAccess'), access)
      return docRef.id
    } catch (error) {
      console.error('Error creating trip access:', error)
      return null
    }
  },

  async updateTripAccess(accessId: string, updates: Partial<TripAccess>): Promise<boolean> {
    try {
      const docRef = doc(db, 'tripAccess', accessId)
      await updateDoc(docRef, updates)
      return true
    } catch (error) {
      console.error('Error updating trip access:', error)
      return false
    }
  }
}
