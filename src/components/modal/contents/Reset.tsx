import styles from '../../../styles/Modal.module.css'
import ModalButton from './ModalButton'
import { useState, useContext } from 'react'
import { ModalContext } from '../ModalContext'

const Reset = (props: any) => {
  const { setModalType }: any = useContext(ModalContext)

  const enterReset = () => {
    props.onClickEnter()
    setModalType('blank')
  }

  return (
    <>
      <div className={styles.title}>リセットしますか？</div>
      <div className={styles.text}>
        リセット項目
        <br />
        <br />
        購入数、並び順、入力欄の開閉onClickReset
      </div>
      <div className={styles.modal_space}></div>
      <ModalButton
        onClickClose={props.onClickClose}
        btn_text={props.btn_text}
        onClickEnter={enterReset}
      />
    </>
  )
}

export default Reset
