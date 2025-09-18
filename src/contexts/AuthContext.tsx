import React, { createContext, useContext, useEffect } from 'react'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useAuthStore } from '@/stores/authStore'
import { useTripsStore } from '@/stores/tripsStore'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, setUser, setLoading } = useAuthStore()
  const { clearState } = useTripsStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out')
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data() as User
            console.log('User data loaded:', userData.email)
            setUser(userData)
          } else {
            // Create new user document
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || undefined,
              role: 'User'
            }
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
            console.log('New user created:', newUser.email)
            setUser(newUser)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
          setUser(null)
        }
      } else {
        console.log('Clearing user data')
        setUser(null)
        clearState() // Clear trips data when user logs out
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [setUser, setLoading, clearState])

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
