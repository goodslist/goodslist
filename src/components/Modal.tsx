import React from 'react'
import styles from '../styles/Modal.module.css'
import { useState } from 'react'

const useModal = (props: any) => {
  const closeModal = () => {
    props.setShowModal(false)
  }

  return (
    <>
      <div
        id='overlay'
        className={props.showFlag ? styles.overlay_active : styles.overlay}
        onClick={closeModal}
      >
        <div id='modalContent' className={styles.modal_container}>
          <p>This is ModalContent</p>
          <button onClick={closeModal}>Close</button>
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
