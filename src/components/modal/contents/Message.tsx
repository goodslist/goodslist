import styles from '../../../styles/Modal.module.css'
import { useRouter } from 'next/router'
import { ModalContext } from '../ModalContext'
import { useContext } from 'react'

const Message = (props: any) => {
  return (
    <>
      <div className={styles.message}>{props.message}</div>
    </>
  )
}

export default Message
