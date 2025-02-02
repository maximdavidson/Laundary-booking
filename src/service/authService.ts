import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth'
import { auth, db, googleProvider } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

// Registration with email
export const registrationWithEmail = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)

  await updateProfile(userCredential.user, {
    displayName: name,
  })

  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name: name,
      email: email,
      createdAt: new Date(),
      uid: userCredential.user.uid,
    })
  }

  return userCredential
}

// Login with email
export const loginWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

//Login with google
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider)

  if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
    await setDoc(doc(db, 'users', result.user.uid), {
      name: result.user.displayName,
      email: result.user.email,
      createdAt: new Date(),
      authMethod: 'google',
    })
  }

  return result
}

//Exit from account
export const logout = async () => {
  return signOut(auth)
}

//User tracking
export const getcurrentUser = (): Promise<User | null> => {
  return new Promise(resolve => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe()
      resolve(user)
    })
  })
}
