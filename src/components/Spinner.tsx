import styles from '../styles/Spinner.module.css'
import { ModalContext } from './modal/ModalContext'
import { useContext } from 'react'

//数字を3桁ごとにカンマ区切りする。
const BtnSpinner = () => {
  const { openClearOverlay }: any = useContext(ModalContext)

  //モーダルウインドウの領域をクリックした時にオーバーレイの閉じるが発火しないための処理
  const clickModalContent = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
  }

  return (
    <>
      <div className={styles.spinner}>
        <div className={styles.rect1}></div>
        <div className={styles.rect2}></div>
        <div className={styles.rect3}></div>
      </div>
      <div
        className={openClearOverlay ? styles.overlay_active : styles.overlay}
        onClick={clickModalContent}
      ></div>
    </>
  )
}

export default BtnSpinner
