import styles from '../../../styles/Modal.module.css'
import InputTextArea from '../../form/InputTextArea'
import InputError from '../../../components/form/InputError'
import ModalButton from './ModalButton'
import { useState, useContext } from 'react'
import { ModalContext } from '../ModalContext'

const Memo = (props: any) => {
  const [memo, setMemo] = useState(props.memo)

  const { setModalType }: any = useContext(ModalContext)

  //エンターが押下されたら、メモを更新して閉じる。
  const updateMemo = () => {
    props.onChangeMemo(memo)
    props.onClickClose()
    setModalType('blank')
  }

  return (
    <>
      <div className={styles.title}>メモを入力</div>
      <div className={styles.textCount}>
        <span className={props.memo.length < 100 ? styles.nomal : styles.error}>
          {props.memo.length}
        </span>{' '}
        / 100
      </div>
      <InputTextArea name='memo' placeholder='メモの内容' value={memo} onChange={setMemo} />
      <InputError error={props.error} />

      <ModalButton
        onClickClose={props.onClickClose}
        btn_text={props.btn_text}
        onClickEnter={updateMemo}
      />
    </>
  )
}

export default Memo
