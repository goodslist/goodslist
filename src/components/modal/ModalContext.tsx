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

  const createModalContent = (action: string) => {
    let title: string = ''
    let text: string = ''
    let button_text: string = ''
    if (action == 'login') {
      title = 'ログイン'
      text = 'Twitter、LINE、Google、Yahoo!japanのアカウントでログインできます。'
      button_text = 'ログインする'
      console.log('login')
    } else if (action == 'reset') {
      title = 'リセットしますか？'
      text = 'リセットされる項目：購入数、並び替え順、入力欄の開閉'
      button_text = 'リセットする'
    } else {
      title = 'この機能はログインが必要です。'
      text =
        'ログインすると全ての機能を利用できます。Twitter、LINE、Google、Yahoo! JAPANの各ソーシャルアカウントでもログインできます。'
      button_text = 'ログイン/新規登録する'
    }
    setModalContent(
      <div className={styles.modal_content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.text}>{text}</div>
        <button className={styles.button}>{button_text}</button>
      </div>,
    )
  }

  const openModal = useCallback((action: string) => {
    createModalContent(action)
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
