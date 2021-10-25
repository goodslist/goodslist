import { createContext } from 'react'
import { useState } from 'react'

export const LoginContext = createContext({})

export const LoginProvider = (props: any) => {
  const { children } = props
  const sampleObj = { sampleValue: 'テスト' }

  return <LoginContext.Provider value={{ sampleObj }}>{children}</LoginContext.Provider>
}
