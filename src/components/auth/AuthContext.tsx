import React, {
  Dispatch,
  SetStateAction,
  createContext,
  FC,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react'
import { useRouter } from 'next/router'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
// import { User } from 'firebase/auth'
import { supabase } from '../supabase'

import { User } from '../types'

//firebaseを初期化
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}
const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth()

interface AuthContextProps {
  currentUser: User | null | undefined
  setCurrentUser: Dispatch<SetStateAction<User | null | undefined>>
}

export const AuthContext = createContext({} as AuthContextProps)
export const AuthProvider: FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined)
  const router = useRouter()

  const getUser = async (uid: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('user_id, user_name, provider, provider_id, photo, signedup')
      .eq('user_id', uid)
    if (data) {
      if (data.length > 0) {
        console.log('あったよ' + data.length)
        const user: User = {
          user_id: data[0].user_id,
          user_name: data[0].user_name,
          provider: data[0].provider,
          provider_id: data[0].provider_id,
          photo: data[0].photo,
          signedup: data[0].signedup,
        }
        setCurrentUser(user)
        // if (user.signedup == false) router.push('/login/profile')
      } else {
      }
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseAuthUser) => {
      if (firebaseAuthUser) {
        getUser(firebaseAuthUser.uid)

        console.log('onAuthStateChangedユーザーあり')
        console.log(firebaseAuthUser)
      } else console.log('onAuthStateChangedユーザーなし')
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
