import styles from '../../../styles/Modal.module.css'
import InputTextArea from '../../form/InputTextArea'

const Memo = (props: any) => {
  return (
    <>
      <div className={styles.title}>メモを入力</div>
      <div className={styles.textCount}>
        <span className={props.memo.length < 100 ? styles.nomal : styles.error}>
          {props.memo.length}
        </span>{' '}
        / 100
      </div>
      <InputTextArea
        name='memo'
        placeholder='メモの内容'
        value={props.memo}
        onChange={props.onChange}
      />
      <button className={styles.button} onClick={props.close}>
        決定
      </button>
    </>
  )
}

export default Memo
