import { initializeApp } from 'firebase/app'
import { browserLocalPersistence, getAuth, GoogleAuthProvider, setPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB0BC5kj0YhycReJQUb4C0OOBmH54usFHg',
  authDomain: 'laundary-booking.firebaseapp.com',
  projectId: 'laundary-booking',
  storageBucket: 'laundary-booking.firebasestorage.app',
  messagingSenderId: '497698594133',
  appId: '1:497698594133:web:6b66ae6f2b74b0029023dc',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
setPersistence(auth, browserLocalPersistence)
