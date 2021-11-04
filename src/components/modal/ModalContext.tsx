import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react'
import addModalContent from './AddModalContent'
import { Child, ChildHandles } from '../../pages/event/[event_id]'

export interface ModalContextProps {
  openModalFlag: boolean
  setOpenModalFlag: Dispatch<SetStateAction<boolean>>
  modalContent: JSX.Element
  setModalContent: Dispatch<SetStateAction<JSX.Element>>
  openModal: (action: string) => void
  closeModal: () => void
  modalType: string
  setModalType: Dispatch<SetStateAction<string>>
  openModalContentFlag: boolean
  setOpenModalContentFlag: Dispatch<SetStateAction<boolean>>
}

export const ModalContext = createContext({} as ModalContextProps)

export const useProvideModal = () => {
  //モーダルの開閉フラグ
  const [openModalFlag, setOpenModalFlag] = useState(false)

  //モーダルの開閉フラグ
  const [openModalContentFlag, setOpenModalContentFlag] = useState(false)
  //モーダルの種類
  const [modalType, setModalType] = useState('')
  //モーダルのコンテンツ
  const [modalContent, setModalContent] = useState<JSX.Element>(<></>)

  //モーダルを開く処理
  const openModal = useCallback((action: string) => {
    //モーダルにコンテンツを追加
    // setModalContent(addModalContent(action))
    // setOpenModalFlag(true)
    // if (action == 'save') {
    //   setTimeout(function () {
    //     closeModal()
    //   }, 1000)
    // }
  }, [])

  const closeModal = useCallback(() => {
    // setModalContent(<></>)
    setOpenModalFlag(false)
  }, [])

  return {
    openModalFlag,
    setOpenModalFlag,
    modalContent,
    setModalContent,
    openModal,
    closeModal,
    modalType,
    setModalType,
    openModalContentFlag,
    setOpenModalContentFlag,
  }
}

export const ModalProvider: FC = ({ children }) => {
  const {
    openModalFlag,
    setOpenModalFlag,
    modalContent,
    setModalContent,
    openModal,
    closeModal,
    modalType,
    setModalType,
    openModalContentFlag,
    setOpenModalContentFlag,
  } = useProvideModal()

  return (
    <ModalContext.Provider
      value={{
        openModalFlag,
        setOpenModalFlag,
        modalContent,
        setModalContent,
        openModal,
        closeModal,
        modalType,
        setModalType,
        openModalContentFlag,
        setOpenModalContentFlag,
      }}
    >
      {/* {openModalFlag && <Modal modalContent={modalContent} onClose={closeModal} />} */}
      {children}
    </ModalContext.Provider>
  )
}
