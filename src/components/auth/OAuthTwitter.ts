import { getAuth, signInWithRedirect, TwitterAuthProvider } from 'firebase/auth'
import { AuthContext } from '../../components/auth/AuthContext'
import { useEffect, useContext } from 'react'
import type { FirebaseApp } from 'firebase/app'
const auth = getAuth()

const provider = new TwitterAuthProvider()

export const OAuthTwitter = async () => {
  // const { setCurrentUser }: any = useContext(AuthContext)

  await signInWithRedirect(auth, provider)
}
