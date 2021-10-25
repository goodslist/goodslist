import React from 'react'
import styles from '../styles/Modal.module.css'

const Modal = (props: any) => {
  //モーダルを閉じる
  const closeModal = () => {
    props.modalProps.setShowModal(false)
  }
  //親から送られてきた関数を実行
  const reset = () => {
    props.modalProps.buttonAction()
    props.modalProps.setShowModal(false)
  }

  //モーダルウインドウをクリックした時に親要素のモーダルを閉じるが発火しないための処理
  const clickModalContent = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
  }

  if (props.modalProps.title == 'リストを保存しました。') {
    setTimeout(function () {
      props.modalProps.setShowModal(false)
    }, 1000)
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
          <div className={styles.title}>{props.modalProps.title}</div>
          {props.modalProps.text ? (
            <div className={styles.text}>{props.modalProps.text}</div>
          ) : (
            <div className={styles.under_space} />
          )}
          {props.modalProps.button_text ? (
            <button className={styles.button} onClick={reset}>
              {props.modalProps.button_text}
            </button>
          ) : (
            <div className={styles.under_space} />
          )}
        </div>
      </div>
    </>
  )
}

export default Modal

// import React from 'react'
// import styles from '../styles/Modal.module.css'

// const Modal = (props: any) => {
//   const closeModal = () => {
//     props.setShowModal(false)
//   }

//   return (
//     <>
//       {props.showFlag ? ( // showFlagがtrueだったらModalを表示する
//         <div id='overlay' className={styles.overlay_active}>
//           <div id='modalContent'>
//             <p>This is ModalContent</p>
//             <button onClick={closeModal}>Close</button>
//           </div>
//         </div>
//       ) : (
//         <>
//           <div id='overlay' className={styles.overlay}>
//             <div id='modalContent'>
//               <p>This is ModalContent</p>
//               <button onClick={closeModal}>Close</button>
//             </div>
//           </div>
//         </> // showFlagがfalseの場合はModalは表示しない
//       )}
//     </>
//   )
// }

// export default Modal
