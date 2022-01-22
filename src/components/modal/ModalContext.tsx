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

export interface ModalContextProps {
  setOpenModalFlag: Dispatch<SetStateAction<boolean>>
  openModalFlag: boolean
  modalContent: JSX.Element
  setModalContent: Dispatch<SetStateAction<JSX.Element>>
  openModal: (action: string) => void
  closeModal: () => void
  modalType: string
  setModalType: Dispatch<SetStateAction<string>>
  openModalContentFlag: boolean
  setOpenModalContentFlag: Dispatch<SetStateAction<boolean>>
  showLogin: boolean
  setShowLogin: Dispatch<SetStateAction<boolean>>
  openClearOverlay: boolean
  setOpenClearOverlay: Dispatch<SetStateAction<boolean>>
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  isShowSearch: boolean
  setIsShowSearch: Dispatch<SetStateAction<boolean>>
}

export const ModalContext = createContext({} as ModalContextProps)

export const useProvideModal = () => {
  //モーダルの開閉フラグ
  const [openModalFlag, setOpenModalFlag] = useState(false)

  //モーダルの開閉フラグ
  const [openModalContentFlag, setOpenModalContentFlag] = useState(false)
  //ログイン画面か新規登録画面かのフラグ
  const [showLogin, setShowLogin] = useState(true)
  //モーダルの種類
  const [modalType, setModalType] = useState('')
  //モーダルのコンテンツ
  const [modalContent, setModalContent] = useState<JSX.Element>(<></>)

  const [openClearOverlay, setOpenClearOverlay] = useState(false)

  //イベント検索ウインドウの表示
  const [isShowSearch, setIsShowSearch] = useState(false)

  //ローディング中のスピナーの表示
  const [isLoading, setIsLoading] = useState(false)

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
    showLogin,
    setShowLogin,
    openClearOverlay,
    setOpenClearOverlay,
    isLoading,
    setIsLoading,
    isShowSearch,
    setIsShowSearch,
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
    showLogin,
    setShowLogin,
    openClearOverlay,
    setOpenClearOverlay,
    isLoading,
    setIsLoading,
    isShowSearch,
    setIsShowSearch,
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
        showLogin,
        setShowLogin,
        openClearOverlay,
        setOpenClearOverlay,
        isLoading,
        setIsLoading,
        isShowSearch,
        setIsShowSearch,
      }}
    >
      {/* {openModalFlag && <Modal modalContent={modalContent} onClose={closeModal} />} */}
      {children}
    </ModalContext.Provider>
  )
}
