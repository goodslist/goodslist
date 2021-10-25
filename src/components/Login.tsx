import React from 'react'
import styles from '../styles/Login.module.css'

const Login = (props: any) => {
  //モーダルを閉じる
  const closeModal = () => {
    props.setShowModal(false)
  }
  //親から送られてきた関数を実行
  const reset = () => {
    props.modalProps.buttonAction()
    props.setShowModal(false)
  }

  //モーダルウインドウをクリックした時に親要素のモーダルを閉じるが発火しないための処理
  const clickModalContent = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
  }

  return (
    <>
      <div className={props.showFlag ? styles.overlay_active : styles.overlay} onClick={closeModal}>
        <div
          className={props.showFlag ? styles.modal_container_active : styles.modal_container}
          onClick={clickModalContent}
        >
          <div className={styles.close_button_container}>
            <span className={styles.close_button} onClick={closeModal}></span>
          </div>
          <div className={styles.title}></div>
          <div className={styles.text}></div>
          <button className={styles.button} onClick={reset}>
            メールアドレスで登録する
          </button>
        </div>
      </div>
    </>
  )
}

export default Login
