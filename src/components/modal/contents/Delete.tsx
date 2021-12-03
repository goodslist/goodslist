import styles from '../../../styles/Modal.module.css'

const Delete = (props: any) => {
  return (
    <>
      <div className={styles.title}>リストを削除しますか？</div>
      <div className={styles.text}>リセット項目：購入数、並び順、入力欄の開閉</div>
      <div className={styles.modal_space}></div>
      <button className={styles.button} onClick={() => props.deleteMylist()}>
        削除する
      </button>
    </>
  )
}

export default Delete
