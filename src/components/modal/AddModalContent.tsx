import styles from '../../styles/Modal.module.css'
import Modal from '../Modal'

const addModalContent = (action: string) => {
  let title: string = ''
  let text: string = ''
  let button_text: string = ''
  if (action == 'login') {
    title = 'ログイン'
    text = 'Twitter、LINE、Google、Yahoo!japanのアカウントでログインできます。'
    button_text = 'ログインする'
    console.log('login')
  } else if (action == 'reset') {
    title = 'リセットしますか？'
    text = 'リセットされる項目：購入数、並び替え順、入力欄の開閉'
    button_text = 'リセットする'
  } else {
    title = 'この機能はログインが必要です。'
    text =
      'ログインすると全ての機能を利用できます。Twitter、LINE、Google、Yahoo! JAPANの各ソーシャルアカウントでもログインできます。'
    button_text = 'ログイン/新規登録する'
  }
  return (
    <div className={styles.modal_content}>
      <div className={styles.title}>{title}</div>
      <div className={styles.text}>{text}</div>
      <button className={styles.button}>{button_text}</button>
    </div>
  )
}

export default addModalContent
