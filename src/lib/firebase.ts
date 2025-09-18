import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyAp7v3OcQz1a95rxPP8TVuCwywEsCciKXY",
  authDomain: "travel-planning-service-front.firebaseapp.com",
  projectId: "travel-planning-service-front",
  storageBucket: "travel-planning-service-front.firebasestorage.app",
  messagingSenderId: "1043315498517",
  appId: "1:1043315498517:web:1964afb6d0b8f216f3381cy"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
