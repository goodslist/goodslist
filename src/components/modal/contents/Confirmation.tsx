import styles from '../../../styles/Modal.module.css'
import ModalButton from './ModalButton'

const Confirmation = (props: any) => {
  return (
    <>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.text}>{props.text}</div>
      <div className={styles.modal_space}></div>
      <ModalButton
        onClickClose={props.onClickClose}
        btn_text={props.btn_text}
        onClickEnter={props.onClickEnter}
      />
    </>
  )
}

export default Confirmation
