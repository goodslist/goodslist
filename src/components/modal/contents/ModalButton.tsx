import styles from '../../../styles/Modal.module.css'

const ModalButton = (props: any) => {
  return (
    <div className={styles.modal_btn_container}>
      <button className={styles.modal_btn_cancel} onClick={() => props.onClickClose()}>
        Cancel
      </button>
      <button className={styles.modal_btn_enter} onClick={() => props.onClickEnter()}>
        {props.btn_text}
      </button>
    </div>
  )
}

export default ModalButton
