import styles from '../../styles/Login.module.css'
import { AuthContext } from '../../components/auth/AuthContext'
import { ModalContext } from '../../components/modal/ModalContext'
import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Link from 'next/dist/client/link'
import Title from '../../components/view/title'
import Form from '../../components/form/Form'
import InputLabel from '../../components/form/InputLabel'
import InputText from '../../components/form/InputText'
import SubmitButton from '../../components/form/SubmitButton'
import Twitter from '../../components/form/SocialButton'
import Line from '../../components/form/SocialButton'
import Google from '../../components/form/SocialButton'
import Yahoo from '../../components/form/SocialButton'
import { validateEmail, validatePassword } from '../../components/Validation'
import { login } from '../../components/firebase'
import { useRouter } from 'next/router'
import type { GetServerSideProps, NextPage } from 'next'
import nookies from 'nookies'
import { firebaseAdmin } from '../../components/firebaseAdmin'
import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  TwitterAuthProvider,
  getAdditionalUserInfo,
} from 'firebase/auth'
import { supabase } from '../../components/supabase'
import { authTwitter } from '../../components/auth/AuthTwitter'
import Loading from '../../components/modal/Loading'
import { User } from '../../components/types'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx)
  const session = cookies.session || ''

  //セッションIDを検証して、認証情報を取得する
  const user = await firebaseAdmin
    .auth()
    .verifySessionCookie(session, true)
    .catch(() => null)

  //ログイン済みの場合はマイページへ飛ばす
  if (user) {
    return {
      redirect: {
        destination: '/mypage',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

const LogIn = () => {
  const { CurrentUser, setCurrentUser }: any = useContext(AuthContext)

  const { setOpenClearOverlay, setIsLoading }: any = useContext(ModalContext)

  // const [email, setEmail] = useState('')
  // const [errorEmail, setErrorEmail] = useState('')
  // const [validEmail, setValidEmail] = useState(false)
  // const [password, setPassword] = useState('')
  // const [errorPassword, setErrorPassword] = useState('')
  // const [validPassword, setValidPassword] = useState(false)
  // const [isSubmit, setIsSubmit] = useState(false)
  // const [errorSubmit, setErrorSubmit] = useState('')
  // const [isButtonLoading, setIsButtonLoading] = useState(false)

  const auth = getAuth()
  const router = useRouter()

  const provider = new TwitterAuthProvider()

  //
  const loginTwitter = async () => {
    console.log('setAuthProvidertwitter')
    await signInWithRedirect(auth, provider)
  }

  const loginSupabase = async () => {
    const { user, session, error } = await supabase.auth.signIn({
      provider: 'twitter',
    })
    if (session) console.log(session)
  }

  const logoutSupabase = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.log(error)
    else console.log('ログアウト完了')
  }

  useEffect(() => {
    const session = supabase.auth.session()
    if (session) console.log(session)
    // getRedirect()
  }, [])

  //各SNSサイトからリダイレクトされてきたか確認する。
  const getRedirect = async () => {
    setIsLoading(true)
    await getRedirectResult(auth)
      .then(async (result) => {
        //リダイレクトされてきた場合の処理。
        if (result) {
          //クッキーにセッションをセットする。
          const id = await result.user.getIdToken()
          await fetch('/api/session', { method: 'POST', body: JSON.stringify({ id }) })

          //アカウントが登録済かを確認する。
          const { data, error } = await supabase
            .from('users')
            .select('user_id, signedup')
            .eq('user_id', result.user.uid)

          //プロフィール画像のURLを取得する。
          const photo =
            String(getAdditionalUserInfo(result)!.profile!.profile_image_url_https).slice(0, -10) +
            'bigger' +
            String(getAdditionalUserInfo(result)!.profile!.profile_image_url_https).slice(-4)

          const user: User = {
            user_id: result.user.uid,
            user_name: result.user.displayName!,
            provider: 0,
            provider_id: getAdditionalUserInfo(result)!.username!,
            photo: photo,
            signedup: false,
          }

          //ユーザー登録済の場合の処理。
          if (data!.length > 0) {
            const { data, error } = await supabase
              .from('users')
              .update({
                user_name: result.user.displayName,
                provider: 0,
                provider_id: getAdditionalUserInfo(result)!.username,
                photo: photo,
                email: getAdditionalUserInfo(result)!.profile!.email,
              })
              .match({ user_id: result.user.uid })
            if (error) {
              console.log({ error })
            } else {
              //プロフィールが登録済なら、マイページへ遷移させる。
              if (data![0].signedup == true) {
                user.signedup = true
                setCurrentUser(user)
                router.push('/user/mylist')
              }
              //プロフィールが登録なしなら、プロフィール登録ページへ遷移させる。
              else {
                setCurrentUser(user)
                router.push('/login/profile')
              }
            }

            //ユーザー登録なしの場合の処理。
          } else {
            //ユーザー登録をする。
            const { data, error } = await supabase.from('users').insert([
              {
                user_id: result.user.uid,
                user_name: result.user.displayName,
                provider: 0,
                provider_id: getAdditionalUserInfo(result)!.username,
                photo: photo,
                email: getAdditionalUserInfo(result)!.profile!.email,
              },
            ])
            //プロフィール登録ページへ遷移させる。
            router.push('/login/profile')
          }
          //通常アクセスなら、何もしない。
        } else {
          console.log('getRedirectResult →　result no')
        }
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        const email = error.email
        const credential = TwitterAuthProvider.credentialFromError(error)
        console.log(error)
      })
    setIsLoading(false)
    console.log('setIsLoading(false)')
  }

  //メールアドレス入力のエラーチェック
  // useEffect(() => {
  //   const newErrorEmail = validateEmail(email)
  //   setErrorEmail(newErrorEmail)
  //   if (email.length > 0 && errorEmail == '') setValidEmail(true)
  //   else setValidEmail(false)
  // }, [email])

  //パスワード入力のエラーチェック
  // useEffect(() => {
  //   const newErrorPassword = validatePassword(password)
  //   setErrorPassword(newErrorPassword)
  //   if (password.length > 0 && newErrorPassword == '') setValidPassword(true)
  //   else setValidPassword(false)
  // }, [password])

  //全ての入力のバリデーションがtrueならボタンをアクティブにする
  // useEffect(() => {
  //   if (validEmail && validPassword) setIsSubmit(true)
  //   else setIsSubmit(false)
  // }, [validEmail, validPassword])

  //「メールアドレスでログイン」ボタンを押下
  // const submitLogin = async () => {
  //   setIsButtonLoading(true)
  //   setOpenClearOverlay(true)
  //   setErrorSubmit('')
  //   const uid = await login(email, password).catch((error) => {
  //     if (error == 'FirebaseError: Firebase: Error (auth/wrong-password).')
  //       setErrorSubmit('メールアドレスまたはパスワードが間違っています。')
  //     else setErrorSubmit('エラーが発生しました。しばらく経ってからもう一度お試しください。')
  //     return
  //   })
  //   if (uid) {
  //     setCurrentUser(uid)
  //     router.push('/mypage')
  //   }
  //   setIsButtonLoading(false)
  //   setOpenClearOverlay(false)
  // }

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
        <Form>
          <InputLabel label='SNSアカウントでログイン' />
          <div className={styles.inputContainer}>
            <Twitter provider='Twitter' type='signin' auth={loginTwitter} />
            <Line provider='LINE' type='signin' auth={loginSupabase} />
            <Google provider='Google' type='signin' auth={logoutSupabase} />
            <Yahoo provider='Yahoo' type='signin' />
          </div>
          {/* <InputLabel label='メールアドレスでログイン' />
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
          <div className={styles.forgot_password}>
            <Link href='/signup/password'>
              <a>パスワードを忘れた場合</a>
            </Link>
          </div>
          <SubmitButton
            isSubmit={isSubmit}
            isButtonLoading={isButtonLoading}
            type='email'
            title='メールアドレスでログイン'
            onClick={() => submitLogin()}
            error={errorSubmit}
          />
          <Link href='/signup'>
            <a>
              <button className={styles.btn_link_signup}>会員登録はこちら</button>
            </a>
          </Link> */}
        </Form>
      </main>
      <Loading />
    </>
  )
}

export default LogIn
