import { getDomainLocale } from 'next/dist/shared/lib/router/router'
import React, { Dispatch, SetStateAction, createContext, FC, useState } from 'react'

interface SignUpContextProps {
  sendEmail: string | null | undefined
  setSendEmail: Dispatch<SetStateAction<string | null | undefined>>
}

export const SignUpContext = createContext({} as SignUpContextProps)

export const SignUpProvider: FC = ({ children }) => {
  const [sendEmail, setSendEmail] = useState<string | null | undefined>(undefined)

  return (
    <SignUpContext.Provider
      value={{
        sendEmail,
        setSendEmail,
      }}
    >
      {children}
    </SignUpContext.Provider>
  )
}
