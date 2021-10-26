import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
  useEffect,
} from 'react'

import styles from '../../styles/Modal.module.css'
import Modal from '../Modal'
import addModalContent from './AddModalContent'

export interface ModalContextProps {
  openModalFlag: boolean
  setOpenModalFlag: Dispatch<SetStateAction<boolean>>
  modalContent: JSX.Element
  setModalContent: Dispatch<SetStateAction<JSX.Element>>
  // setModalContent: Dispatch<SetStateAction<ReactNode>>
  openModal: (action: string) => void
  closeModal: () => void
}

export const ModalContext = createContext({} as ModalContextProps)

export const useProvideModal = () => {
  const [openModalFlag, setOpenModalFlag] = useState(false)
  // const [modalContent, setModalContent] = useState<ReactNode>(<>あああ</>)
  // const [modalContent, setModalContent] = useState<string>('あああ')
  const [modalContent, setModalContent] = useState<JSX.Element>(<div>初期</div>)

  const openModal = useCallback((action: string) => {
    setModalContent(addModalContent(action))
    setOpenModalFlag(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalContent(<></>)
    setOpenModalFlag(false)
  }, [])

  // useEffect(() => {
  //   if (openModalFlag == true) console.log('aaa')
  // }, [openModalFlag])

  return {
    openModalFlag,
    setOpenModalFlag,
    modalContent,
    setModalContent,
    openModal,
    closeModal,
  }
}
console.log('context')

export const ModalProvider: FC = ({ children }) => {
  const { openModalFlag, setOpenModalFlag, modalContent, setModalContent, openModal, closeModal } =
    useProvideModal()

  return (
    <ModalContext.Provider
      value={{
        openModalFlag,
        setOpenModalFlag,
        modalContent,
        setModalContent,
        openModal,
        closeModal,
      }}
    >
      {/* {openModalFlag && <Modal modalContent={modalContent} onClose={closeModal} />} */}
      {children}
    </ModalContext.Provider>
  )
}
