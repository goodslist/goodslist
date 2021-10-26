import React from 'react'
import styles from '../styles/Modal.module.css'
import { ModalContext } from './modal/ModalContext'
import { useContext } from 'react'

const Modal = (props: any) => {
  const { openModalFlag, setOpenModalFlag, modalContent, setModalCotent, closeModal }: any =
    useContext(ModalContext)
  //モーダルを閉じる
  // const closeModal = () => {
  //   setOpenModalFlag(false)
  // }
  //親から送られてきた関数を実行
  const reset = () => {
    props.modalProps.buttonAction()
    setOpenModalFlag(false)
  }

  //モーダルウインドウをクリックした時に親要素のモーダルを閉じるが発火しないための処理
  const clickModalContent = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
  }

  console.log(modalContent)

  // if (props.modalProps.title == 'リストを保存しました。') {
  //   setTimeout(function () {
  //     setOpenModalFlag(false)
  //   }, 1000)
  // }
  console.log('modal.tsx')

  return (
    <>
      <div className={openModalFlag ? styles.overlay_active : styles.overlay} onClick={closeModal}>
        <div
          className={openModalFlag ? styles.modal_container_active : styles.modal_container}
          onClick={clickModalContent}
        >
          {console.log('modal.tsx jsx')}
          <div className={styles.close_button_container}>
            <span className={styles.close_button} onClick={closeModal}></span>
          </div>
          {modalContent}
        </div>
      </div>
    </>
  )
}

export default Modal
