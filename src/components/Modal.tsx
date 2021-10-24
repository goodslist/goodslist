import React from 'react'
import styles from '../styles/Modal.module.css'
import { useState } from 'react'

const useModal = (props: any) => {
  const closeModal = () => {
    props.setShowModal(false)
  }
  const reset = () => {
    props.buttonAction()
    props.setShowModal(false)
  }

  const clickModalContent = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    console.log('テスト')
  }

  return (
    <>
      <div
        id='overlay'
        className={props.showFlag ? styles.overlay_active : styles.overlay}
        onClick={closeModal}
      >
        <div
          id='modalContent'
          className={props.showFlag ? styles.modal_container_active : styles.modal_container}
          onClick={clickModalContent}
        >
          <div className={styles.close_button_container}>
            <span className={styles.close_button} onClick={closeModal}></span>
          </div>
          <div className={styles.title}>{props.title}</div>
          <div className={styles.text}>{props.text}</div>
          <button className={styles.button} onClick={reset}>
            {props.button_text}
          </button>
        </div>
      </div>
    </>
  )
}

export default useModal

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
