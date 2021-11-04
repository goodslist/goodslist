import { useEffect, useState, useContext } from 'react'
import ClientOnlyPortal from './ClientOnlyPortal'
import styles from '../../styles/Modal.module.css'
import { ModalContext } from './ModalContext'
import AddModalContent from './AddModalContent'
import Login from '../Login'

export default function Modal(props: any) {
  const [open, setOpen] = useState(true)
  const [css, setCss] = useState(false)
  const { openModalFlag, setOpenModalFlag, modalType }: any = useContext(ModalContext)

  const openLogin = () => {
    setOpenModalFlag(true)
  }

  // useEffect(() => {
  //   if (open == true) setCss(true)
  // }, [open])

  //モーダルウインドウの領域をクリックした時にオーバーレイの閉じるが発火しないための処理
  const clickModalContent = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
  }

  const clickButton = () => {
    if (modalType == 'reset') props.reset()
    setOpenModalFlag(false)
  }

  return (
    <>
      {open && (
        <ClientOnlyPortal selector='#modal'>
          <div
            className={openModalFlag ? styles.overlay_active : styles.overlay}
            onClick={() => setOpenModalFlag(false)}
          >
            <div
              className={openModalFlag ? styles.modal_container_active : styles.modal_container}
              onClick={clickModalContent}
            >
              <div className={styles.close_button_container}>
                <span
                  className={styles.close_button}
                  onClick={() => setOpenModalFlag(false)}
                ></span>
              </div>

              <div className={styles.modal_content}>
                {/* <AddModalContent action={modalType} reset={props.reset} /> */}

                <Login />
              </div>
            </div>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  )
}
