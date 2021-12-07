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
import { User } from 'firebase/auth'

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

//firebaseを初期化
const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth()

interface AuthContextProps {
  currentUser: User | null | undefined
  setCurrentUser: Dispatch<SetStateAction<User | null | undefined>>
  userPhoto: string | null | undefined
  setUserPhoto: Dispatch<SetStateAction<string | null | undefined>>
  authProvider: string
  setAuthProvider: Dispatch<SetStateAction<string>>
  isSinguped: boolean
}

export const AuthContext = createContext({} as AuthContextProps)
export const AuthProvider: FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined)
  const [userPhoto, setUserPhoto] = useState<string | null | undefined>(undefined)
  const [authProvider, setAuthProvider] = useState<string>('')
  const [isSinguped, setIsSignuped] = useState<boolean>(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
        // const userPhotoUrl = localStorage.getItem('photo')
        // if (userPhotoUrl) setUserPhoto(userPhotoUrl)
        console.log('onAuthStateChangedユーザーあり')
        console.log(user)
      } else console.log('onAuthStateChangedユーザーなし')
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userPhoto,
        setUserPhoto,
        authProvider,
        setAuthProvider,
        isSinguped,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
