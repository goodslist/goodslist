import React, { Dispatch, SetStateAction, createContext, FC, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

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
  user: string | null | undefined
  setUser: Dispatch<SetStateAction<string | null | undefined>>
  sign_up: boolean
}

export const AuthContext = createContext({} as AuthContextProps)
export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<string | null | undefined>(undefined)

  const router = useRouter()
  const value = {
    user,
  }
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.uid)
        console.log('ユーザーあり')
      } else console.log('ユーザーなし')
    })
  }, [])

  // //認証イベントを監視し、発生したらセッションをコンテキストに格納する。
  // useEffect(() => {
  //   // const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
  //   //   console.log(session?.user?.id)
  //   //   setSession(session)
  //   //   console.log('onAuthStateChange')
  //   // })
  //   // return () => {
  //   //   authListener?.unsubscribe()
  //   // }
  // }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        sign_up: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// import React, { Dispatch, SetStateAction, createContext, FC, useState, useEffect } from 'react'
// import { Session, User } from '@supabase/supabase-js'
// import { supabase } from '../../components/supabase'
// import { useRouter } from 'next/router'
// import { initializeApp } from 'firebase/app'
// import { getAuth, onAuthStateChanged } from 'firebase/auth'

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
//   user: User | null | undefined
//   setUser: Dispatch<SetStateAction<User | null | undefined>>
//   session: Session | null | undefined
//   avatar_url: string | null | undefined
//   sign_up: boolean
//   signOut: () => void
// }
// const signOut = () => {
//   supabase.auth.signOut()
// }

// export const AuthContext = createContext({} as AuthContextProps)
// export const AuthProvider: FC = ({ children }) => {
//   const [user, setUser] = useState<User | null | undefined>(undefined)
//   const [session, setSession] = useState<Session | null | undefined>(undefined)

//   const router = useRouter()
//   const value = {
//     user,
//   }
//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {})
//   }, [])

//   // //認証イベントを監視し、発生したらセッションをコンテキストに格納する。
//   // useEffect(() => {
//   //   // const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
//   //   //   console.log(session?.user?.id)
//   //   //   setSession(session)
//   //   //   console.log('onAuthStateChange')
//   //   // })
//   //   // return () => {
//   //   //   authListener?.unsubscribe()
//   //   // }
//   // }, [])

//   useEffect(() => {
//     const setupUser = async () => {
//       if (session?.user?.id) {
//         const { data: user, error } = await supabase
//           .from('users')
//           .select('id, user_name, avatar_url, sign_up')
//           .eq('id', session.user.id)
//           .single()
//         // console.log(user)
//         console.log(session)
//         // console.log(error)
//         setUser(user)

//         // if (user.sign_up == false) {
//         //   router.replace('/signup')
//         // }
//       }
//     }
//     setupUser()
//   }, [session])

//   function signOut() {
//     supabase.auth.signOut()
//     setUser(undefined)
//     setSession(undefined)
//     alert('認証ログアウト')
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser,
//         session,
//         signOut,
//         avatar_url: 'https://',
//         sign_up: false,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }
