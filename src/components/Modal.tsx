import React from 'react'
import styles from '../styles/Modal.module.css'
import { ModalContext } from './modal/ModalContext'
import { useContext, useRef, useImperativeHandle, forwardRef } from 'react'

const Modal = (props: any) => {
  const { openModalFlag, modalContent, closeModal }: any = useContext(ModalContext)

  //モーダルウインドウの領域をクリックした時にオーバーレイの閉じるが発火しないための処理
  const clickModalContent = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
  }

  return (
    <div className={openModalFlag ? styles.overlay_active : styles.overlay} onClick={closeModal}>
      <div
        className={openModalFlag ? styles.modal_container_active : styles.modal_container}
        onClick={clickModalContent}
      >
        <div className={styles.close_button_container}>
          <span className={styles.close_button} onClick={closeModal}></span>
        </div>
        {/* コンテンツはmodal/AddModalContent.tsx */}
        {modalContent}
      </div>
    </div>
  )
}

export default Modal
