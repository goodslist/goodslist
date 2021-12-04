import styles from '../../../styles/Modal.module.css'
import { dateFormat, numberFormat, timeStampFormat } from '../../Utils'

const Delete = (props: any) => {
  const deleteMylist = (aaa: number) => {
    alert(aaa)
  }
  return (
    <>
      <div className={styles.title}>このリストを削除しますか？</div>
      <div className={styles.text}>
        {props.onDeleteMylist.content_name}
        <br />
        {props.onDeleteMylist.event_name}
        <br />
        {dateFormat(props.onDeleteMylist.date)}
        <br />
        {props.onDeleteMylist.total_count}点　 &yen;{numberFormat(props.onDeleteMylist.total_price)}
        <br />
      </div>
      <div className={styles.modal_space}></div>
      <button
        className={styles.button}
        onClick={() => props.deleteMylist(props.onDeleteMylist.list_id)}
      >
        削除する
      </button>
    </>
  )
}

export default Delete
