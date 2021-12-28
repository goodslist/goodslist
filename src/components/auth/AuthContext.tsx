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
    console.log('ここ３')
    const { data, error } = await supabase
      .from('users')
      .select('user_id, user_name, provider, provider_id, photo, signedup')
      .eq('user_id', uid)
    if (data) {
      console.log('ここ4')
      if (data.length > 0) {
        console.log('ここ５')
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
        console.log(user)
        // if (user.signedup == false) router.push('/login/profile')
      } else {
        console.log('ここ６')
      }
    }
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthChange(event, session)
      console.log('ここ１')
      if (session) {
        getUser(String(session?.user?.id))
        console.log('ここ2')
      }
    })
    checkUser()
    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  async function checkUser() {
    /* when the component loads, checks user to show or hide Sign In link */
    const user = await supabase.auth.user()
    if (user) {
      // setAuthenticatedState('authenticated')
      console.log(user)
      console.log(user.id)
      console.log(user.user_metadata.full_name)
      console.log(user.app_metadata.provider)
      console.log(user.user_metadata.user_name)
      console.log(user.user_metadata.avatar_url)
      const { data, error } = await supabase
        .from('users')
        .select('user_id, user_name, provider, provider_id, photo, signedup')
        .eq('user_id', 'TRPy99vBM4R1DsGs0uXeu3kwZFk1')
      if (data) {
        console.log('ここ4')
        if (data.length > 0) {
          console.log('ここ５')
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
          console.log(user)
          // if (user.signedup == false) router.push('/login/profile')
        } else {
          console.log('ここ６')
        }
      }
    } else {
      console.log('ここ7')
    }
  }

  async function handleAuthChange(event: any, session: any) {
    /* sets and removes the Supabase cookie */
    await fetch('/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    })
  }

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

// import React, {
//   Dispatch,
//   SetStateAction,
//   createContext,
//   FC,
//   useState,
//   useEffect,
//   useLayoutEffect,
// } from 'react'
// import { useRouter } from 'next/router'
// import { initializeApp } from 'firebase/app'
// import { getAuth, onAuthStateChanged } from 'firebase/auth'
// // import { User } from 'firebase/auth'
// import { supabase } from '../supabase'

// import { User } from '../types'

// //firebaseを初期化
// export const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// }
// const firebaseApp = initializeApp(firebaseConfig)

// const auth = getAuth()

// interface AuthContextProps {
//   currentUser: User | null | undefined
//   setCurrentUser: Dispatch<SetStateAction<User | null | undefined>>
// }

// export const AuthContext = createContext({} as AuthContextProps)
// export const AuthProvider: FC = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined)
//   const router = useRouter()

//   const getUser = async (uid: string) => {
//     const { data, error } = await supabase
//       .from('users')
//       .select('user_id, user_name, provider, provider_id, photo, signedup')
//       .eq('user_id', uid)
//     if (data) {
//       if (data.length > 0) {
//         console.log('あったよ' + data.length)
//         const user: User = {
//           user_id: data[0].user_id,
//           user_name: data[0].user_name,
//           provider: data[0].provider,
//           provider_id: data[0].provider_id,
//           photo: data[0].photo,
//           signedup: data[0].signedup,
//         }
//         setCurrentUser(user)
//         // if (user.signedup == false) router.push('/login/profile')
//       } else {
//       }
//     }
//   }

//   useEffect(() => {
//     onAuthStateChanged(auth, (firebaseAuthUser) => {
//       if (firebaseAuthUser) {
//         getUser(firebaseAuthUser.uid)

//         console.log('onAuthStateChangedユーザーあり')
//         console.log(firebaseAuthUser)
//       } else console.log('onAuthStateChangedユーザーなし')
//     })
//   }, [])

//   return (
//     <AuthContext.Provider
//       value={{
//         currentUser,
//         setCurrentUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }
