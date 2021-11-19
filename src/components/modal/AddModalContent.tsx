import styles from '../../styles/Modal.module.css'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { ModalContext } from './ModalContext'

export default function AddModalContent(props: any) {
  const { setOpenModalFlag, setOpenModalContentFlag }: any = useContext(ModalContext)
  const router = useRouter()

  let title: string = ''
  let text: string = ''
  let button_text: string = ''

  if (props.action == 'save') {
    title = 'リストを保存しました。'
    text = ''
    button_text = ''
  } else if (props.action == 'reset') {
    title = 'リセットしますか？'
    text = 'リセットされる項目：購入数、並び替え順、入力欄の開閉'
    button_text = 'リセットする'
  } else if (props.action == 'login') {
    title = 'この機能はログインが必要です。'
    text = 'ログインすると全ての機能を利用できます。各ソーシャルアカウントでもログインできます。'
    button_text = 'ログイン / 新規登録'
  }

  //ログインが必要な機能の場合、ログインページへ飛ばす
  const login = () => {
    router.push('/login')
    setOpenModalFlag(false)
    setOpenModalContentFlag(false)
    console.log('modalclose')
  }
  return (
    <>
      <div className={styles.title}>{title}</div>
      {text == '' ? <></> : <div className={styles.text}>{text}</div>}
      {(() => {
        if (props.action == 'reset') {
          return (
            <button className={styles.button} onClick={() => props.reset()}>
              {button_text}
            </button>
          )
        } else if (props.action == 'login') {
          return (
            <button className={styles.link} onClick={() => login()}>
              {button_text}
            </button>
          )
        }
      })()}
    </>
  )
}
