import styles from '../../../styles/Modal.module.css'

const Message = (props: any) => {
  return (
    <>
      <div className={styles.message}>{props.message}</div>
    </>
  )
}

export default Message
