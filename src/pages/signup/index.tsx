import Link from 'next/dist/client/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { ModalContext } from '../../components/modal/ModalContext'
import { SignUpContext } from '../../components/signup/SignUpContext'
import styles from '../../styles/Login.module.css'
import { supabase } from '../../components/supabase'
import Modal from '../../components/modal/Modal'
import Form from '../../components/form/Form'
import InputLabel from '../../components/form/InputLabel'
import InputText from '../../components/form/InputText'
import InputNotes from '../../components/form/InputNotes'
import SubmitButton from '../../components/form/SubmitButton'
import Twitter from '../../components/form/SocialButton'
import Line from '../../components/form/SocialButton'
import { validateEmail, validatePassword, validatePassword2 } from '../../components/Validation'
import Title from '../../components/view/title'
import { signup } from '../../components/firebase'

export default function SignUp(): JSX.Element {
  const router = useRouter()

  const {
    openModalFlag,
    setOpenModalFlag,
    modalType,
    openModalContentFlag,
    setOpenModalContentFlag,
    setShowLogin,
    setOpenClearOverlay,
  }: any = useContext(ModalContext)

  const { setSendEmail }: any = useContext(SignUpContext)

  const [email, setEmail] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [password, setPassword] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [password2, setPassword2] = useState('')
  const [errorPassword2, setErrorPassword2] = useState('')
  const [validPassword2, setValidPassword2] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState('')
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [isNewEmail, setIsNewEmail] = useState()

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

  //確認用パスワード入力のエラーチェック
  useEffect(() => {
    const newErrorPassword2 = validatePassword2(password, password2)
    setErrorPassword2(newErrorPassword2)
    if (password2.length > 0 && newErrorPassword2 == '') setValidPassword2(true)
    else setValidPassword2(false)
  }, [password, password2])

  //全ての入力のバリデーションがtrueならボタンをアクティブにする
  useEffect(() => {
    if (validEmail && validPassword && validPassword2) setIsSubmit(true)
    else setIsSubmit(false)
  }, [validEmail, validPassword, validPassword2])

  //「確認メールを送信」ボタンを押下
  const submitSignup = async () => {
    if (validEmail && validPassword && validPassword2) {
      setIsButtonLoading(true)
      setOpenClearOverlay(true)
      // const res = await fetch(
      //   `https://asia-northeast1-goodslist-2169c.cloudfunctions.net/helloWorld`,
      // )
      // const data = await res.json()

      // if (data) {
      //   alert(data)
      // }
      // false
      // alert('失敗')

      const result = await signup(email, password).catch((error) => {
        if (error)
          setErrorSubmit('エラーが発生しました。しばらく経ってからもう一度お試しください。')
      })
      // if (result) setErrorSubmit('エラーが発生しました。しばらく経ってからもう一度お試しください。')
      // else {
      //   setSendEmail(email)
      //   router.push('/signup/submit')
      // }
    }
    setIsButtonLoading(false)
    setOpenClearOverlay(false)
  }

  //メールアドレスの重複チェック
  // useEffect(() => {
  //   const validSignedUp = async () => {
  //     const { data: signed_up_email, error } = await supabase
  //       .from('signed_up')
  //       .select('email')
  //       .eq('email', email)
  //       .single()
  //     if (signed_up_email) {
  //       setErrorEmail('このメールアドレスは既に登録があります。')
  //       setValidEmail(false)
  //     }
  //   }
  //   validSignedUp()
  // }, [email])

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
        <Title title='会員登録' />
        <Form>
          <div className={styles.notes}>
            当サイトは全て無料でご利用いただけます。
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
          <InputLabel label='SNSアカウントで会員登録' />
          <Twitter provider='Twitter' type='signup' />
          <Line provider='LINE' type='signup' />
          <InputLabel label='メールアドレスで会員登録' />
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
          <InputNotes notes='半角英数字、8文字以上32文字以下。' />
          <InputText
            valid={validPassword2}
            name='password2'
            type='password'
            placeholder='同じパスワードを再入力'
            onChange={setPassword2}
            error={errorPassword2}
          />
          <SubmitButton
            isSubmit={isSubmit}
            isButtonLoading={isButtonLoading}
            type='email'
            title='確認メールを送信'
            onClick={() => submitSignup()}
            error={errorSubmit}
          />
          <Link href='/login'>
            <a>
              <button className={styles.btn_link_signup}>ログインはこちら</button>
            </a>
          </Link>
        </Form>
      </main>
      <Modal />
    </>
  )
}
