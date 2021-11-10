import styles from '../styles/Spinner.module.css'

//数字を3桁ごとにカンマ区切りする。
const BtnSpinner = () => {
  return (
    <>
      <div className={styles.spinner}>
        <div className={styles.rect1}></div>
        <div className={styles.rect2}></div>
        <div className={styles.rect3}></div>
      </div>
      <div className={styles.overlay}></div>
    </>
  )
}

export default BtnSpinner
