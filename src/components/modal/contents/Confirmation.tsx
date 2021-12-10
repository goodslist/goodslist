import styles from '../../../styles/Modal.module.css'

const Confirmation = (props: any) => {
  return (
    <>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.text}>{props.text}</div>
      <div className={styles.modal_space}></div>
      <button className={styles.button} onClick={() => props.onClick()}>
        {props.btn_text}
      </button>
    </>
  )
}

export default Confirmation
