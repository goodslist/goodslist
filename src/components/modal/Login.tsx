import styles from '../../styles/Modal.module.css'
import Modal from '../Modal'

const login = () => {
  return (
    <div className={styles.modal_content}>
      <div className={styles.title}>LOGIN</div>
      <div className={styles.text}>
        普段お使いのソーシャルアカウントでログインできます。メールアドレスでのログインは一番下の入力欄にメールアドレスとパスワードを入力してログインボタンを押してください。
        <br />
        メールアドレスで新規ご利用のはこちら。a
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
      <button className={styles.login_button_twitter}></button>
      <button className={styles.button}></button>
    </div>
  )
}

export default login
