import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile 
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User } from '@/types'

// Helper function to get user-friendly error messages
const getErrorMessage = (error: any): string => {
  const errorCode = error.code
  
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please check your credentials and try again.'
    
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please try logging in instead.'
    
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.'
    
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.'
    
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.'
    
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}

export const authService = {
  async register(email: string, password: string, displayName?: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      if (displayName) {
        await updateProfile(user, { displayName })
      }

      // Create user document in Firestore
      const userData: User = {
        uid: user.uid,
        email: user.email!,
        displayName: displayName || user.displayName || undefined,
        role: 'User'
      }

      await setDoc(doc(db, 'users', user.uid), userData)
      return { success: true, user: userData }
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) }
    }
  },

  async login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) }
    }
  },

  async logout() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) }
    }
  }
}
