import styles from '../../styles/Login.module.css'
import Twitter from '../../../public/images/twitter.svg'
import Line from '../../../public/images/line.svg'
import Mail from '../../../public/images/mail.svg'
import Password from '../../../public/images/password.svg'
import { AuthContext } from '../../components/auth/AuthContext'
import { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { supabase } from '../../components/supabase'
import { ModalContext } from '../../components/modal/ModalContext'
import Head from 'next/head'
import Navbar from '../../components/Navber'

export default function Login() {
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

  const signup = async () => {
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

  const clickLinkSignUp = () => {
    setOpenModalContentFlag(false)
    setTimeout(function () {
      setShowLogin(false)
      setOpenModalContentFlag(true)
    }, 500)
  }

  return (
    <>
      <Head>
        <title>Goodsist イベントのグッズ代が計算できるWEBアプリ</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0' />
        <link rel='icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap&text=Goodsist'
          rel='stylesheet'
        />
      </Head>

      <Navbar />
      <main className={styles.main}>
        <div className={styles.content_title}>
          <span>ログイン</span>
        </div>
        <div className={styles.login_signup_form_container}>
          <button className={styles.btn_link_signup} onClick={() => clickLinkSignUp()}>
            新規登録はこちら
          </button>
          <div className={styles.form_login_sns}>
            <div className={styles.form_header}>SNSでログイン</div>
            <button className={styles.btn_login_twitter}>
              Twitterでログイン
              <span>
                <Twitter />
              </span>
            </button>
            <button className={styles.btn_login_line}>
              LINEでログイン
              <span>
                <Line />
              </span>
            </button>
            {/* <button className={styles.btn_login_yahoo}>
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
            </button> */}
          </div>
          <div className={styles.form_login_mail}>
            <div className={styles.form_header}>メールでログイン</div>
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
            <button className={styles.btn_login_mail} onClick={() => login()}>
              メールアドレスでログイン
              <span>
                <Mail />
              </span>
            </button>
            {/* <button className={styles.btn_login_mail} onClick={() => signup()}>
            メールアドレスで登録
            <span>
              <Mail />
            </span>
          </button> */}
          </div>
        </div>
      </main>
    </>
  )
}
