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
import addModalContent from './AddModalContent'
import login from './Login'

export interface ModalContextProps {
  openModalFlag: boolean
  setOpenModalFlag: Dispatch<SetStateAction<boolean>>
  modalContent: JSX.Element
  setModalContent: Dispatch<SetStateAction<JSX.Element>>
  openModal: (action: string) => void
  closeModal: () => void
}

export const ModalContext = createContext({} as ModalContextProps)

export const useProvideModal = () => {
  //モーダルの開閉フラグ
  const [openModalFlag, setOpenModalFlag] = useState(false)
  //モーダルのコンテンツ
  const [modalContent, setModalContent] = useState<JSX.Element>(<></>)

  //モーダルを開く処理
  const openModal = useCallback((action: string) => {
    if (action == 'login') setModalContent(login())
    //モーダルにコンテンツを追加
    else setModalContent(addModalContent(action))
    setOpenModalFlag(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalContent(<></>)
    setOpenModalFlag(false)
  }, [])

  return {
    openModalFlag,
    setOpenModalFlag,
    modalContent,
    setModalContent,
    openModal,
    closeModal,
  }
}

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
