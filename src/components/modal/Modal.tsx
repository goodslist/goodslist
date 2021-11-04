import { useEffect, useState, useContext } from 'react'
import ClientOnlyPortal from './ClientOnlyPortal'
import styles from '../../styles/Modal.module.css'
import { ModalContext } from './ModalContext'
import AddModalContent from './AddModalContent'
import Login from '../Login'
import SignUp from '../SignUp'

export default function Modal(props: any) {
  const [open, setOpen] = useState(true)
  const [css, setCss] = useState(false)
  const {
    openModalFlag,
    setOpenModalFlag,
    modalType,
    openModalContentFlag,
    setOpenModalContentFlag,
    showLogin,
    setShowLogin,
  }: any = useContext(ModalContext)

  //CLOSEボタン、overrayをクリックするとモーダルを閉じる
  const onClickClose = () => {
    setOpenModalFlag(false)
    setOpenModalContentFlag(false)
  }

  //モーダルウインドウの領域をクリックした時にオーバーレイの閉じるが発火しないための処理
  const clickModalContent = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
  }

  return (
    <>
      {open && (
        <ClientOnlyPortal selector='#modal'>
          <div
            className={openModalFlag ? styles.overlay_active : styles.overlay}
            onClick={() => onClickClose()}
          >
            <div
              className={
                openModalContentFlag ? styles.modal_container_active : styles.modal_container
              }
              onClick={clickModalContent}
            >
              <div className={styles.close_button_container}>
                <span className={styles.close_button} onClick={() => onClickClose()}></span>
              </div>

              <div className={styles.modal_content}>
                {/* <AddModalContent action={modalType} reset={props.reset} /> */}

                {/* {showLogin ? <Login /> : <SignUp />} */}
                {(() => {
                  if (modalType == 'login') {
                    return <>{showLogin ? <Login /> : <SignUp />}</>
                  } else {
                    return <AddModalContent action={modalType} reset={props.reset} />
                  }
                })()}
              </div>
            </div>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  )
}
