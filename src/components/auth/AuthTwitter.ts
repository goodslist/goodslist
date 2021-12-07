import { getAuth, signInWithRedirect, TwitterAuthProvider } from 'firebase/auth'
import { AuthContext } from './AuthContext'
import { useEffect, useContext } from 'react'
import type { FirebaseApp } from 'firebase/app'
const auth = getAuth()

const provider = new TwitterAuthProvider()

export const authTwitter = async () => {
  const { setAuthProvider }: any = useContext(AuthContext)
  await setAuthProvider('twitter')
  await signInWithRedirect(auth, provider)
}
