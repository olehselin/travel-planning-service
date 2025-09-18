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
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Trip, Place, TripAccess, Invite } from '@/types'
import { emailService } from './emailService'
import { freeEmailService } from './freeEmailService'

export const tripsService = {
  // Trips
  async getTrips(userId: string, userEmail?: string): Promise<Trip[]> {
    try {
      // Get trips where user is owner
      const ownedTripsQuery = query(
        collection(db, 'trips'),
        where('ownerId', '==', userId)
      )
      const ownedSnapshot = await getDocs(ownedTripsQuery)
      const ownedTrips = ownedSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        userRole: 'Owner' as const
      } as Trip & { userRole: 'Owner' | 'Collaborator' }))
      
      // Sort by createdAt in memory
      ownedTrips.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      // Get trips where user is collaborator (if userEmail is provided)
      let collaboratorTrips: (Trip & { userRole: 'Owner' | 'Collaborator' })[] = []
      if (userEmail) {
        const accessQuery = query(
          collection(db, 'tripAccess'),
          where('email', '==', userEmail),
          where('status', '==', 'accepted')
        )
        const accessSnapshot = await getDocs(accessQuery)
        const collaboratorTripIds = accessSnapshot.docs.map(doc => doc.data().tripId)
        
        if (collaboratorTripIds.length > 0) {
          // Get individual trip documents since Firestore doesn't support 'in' with orderBy
          const tripPromises = collaboratorTripIds.map(async (tripId) => {
            const tripDoc = await getDoc(doc(db, 'trips', tripId))
            if (tripDoc.exists()) {
              return { 
                id: tripDoc.id, 
                ...tripDoc.data(),
                userRole: 'Collaborator' as const
              } as Trip & { userRole: 'Owner' | 'Collaborator' }
            }
            return null
          })
          
          const tripResults = await Promise.all(tripPromises)
          collaboratorTrips = tripResults.filter(trip => trip !== null) as (Trip & { userRole: 'Owner' | 'Collaborator' })[]
        }
      }

      const allTrips = [...ownedTrips, ...collaboratorTrips]
      console.log('Fetched trips:', allTrips)
      return allTrips
    } catch (error) {
      console.error('Error fetching trips:', error)
      return []
    }
  },

  async getTrip(tripId: string, userEmail?: string, userId?: string): Promise<Trip | null> {
    try {
      const docRef = doc(db, 'trips', tripId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const tripData = { id: docSnap.id, ...docSnap.data() } as Trip
        
        // Check if user is the owner
        if (userId && tripData.ownerId === userId) {
          tripData.userRole = 'Owner'
        }
        // If userEmail is provided, check if user is a collaborator
        else if (userEmail) {
          const accessQuery = query(
            collection(db, 'tripAccess'),
            where('tripId', '==', tripId),
            where('email', '==', userEmail),
            where('status', '==', 'accepted')
          )
          const accessSnapshot = await getDocs(accessQuery)
          if (!accessSnapshot.empty) {
            tripData.userRole = 'Collaborator'
          }
        }
        
        return tripData
      }
      return null
    } catch (error) {
      console.error('Error fetching trip:', error)
      return null
    }
  },

  async createTrip(trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      // Фільтруємо undefined значення
      const cleanTrip = Object.fromEntries(
        Object.entries(trip).filter(([_, value]) => value !== undefined && value !== null)
      )
      
      console.log('Original trip data:', trip)
      console.log('Cleaned trip data:', cleanTrip)
      
      const docRef = await addDoc(collection(db, 'trips'), {
        ...cleanTrip,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating trip:', error)
      return null
    }
  },

  async updateTrip(tripId: string, updates: Partial<Trip>, userId: string): Promise<boolean> {
    try {
      // Check if user is the owner of the trip
      const tripDoc = await getDoc(doc(db, 'trips', tripId))
      if (!tripDoc.exists()) {
        console.error('Trip not found')
        return false
      }
      
      const tripData = tripDoc.data() as Trip
      if (tripData.ownerId !== userId) {
        console.error('User is not the owner of this trip')
        return false
      }
      
      // Фільтруємо undefined значення
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
      )
      
      const docRef = doc(db, 'trips', tripId)
      await updateDoc(docRef, {
        ...cleanUpdates,
        updatedAt: serverTimestamp()
      })
      return true
    } catch (error) {
      console.error('Error updating trip:', error)
      return false
    }
  },

  async deleteTrip(tripId: string, userId: string): Promise<boolean> {
    try {
      // Check if user is the owner of the trip
      const tripDoc = await getDoc(doc(db, 'trips', tripId))
      if (!tripDoc.exists()) {
        console.error('Trip not found')
        return false
      }
      
      const tripData = tripDoc.data() as Trip
      if (tripData.ownerId !== userId) {
        console.error('User is not the owner of this trip')
        return false
      }
      
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
      // First get all places for the trip, then sort in memory
      const placesQuery = query(
        collection(db, 'places'),
        where('tripId', '==', tripId)
      )
      const snapshot = await getDocs(placesQuery)
      const places = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Place))
      
      // Sort by dayNumber in memory
      return places.sort((a, b) => a.dayNumber - b.dayNumber)
    } catch (error) {
      console.error('Error fetching places:', error)
      return []
    }
  },

  async createPlace(place: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>, userId: string, userEmail?: string): Promise<string | null> {
    try {
      // Check if user has access to the trip
      const tripDoc = await getDoc(doc(db, 'trips', place.tripId))
      if (!tripDoc.exists()) {
        console.error('Trip not found')
        return null
      }
      
      const tripData = tripDoc.data() as Trip
      
      // Check if user is the owner of the trip
      if (tripData.ownerId === userId) {
        // Фільтруємо undefined значення
        const cleanPlace = Object.fromEntries(
          Object.entries(place).filter(([_, value]) => value !== undefined && value !== null)
        )
        
        const docRef = await addDoc(collection(db, 'places'), {
          ...cleanPlace,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
        return docRef.id
      }
      
      // Check if user is a collaborator (if userEmail is provided)
      if (userEmail) {
        const accessQuery = query(
          collection(db, 'tripAccess'),
          where('tripId', '==', place.tripId),
          where('email', '==', userEmail),
          where('status', '==', 'accepted')
        )
        const accessSnapshot = await getDocs(accessQuery)
        if (!accessSnapshot.empty) {
          // Фільтруємо undefined значення
          const cleanPlace = Object.fromEntries(
            Object.entries(place).filter(([_, value]) => value !== undefined && value !== null)
          )
          
          const docRef = await addDoc(collection(db, 'places'), {
            ...cleanPlace,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
          return docRef.id
        }
      }
      
      console.error('User does not have permission to create places in this trip')
      return null
    } catch (error) {
      console.error('Error creating place:', error)
      return null
    }
  },

  async updatePlace(placeId: string, updates: Partial<Place>, userId: string, userEmail?: string): Promise<boolean> {
    try {
      // Check if place exists
      const placeDoc = await getDoc(doc(db, 'places', placeId))
      if (!placeDoc.exists()) {
        console.error('Place not found')
        return false
      }
      
      const placeData = placeDoc.data() as Place
      const tripDoc = await getDoc(doc(db, 'trips', placeData.tripId))
      if (!tripDoc.exists()) {
        console.error('Trip not found')
        return false
      }
      
      const tripData = tripDoc.data() as Trip
      
      // Check if user is the owner of the trip
      if (tripData.ownerId === userId) {
        // Фільтруємо undefined значення
        const cleanUpdates = Object.fromEntries(
          Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
        )
        
        const docRef = doc(db, 'places', placeId)
        await updateDoc(docRef, {
          ...cleanUpdates,
          updatedAt: serverTimestamp()
        })
        return true
      }
      
      // Check if user is a collaborator (if userEmail is provided)
      if (userEmail) {
        const accessQuery = query(
          collection(db, 'tripAccess'),
          where('tripId', '==', placeData.tripId),
          where('email', '==', userEmail),
          where('status', '==', 'accepted')
        )
        const accessSnapshot = await getDocs(accessQuery)
        if (!accessSnapshot.empty) {
          // Фільтруємо undefined значення
          const cleanUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
          )
          
          const docRef = doc(db, 'places', placeId)
          await updateDoc(docRef, {
            ...cleanUpdates,
            updatedAt: serverTimestamp()
          })
          return true
        }
      }
      
      console.error('User does not have permission to update this place')
      return false
    } catch (error) {
      console.error('Error updating place:', error)
      return false
    }
  },

  async deletePlace(placeId: string, userId: string, userEmail?: string): Promise<boolean> {
    try {
      // Check if place exists
      const placeDoc = await getDoc(doc(db, 'places', placeId))
      if (!placeDoc.exists()) {
        console.error('Place not found')
        return false
      }
      
      const placeData = placeDoc.data() as Place
      const tripDoc = await getDoc(doc(db, 'trips', placeData.tripId))
      if (!tripDoc.exists()) {
        console.error('Trip not found')
        return false
      }
      
      const tripData = tripDoc.data() as Trip
      
      // Check if user is the owner of the trip
      if (tripData.ownerId === userId) {
        await deleteDoc(doc(db, 'places', placeId))
        return true
      }
      
      // Check if user is a collaborator (if userEmail is provided)
      if (userEmail) {
        const accessQuery = query(
          collection(db, 'tripAccess'),
          where('tripId', '==', placeData.tripId),
          where('email', '==', userEmail),
          where('status', '==', 'accepted')
        )
        const accessSnapshot = await getDocs(accessQuery)
        if (!accessSnapshot.empty) {
          await deleteDoc(doc(db, 'places', placeId))
          return true
        }
      }
      
      console.error('User does not have permission to delete this place')
      return false
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
      // Фільтруємо undefined значення
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
      )
      
      const docRef = doc(db, 'tripAccess', accessId)
      await updateDoc(docRef, cleanUpdates)
      return true
    } catch (error) {
      console.error('Error updating trip access:', error)
      return false
    }
  },

  async deleteTripAccess(accessId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'tripAccess', accessId))
      return true
    } catch (error) {
      console.error('Error deleting trip access:', error)
      return false
    }
  },

  // Invites
  async createInvite(invite: Omit<Invite, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'invites'), invite)
      return docRef.id
    } catch (error) {
      console.error('Error creating invite:', error)
      return null
    }
  },

  async getInviteByToken(token: string): Promise<Invite | null> {
    try {
      const inviteQuery = query(
        collection(db, 'invites'),
        where('token', '==', token)
      )
      const snapshot = await getDocs(inviteQuery)
      if (snapshot.empty) return null
      
      const inviteDoc = snapshot.docs[0]
      return { id: inviteDoc.id, ...inviteDoc.data() } as Invite
    } catch (error) {
      console.error('Error fetching invite by token:', error)
      return null
    }
  },

  async acceptInvite(token: string, userId: string): Promise<boolean> {
    try {
      // Get invite by token
      const invite = await this.getInviteByToken(token)
      if (!invite) {
        console.error('Invite not found')
        return false
      }

      // Check if invite is expired
      if (new Date() > new Date(invite.expiresAt)) {
        console.error('Invite has expired')
        return false
      }

      // Check if user already has access
      const existingAccess = await this.getTripAccessByEmail(invite.tripId, invite.email)
      if (existingAccess && existingAccess.status === 'accepted') {
        console.error('User already has access to this trip')
        return false
      }

      // Create or update trip access
      if (existingAccess) {
        await this.updateTripAccess(existingAccess.id, {
          status: 'accepted',
          acceptedAt: new Date().toISOString()
        })
      } else {
        await this.createTripAccess({
          tripId: invite.tripId,
          email: invite.email,
          role: 'Collaborator',
          status: 'accepted',
          invitedBy: userId, // Use the current user ID
          invitedAt: invite.createdAt,
          acceptedAt: new Date().toISOString()
        })
      }

      // Send welcome email
      const trip = await this.getTrip(invite.tripId)
      if (trip) {
        const tripUrl = `${window.location.origin}/trips/${invite.tripId}`
        await emailService.sendWelcomeEmail({
          to: invite.email,
          tripTitle: trip.title,
          tripUrl
        })
      }

      // Delete the invite after successful acceptance
      await deleteDoc(doc(db, 'invites', invite.id))
      return true
    } catch (error) {
      console.error('Error accepting invite:', error)
      return false
    }
  },

  async getTripAccessByEmail(tripId: string, email: string): Promise<TripAccess | null> {
    try {
      const accessQuery = query(
        collection(db, 'tripAccess'),
        where('tripId', '==', tripId),
        where('email', '==', email)
      )
      const snapshot = await getDocs(accessQuery)
      if (snapshot.empty) return null
      
      const accessDoc = snapshot.docs[0]
      return { id: accessDoc.id, ...accessDoc.data() } as TripAccess
    } catch (error) {
      console.error('Error fetching trip access by email:', error)
      return null
    }
  },

  async sendInvite(tripId: string, email: string, invitedBy: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if user is already invited (any status)
      const existingAccess = await this.getTripAccessByEmail(tripId, email)
      if (existingAccess) {
        if (existingAccess.status === 'pending') {
          return { success: false, message: 'This user has already been invited to this trip' }
        } else if (existingAccess.status === 'accepted') {
          return { success: false, message: 'This user already has access to this trip' }
        } else if (existingAccess.status === 'declined') {
          // Allow re-inviting declined users by deleting the old record
          await this.deleteTripAccess(existingAccess.id)
        }
      }

      // Generate unique token
      const token = this.generateInviteToken()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours expiry

      // Create invite
      const inviteId = await this.createInvite({
        tripId,
        email,
        token,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString()
      })

      if (!inviteId) {
        return { success: false, message: 'Failed to create invite' }
      }

      // Create pending trip access
      await this.createTripAccess({
        tripId,
        email,
        role: 'Collaborator',
        status: 'pending',
        invitedBy,
        invitedAt: new Date().toISOString()
      })

      // Send email
      const inviteUrl = `${window.location.origin}/accept-invite/${token}`
      const trip = await this.getTrip(tripId)
      const tripTitle = trip?.title || 'Unknown Trip'
      
      // Спочатку пробуємо безкоштовний сервіс
      let emailResult = await freeEmailService.sendInviteEmail({
        to: email,
        tripTitle,
        inviteUrl,
        expiresAt: expiresAt.toISOString()
      })

      // Якщо безкоштовний сервіс не працює, пробуємо Firebase Functions
      if (!emailResult.success) {
        emailResult = await emailService.sendInviteEmail({
          to: email,
          tripTitle,
          inviteUrl,
          expiresAt: expiresAt.toISOString()
        })
      }
      
      if (!emailResult.success) {
        console.warn('Email sending failed:', emailResult.message)
        // Return partial success - invite was created but email failed
        return { 
          success: true, 
          message: `Invitation created for ${email}, but email delivery failed. Check console for invite URL.` 
        }
      }

      return { success: true, message: `Invitation sent to ${email}` }
    } catch (error) {
      console.error('Error sending invite:', error)
      return { success: false, message: 'Failed to send invitation' }
    }
  },

  generateInviteToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}
