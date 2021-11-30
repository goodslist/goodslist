import styles from '../../../styles/Modal.module.css'

const Message = (props: any) => {
  return (
    <>
      <div className={styles.title}>{props.message}</div>
    </>
  )
}

export default Message
