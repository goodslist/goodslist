import { createContext } from 'react'
import { useState } from 'react'

export const ModalContext = createContext({})

export const ModalProvider = (props: any) => {
  const { children } = props
  const [openModal, setOpenModal] = useState<boolean>(false)

  return (
    <ModalContext.Provider value={{ openModal, setOpenModal }}>{children}</ModalContext.Provider>
  )
}
