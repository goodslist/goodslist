import styles from '../../styles/Login.module.css'
import Twitter from '../../../public/images/twitter.svg'
import Line from '../../../public/images/line.svg'
import Mail from '../../../public/images/mail.svg'
import Password from '../../../public/images/password.svg'
import { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { supabase } from '../../components/supabase'
import { ModalContext } from '../../components/modal/ModalContext'
import Link from 'next/dist/client/link'
import { SignUpContext } from '../../components/signup/SignUpContext'
import { useRouter } from 'next/router'

export default function SignUpFrom() {
  const router = useRouter()

  const {
    openModalFlag,
    setOpenModalFlag,
    modalType,
    openModalContentFlag,
    setOpenModalContentFlag,
    setShowLogin,
  }: any = useContext(ModalContext)

  const { sendEmail, setSendEmail }: any = useContext(SignUpContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [errorEmail, setErrorEmail] = useState('　')
  const [errorPassword, setErrorPassword] = useState('　')
  const [errorPassword2, setErrorPassword2] = useState('　')
  const [checkEmail, setCheckEmail] = useState(false)
  const [checkPassword, setCheckPassword] = useState(false)
  const [checkPassword2, setCheckPassword2] = useState(false)

  let createErrorEmail = '　'
  let createErrorPassword = '　'
  let createErrorPassword2 = '　'

  const signUp = async () => {
    const { error, data } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.log({ error })
    } else {
      console.log({ data })
      setSendEmail(email)
      router.push({
        pathname: '/signup/submit', //URL
      })
    }
  }

  //メールアドレス入力のエラーチェック
  useEffect(() => {
    createErrorEmail = '　'
    if (email.length > 0) {
      if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
        createErrorEmail = createErrorEmail + 'メールアドレスの形式で入力してください。'
      }
      if (email.length > 257) {
        createErrorEmail = createErrorEmail + '256文字以下で入力してください。'
      }
      setErrorEmail(createErrorEmail)
      if (createErrorEmail == '　') setCheckEmail(true)
      else setCheckEmail(false)
    } else {
      createErrorEmail = '　'
      setErrorEmail(createErrorEmail)
    }
  }, [email])

  //パスワード入力のエラーチェック
  useEffect(() => {
    createErrorPassword = '　'
    if (password.length > 0) {
      if (!password.match(/^[A-Za-z0-9]*$/)) {
        createErrorPassword = createErrorPassword + '半角英数字で入力してください。'
      }
      if (password.length < 8 || password.length > 32) {
        createErrorPassword = createErrorPassword + '8文字以上32文字以下で入力してください。'
      }
      setErrorPassword(createErrorPassword)
      if (createErrorPassword == '　') setCheckPassword(true)
      else setCheckPassword(false)
    } else {
      createErrorPassword = '　'
      setErrorPassword(createErrorPassword)
    }
  }, [password])

  //確認用パスワード入力のエラーチェック
  useEffect(() => {
    createErrorPassword2 = '　'
    if (password2.length > 0) {
      if (!password2.match(/^[A-Za-z0-9]*$/)) {
        createErrorPassword2 = createErrorPassword2 + '半角英数字で入力してください。'
      }
      if (password2.length < 8 || password2.length > 32) {
        createErrorPassword2 = createErrorPassword2 + '8文字以上32文字以下で入力してください。'
      }
      if (password != password2) {
        createErrorPassword2 = createErrorPassword2 + 'パスワードが一致しません。'
      }
      setErrorPassword2(createErrorPassword2)
      if (createErrorPassword2 == '　') setCheckPassword2(true)
      else setCheckPassword2(false)
    } else {
      createErrorPassword2 = '　'
      setErrorPassword2(createErrorPassword2)
    }
  }, [password, password2])

  return (
    <>
      <main className={styles.main}>
        <div className={styles.content_title}>
          <span>会員登録</span>
        </div>
        <div className={styles.login_signup_form_container}>
          <div className={styles.notes}>
            <Link href='/privacy'>
              <a target='_blank'>利用規約</a>
            </Link>
            、
            <Link href='/privacy'>
              <a target='_blank'>プライバシーポリシー</a>
            </Link>
            をお読みいただき、同意の上登録してください。{sendEmail}
          </div>
          <div className={styles.form_login_sns}>
            <div className={styles.form_header_sns}>SNSで会員登録</div>
            <button className={styles.btn_login_twitter}>
              Twitterで会員登録
              <span>
                <Twitter />
              </span>
            </button>
            <button className={styles.btn_login_line}>
              LINEで会員登録
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
            <div className={styles.form_header_mail}>メールで会員登録</div>
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
            <div className={styles.input_error}>{errorEmail}</div>
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
            <div className={styles.input_error}>{errorPassword}</div>
            <span className={styles.input_password_container}>
              <input
                className={styles.input_password}
                type='password'
                name='password2'
                placeholder='同じパスワードを再入力'
                onChange={(e) => setPassword2(e.target.value)}
              />
              <span>
                <Password />
              </span>
            </span>
            <div className={styles.input_error}>{errorPassword2}</div>
            <button
              className={
                checkEmail && checkPassword && checkPassword2
                  ? styles.btn_login_mail_active
                  : styles.btn_login_mail
              }
              onClick={() => signUp()}
            >
              確認メールを送信
              <span>
                <Mail />
              </span>
            </button>
            <Link href='/login'>
              <a>
                <button className={styles.btn_link_signup}>ログインはこちら</button>
              </a>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
