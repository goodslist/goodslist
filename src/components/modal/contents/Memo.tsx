import styles from '../../../styles/Modal.module.css'
import InputTextArea from '../../form/InputTextArea'

const Memo = (props: any) => {
  return (
    <>
      <div className={styles.title}>メモを入力</div>
      <div className={styles.modal_space}></div>
      <InputTextArea
        // valid={validName}
        name='memo'
        placeholder='メモの内容を入力'
        value={props.memo}
        onChange={props.onChange}
        error={props.errorMemo}
      />
      <button className={styles.button} onClick={props.close}>
        決定
      </button>
    </>
  )
}

export default Memo
