import styles from '../../styles/Login.module.css'
import Twitter from '../../../public/images/twitter.svg'
import Line from '../../../public/images/line.svg'
import { AuthContext } from '../../components/auth/AuthContext'
import { useState, useEffect, useRef, useCallback, useContext, ChangeEvent } from 'react'
import { supabase } from '../../components/supabase'
import { ModalContext } from '../../components/modal/ModalContext'
import Head from 'next/head'
import Link from 'next/dist/client/link'
import SubmitButton from '../../components/form/SubmitButton'
import InputText from '../../components/form/InputText'
import { validateEmail, validatePassword } from '../../components/Validation'
import { login } from '../../components/firebase'
import { useRouter } from 'next/router'
import Title from '../../components/view/title'

const LogIn = () => {
  const { user, setUser, session, signOut }: any = useContext(AuthContext)

  const { setOpenClearOverlay }: any = useContext(ModalContext)

  const [email, setEmail] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [password, setPassword] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState('')
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [testJson, setTestJson] = useState('')

  //メールアドレス入力のエラーチェック
  useEffect(() => {
    const newErrorEmail = validateEmail(email)
    setErrorEmail(newErrorEmail)
    if (email.length > 0 && errorEmail == '') setValidEmail(true)
    else setValidEmail(false)
  }, [email])

  //パスワード入力のエラーチェック
  useEffect(() => {
    const newErrorPassword = validatePassword(password)
    setErrorPassword(newErrorPassword)
    if (password.length > 0 && newErrorPassword == '') setValidPassword(true)
    else setValidPassword(false)
  }, [password])

  //全ての入力のバリデーションがtrueならボタンをアクティブにする
  useEffect(() => {
    if (validEmail && validPassword) setIsSubmit(true)
    else setIsSubmit(false)
  }, [validEmail, validPassword])
  const router = useRouter()

  //「メールアドレスでログイン」ボタンを押下
  const logIn = async () => {
    setIsButtonLoading(true)
    setOpenClearOverlay(true)
    setErrorSubmit('')
    const uid = await login(email, password).catch((error) => {
      if (error == 'FirebaseError: Firebase: Error (auth/wrong-password).')
        setErrorSubmit('メールアドレスまたはパスワードが間違っています。')
      else setErrorSubmit('エラーが発生しました。しばらく経ってからもう一度お試しください。')
      setIsButtonLoading(false)
      setOpenClearOverlay(false)
      return
    })
    if (uid) {
      setUser(uid)
      router.push('/mypage')
    }
    setIsButtonLoading(false)
    setOpenClearOverlay(false)

    // setIsButtonLoading(true)
    // setOpenClearOverlay(true)
    // setErrorSubmit('')
    // if (validEmail && validPassword) {
    //   const { error, data } = await supabase.auth.signIn({ email, password })
    //   if (error) {
    //     if (error.message == 'Invalid login credentials') {
    //       setErrorSubmit('メールアドレスまたはパスワードが間違っています。')
    //       setIsButtonLoading(false)
    //       setOpenClearOverlay(false)
    //     } else {
    //       setErrorSubmit('エラーが発生しました。しばらく経ってからもう一度お試しください。')
    //       setIsButtonLoading(false)
    //       setOpenClearOverlay(false)
    //     }
    //   }
    // }
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

      <main className={styles.main}>
        <Title title='ログイン' />
        <div className={styles.form_container}>
          <div className={styles.input_header}>SNSアカウントでログイン</div>
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
          <div className={styles.input_header}>メールアドレスでログイン</div>
          <InputText
            valid={validEmail}
            name='email'
            type='text'
            placeholder='メールアドレス'
            onChange={setEmail}
            error={errorEmail}
          />
          <InputText
            valid={validPassword}
            name='password'
            type='password'
            placeholder='パスワード'
            onChange={setPassword}
            error={errorPassword}
          />
          <div className={styles.input_notes}>
            <Link href='/signup/password'>
              <a>パスワードを忘れた場合</a>
            </Link>
          </div>
          <SubmitButton
            isSubmit={isSubmit}
            isButtonLoading={isButtonLoading}
            type='email'
            title='メールアドレスでログイン'
            onClick={() => logIn()}
            error={errorSubmit}
          />
          <Link href='/signup'>
            <a>
              <button className={styles.btn_link_signup}>会員登録はこちら</button>
            </a>
          </Link>
        </div>
      </main>
    </>
  )
}

export default LogIn
