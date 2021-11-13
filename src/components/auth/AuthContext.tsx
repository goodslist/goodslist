import React, { Dispatch, SetStateAction, createContext, FC, useState, useEffect } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../../components/supabase'
import { useRouter } from 'next/router'

interface AuthContextProps {
  user: User | null | undefined
  setUser: Dispatch<SetStateAction<User | null | undefined>>
  session: Session | null | undefined
  avatar_url: string | null | undefined
  sign_up: boolean
  signOut: () => void
}

const signOut = () => {
  supabase.auth.signOut()
}

export const AuthContext = createContext({} as AuthContextProps)
export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  const router = useRouter()

  //認証イベントを監視し、発生したらセッションをコンテキストに格納する。
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(session?.user?.id)
      setSession(session)
      alert('認証１')
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    console.log(user)
  }, [])

  useEffect(() => {
    const setupUser = async () => {
      if (session?.user?.id) {
        const { data: user, error } = await supabase
          .from('users')
          .select('id, user_name, avatar_url, sign_up')
          .eq('id', session.user.id)
          .single()
        console.log(user)
        console.log(session)
        console.log(error)
        setUser(user)

        // if (user.sign_up == false) {
        //   router.replace('/signup')
        // }
      }
    }
    setupUser()
  }, [session])

  function signOut() {
    supabase.auth.signOut()
    setUser(undefined)
    setSession(undefined)
    alert('認証ログアウト')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        session,
        signOut,
        avatar_url: 'https://',
        sign_up: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
