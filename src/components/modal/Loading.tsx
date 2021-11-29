import styles from '../../styles/Modal.module.css'
import { ModalContext } from './ModalContext'
import { useContext } from 'react'

const Loading = (props: any) => {
  const { isLoading }: any = useContext(ModalContext)
  return (
    <>
      <div className={isLoading ? styles.clear_overlay_active : styles.clear_overlay}>
        <div className={styles.spinner_container}>
          <div className={styles.spinner}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Loading
