import React from 'react'

const Modal = (props: any) => {
  const closeModal = () => {
    props.setShowModal(false)
  }

  return (
    <>
      {props.showFlag ? ( // showFlagがtrueだったらModalを表示する
        <div id='overlay'>
          <div id='modalContent'>
            <p>This is ModalContent</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      ) : (
        <></> // showFlagがfalseの場合はModalは表示しない
      )}
    </>
  )
}

export default Modal
