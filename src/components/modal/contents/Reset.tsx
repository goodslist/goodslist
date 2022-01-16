import styles from '../../../styles/Modal.module.css'

const Reset = (props: any) => {
  return (
    <>
      <div className={styles.title}>リストをリセットしますか？</div>
      <div className={styles.text}>
        リセット項目
        <br />
        購入数、並び順、入力欄の開閉
      </div>
      <div className={styles.modal_space}></div>
      <button className={styles.button} onClick={() => props.reset()}>
        リセットする
      </button>
    </>
  )
}

export default Reset
