import styles from '../styles/Login.module.css'
import Twitter from '../../public/images/twitter.svg'
import Line from '../../public/images/line.svg'
import Mail from '../../public/images/mail.svg'
import Password from '../../public/images/password.svg'
import { AuthContext } from './auth/AuthContext'
import { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { supabase } from './supabase'
import { ModalContext } from './modal/ModalContext'

export default function SignUp() {
  const { user, session, signOut }: any = useContext(AuthContext)

  const {
    openModalFlag,
    setOpenModalFlag,
    modalType,
    openModalContentFlag,
    setOpenModalContentFlag,
    setShowLogin,
  }: any = useContext(ModalContext)

  //ログインか新規登録かのフラグ
  const [isSns, setIsSns] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = async () => {
    const { error, data } = await supabase.auth.signIn({ email, password })
    if (error) {
      console.log({ error })
    } else {
      console.log({ data })
    }
  }

  const signUp = async () => {
    const { error, data } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.log({ error })
    } else {
      console.log({ data })
    }
  }

  const changeSelectLogin = (select: string) => {
    if (select == 'mail') {
      setIsSns(false)
    } else if (select == 'sns') {
      setIsSns(true)
    }
  }

  const clickLinkLogIn = () => {
    setOpenModalContentFlag(false)
    setTimeout(function () {
      setShowLogin(true)
      setOpenModalContentFlag(true)
    }, 500)
  }

  return (
    <>
      <div className={styles.content_title}>
        <span>新規登録{user ? user.user_name : ''}</span>
      </div>
      <div className={styles.select_login_container}>
        <button
          className={isSns ? styles.select_login_active : styles.select_login}
          onClick={() => changeSelectLogin('sns')}
        >
          SNS
        </button>
        <button
          className={isSns ? styles.select_register : styles.select_register_active}
          onClick={() => changeSelectLogin('mail')}
        >
          {/* <Link href={'/signup'}>
                <a>新規登録</a>
              </Link> */}
          メール
        </button>
      </div>
      <div className={styles.select_underbar_container}>
        <div
          className={isSns ? styles.select_underbar_login : styles.select_underbar_register}
        ></div>
      </div>
      <div className={isSns ? styles.form_container_sns : styles.form_container_mail}>
        <div className={styles.form_login_mail}>
          <div className={styles.form_header}>メールで新規登録</div>
          <span className={styles.input_mail_container}>
            <input
              className={styles.input_mail}
              type='text'
              name='email'
              placeholder='メールアドレス'
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>
              <Mail />
            </span>
          </span>
          <div className={styles.input_error}></div>
          <span className={styles.input_password_container}>
            <input
              className={styles.input_password}
              type='password'
              name='password'
              placeholder='パスワード'
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>
              <Password />
            </span>
          </span>
          <div className={styles.input_error}>
            アルファベットと数字の組み合わせで8文字以上が必要です。
          </div>
          <div className={styles.forgot_password} onClick={() => signOut()}>
            パスワードを忘れた場合
          </div>
          <button className={styles.btn_login_mail} onClick={() => signUp()}>
            確認メールを送信
            <span>
              <Mail />
            </span>
          </button>
          <button className={styles.btn_link_register} onClick={() => clickLinkLogIn()}>
            ログインはこちら
          </button>
          {/* <button className={styles.btn_login_mail} onClick={() => signup()}>
            メールアドレスで登録
            <span>
              <Mail />
            </span>
          </button> */}
        </div>
        <div className={styles.form_login_sns}>
          <div className={styles.form_header}>SNSで新規登録</div>
          <button className={styles.btn_login_twitter}>
            Twitter
            <span>
              <Twitter />
            </span>
          </button>
          <button className={styles.btn_login_line}>
            LINE
            <span>
              <Line />
            </span>
          </button>
          <button className={styles.btn_login_yahoo}>
            Yahoo! JAPAN
            <span>
              <img src='../../images/yahoo.png' width='35px' height='35px' />
            </span>
          </button>
          <button className={styles.btn_login_google}>
            Google
            <span>
              <img src='../../images/google.svg' width='26px' height='26px' />
            </span>
          </button>
          <button className={styles.btn_link_register} onClick={() => clickLinkLogIn()}>
            ログインはこちら
          </button>
        </div>
      </div>
    </>
  )
}
