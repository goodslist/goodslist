import Link from 'next/dist/client/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef, useCallback, useContext } from 'react'
import Line from '../../../public/images/line.svg'
import Mail from '../../../public/images/mail.svg'
import Password from '../../../public/images/password.svg'
import Twitter from '../../../public/images/twitter.svg'
import { ModalContext } from '../../components/modal/ModalContext'
import { SignUpContext } from '../../components/signup/SignUpContext'
import styles from '../../styles/Login.module.css'
import { supabase } from '../../components/supabase'
import Modal from '../../components/modal/Modal'
import BtnSpinner from '../../components/Spinner'

export default function SignUp(): JSX.Element {
  const router = useRouter()

  const {
    openModalFlag,
    setOpenModalFlag,
    modalType,
    openModalContentFlag,
    setOpenModalContentFlag,
    setShowLogin,
  }: any = useContext(ModalContext)

  const { setSendEmail }: any = useContext(SignUpContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [isNewEmail, setIsNewEmail] = useState()
  const [errorPassword, setErrorPassword] = useState('')
  const [errorPassword2, setErrorPassword2] = useState('')
  const [checkEmail, setCheckEmail] = useState(false)
  const [checkPassword, setCheckPassword] = useState(false)
  const [checkPassword2, setCheckPassword2] = useState(false)
  const [errorSignUp, setErrorSignUp] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  let createErrorEmail = ''
  let createErrorPassword = ''
  let createErrorPassword2 = ''

  const signUp = async () => {
    if (checkEmail && checkPassword && checkPassword2) {
      setIsLoading(true)

      const { error, data } = await supabase.auth.signUp({ email, password })
      if (error) {
        setIsLoading(false)
        setErrorSignUp('エラーが発生しました。しばらく経ってからもう一度お試しください。')
        console.log({ error })
      } else {
        console.log({ data })
        setSendEmail(email)
        router.push({
          pathname: '/signup/submit',
        })
      }
    }
  }

  //メールアドレス入力のエラーチェック
  useEffect(() => {
    createErrorEmail = ''
    if (email.length > 0) {
      if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
        createErrorEmail = createErrorEmail + 'メールアドレスの形式で入力してください。'
      }
      if (email.length > 257) {
        createErrorEmail = createErrorEmail + '256文字以下で入力してください。'
      }
      setErrorEmail(createErrorEmail)
      if (createErrorEmail == '') setCheckEmail(true)
      else setCheckEmail(false)
    } else {
      createErrorEmail = ''
      setErrorEmail(createErrorEmail)
      setCheckEmail(false)
    }
  }, [email])

  //メールアドレスの重複チェック
  // useEffect(() => {
  //   const checkSignedUp = async () => {
  //     const { data: signed_up_email, error } = await supabase
  //       .from('signed_up')
  //       .select('email')
  //       .eq('email', email)
  //       .single()
  //     if (signed_up_email) {
  //       setErrorEmail('このメールアドレスは既に登録があります。')
  //       setCheckEmail(false)
  //     }
  //   }
  //   checkSignedUp()
  // }, [email])

  //パスワード入力のエラーチェック
  useEffect(() => {
    createErrorPassword = ''
    if (password.length > 0) {
      if (!password.match(/^[A-Za-z0-9]*$/)) {
        createErrorPassword = createErrorPassword + '半角英数字で入力してください。'
      }
      if (password.length < 8 || password.length > 32) {
        createErrorPassword = createErrorPassword + '8文字以上32文字以下で入力してください。'
      }
      setErrorPassword(createErrorPassword)
      if (createErrorPassword == '') setCheckPassword(true)
      else setCheckPassword(false)
    } else {
      createErrorPassword = ''
      setErrorPassword(createErrorPassword)
    }
  }, [password])

  //確認用パスワード入力のエラーチェック
  useEffect(() => {
    createErrorPassword2 = ''
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
      if (createErrorPassword2 == '') setCheckPassword2(true)
      else setCheckPassword2(false)
    } else {
      createErrorPassword2 = ''
      setErrorPassword2(createErrorPassword2)
    }
  }, [password, password2])

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

      <main className={styles.main}>
        <div className={styles.content_title}>
          <span>会員登録</span>
        </div>
        <div className={styles.login_signup_form_container}>
          <div className={styles.notes}>
            当サイトのコンテンツは全て無料でご利用いただけます。
            <br />
            <Link href='/privacy'>
              <a target='_blank'>利用規約</a>
            </Link>
            、
            <Link href='/privacy'>
              <a target='_blank'>プライバシーポリシー</a>
            </Link>
            をお読みいただき、同意の上ご登録ください。
          </div>
          <div className={styles.form_login_sns}>
            <div className={styles.form_header_sns}>SNSアカウントで会員登録</div>
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
            <div className={styles.form_header_mail}>メールアドレスで会員登録</div>
            <span
              className={
                checkEmail ? styles.input_mail_container_checked : styles.input_mail_container
              }
            >
              <input
                className={checkEmail ? styles.input_mail_checked : styles.input_mail}
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
            <span
              className={
                checkPassword
                  ? styles.input_password_container_checked
                  : styles.input_password_container
              }
            >
              <input
                className={checkPassword ? styles.input_password_checked : styles.input_password}
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
            <div className={styles.input_notes}>半角英数字、8文字以上32文字以下。</div>
            <span
              className={
                checkPassword2
                  ? styles.input_password_container_checked
                  : styles.input_password_container
              }
            >
              <input
                className={checkPassword2 ? styles.input_password_checked : styles.input_password}
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
              <div className={isLoading ? styles.btn_spinner_active : styles.btn_spinner}>
                <BtnSpinner />
              </div>
            </button>
            <div className={styles.input_error}>{errorSignUp}</div>
            <Link href='/login'>
              <a>
                <button className={styles.btn_link_signup}>ログインはこちら</button>
              </a>
            </Link>
          </div>
        </div>
      </main>
      <Modal />
    </>
  )
}
