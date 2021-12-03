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
  User,
} from 'firebase/auth'
import { supabase } from '../../components/supabase'

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

  const auth = getAuth()

  const provider = new TwitterAuthProvider()

  useEffect(() => {
    abcbc()
  }, [])

  const abcbc = async () => {
    await getRedirectResult(auth)
      .then((result) => {
        const user = result?.user
        console.log(user!.uid)
        console.log(getAdditionalUserInfo(result!))
        console.log('b')
        getIdToken(result)
        // if (user) checkSignuped(result)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        const email = error.email
        const credential = TwitterAuthProvider.credentialFromError(error)
        alert('error')
      })
  }

  {
    /* {console.log(currentUser.photoURL.slice(0, -10) + 'bigger.png')} */
  }
  const checkSignuped = async (result: any) => {}

  const getIdToken = async (result: any) => {
    const id = await result.user.getIdToken()
    console.log('e')

    const user_id = result.user.uid
    const user_name = result.user.displayName
    const providerId = getAdditionalUserInfo(result)!.username
    const photo =
      String(getAdditionalUserInfo(result)!.profile!.profile_image_url_https).slice(0, -10) +
      'bigger.jpg' +
      String(getAdditionalUserInfo(result)!.profile!.profile_image_url_https).slice(-4, 4)
    const email = getAdditionalUserInfo(result)!.profile!.email
    console.log('d')
    localStorage.setItem('photo', photo)
    // Cookieにセッションを付与するようにAPIを投げる
    await fetch('/api/session', { method: 'POST', body: JSON.stringify({ id, photo }) })
    console.log('f')

    const { data, error } = await supabase.from('users').select('user_id').eq('user_id', user_id)
    if (data!.length > 0) {
      console.log('あったよ' + data!.length)
      router.push('/mypage')
    } else {
      console.log('なかったよ')

      const { data, error } = await supabase.from('users').insert([
        {
          user_id: user_id,
          user_name: user_name,
          provider: 0,
          provider_id: providerId,
          photo: photo,
          email: email,
        },
      ])
      console.log('supabase登録済')
      router.push('/signup/profile')
    }
  }
  // useEffect(() => {
  //   if (CurrentUser) setCurrentUser('')
  //   console.log('ログインエフェクト')
  // }, [])

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
  const submitLogin = async () => {
    setIsButtonLoading(true)
    setOpenClearOverlay(true)
    setErrorSubmit('')
    const uid = await login(email, password).catch((error) => {
      if (error == 'FirebaseError: Firebase: Error (auth/wrong-password).')
        setErrorSubmit('メールアドレスまたはパスワードが間違っています。')
      else setErrorSubmit('エラーが発生しました。しばらく経ってからもう一度お試しください。')
      return
    })
    if (uid) {
      setCurrentUser(uid)
      router.push('/mypage')
    }
    setIsButtonLoading(false)
    setOpenClearOverlay(false)
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
        <Form>
          <InputLabel label='SNSアカウントでログイン' />
          <div className={styles.inputContainer}>
            <Twitter provider='Twitter' type='signin' />
            <Line provider='LINE' type='signin' />
            <Google provider='Google' type='signin' />
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
    </>
  )
}

export default LogIn

// import styles from '../../styles/Login.module.css'
// import { AuthContext } from '../../components/auth/AuthContext'
// import { ModalContext } from '../../components/modal/ModalContext'
// import { useState, useEffect, useContext } from 'react'
// import Head from 'next/head'
// import Link from 'next/dist/client/link'
// import Title from '../../components/view/title'
// import Form from '../../components/form/Form'
// import InputLabel from '../../components/form/InputLabel'
// import InputText from '../../components/form/InputText'
// import SubmitButton from '../../components/form/SubmitButton'
// import Twitter from '../../components/form/SocialButton'
// import Line from '../../components/form/SocialButton'
// import { validateEmail, validatePassword } from '../../components/Validation'
// import { login } from '../../components/firebase'
// import { useRouter } from 'next/router'
// import type { GetServerSideProps, NextPage } from 'next'
// import nookies from 'nookies'
// import { firebaseAdmin } from '../../components/firebaseAdmin'
// import {
//   getAuth,
//   signInWithRedirect,
//   getRedirectResult,
//   TwitterAuthProvider,
//   getAdditionalUserInfo,
//   User,
// } from 'firebase/auth'
// import { supabase } from '../../components/supabase'

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const cookies = nookies.get(ctx)
//   const session = cookies.session || ''

//   //セッションIDを検証して、認証情報を取得する
//   const user = await firebaseAdmin
//     .auth()
//     .verifySessionCookie(session, true)
//     .catch(() => null)

//   //ログイン済みの場合はマイページへ飛ばす
//   if (user) {
//     return {
//       redirect: {
//         destination: '/mypage',
//         permanent: false,
//       },
//     }
//   }

//   return {
//     props: {},
//   }
// }

// const LogIn = () => {
//   const { CurrentUser, setCurrentUser }: any = useContext(AuthContext)

//   const { setOpenClearOverlay }: any = useContext(ModalContext)

//   const [email, setEmail] = useState('')
//   const [errorEmail, setErrorEmail] = useState('')
//   const [validEmail, setValidEmail] = useState(false)
//   const [password, setPassword] = useState('')
//   const [errorPassword, setErrorPassword] = useState('')
//   const [validPassword, setValidPassword] = useState(false)
//   const [isSubmit, setIsSubmit] = useState(false)
//   const [errorSubmit, setErrorSubmit] = useState('')
//   const [isButtonLoading, setIsButtonLoading] = useState(false)

//   const auth = getAuth()

//   const provider = new TwitterAuthProvider()

//   useEffect(() => {
//     abcbc()
//     console.log('a')
//   }, [])

//   const abcbc = async () => {
//     await getRedirectResult(auth)
//       .then((result) => {
//         const credential = TwitterAuthProvider.credentialFromResult(result!)

//         const token = credential?.accessToken
//         const secret = credential?.secret
//         const user = result?.user
//         console.log(user!.uid)
//         if (user) checkSignuped(result)
//         console.log(getAdditionalUserInfo(result!))
//         getIdToken(result)
//         console.log('finak希望')
//       })
//       .catch((error) => {
//         const errorCode = error.code
//         const errorMessage = error.message
//         const email = error.email
//         const credential = TwitterAuthProvider.credentialFromError(error)
//         alert('error')
//       })
//   }

//   {
//     /* {console.log(currentUser.photoURL.slice(0, -10) + 'bigger.png')} */
//   }
//   const checkSignuped = async (result: any) => {
//     const user_id = result.user.uid

//     const { data, error } = await supabase.from('users').select('user_id').eq('user_id', user_id)
//     if (data!.length) console.log('あったよ' + data!.length)
//     else {
//       console.log('なかったよ')
//       const user_name = result.user.displayName
//       const providerId = getAdditionalUserInfo(result)!.username
//       const photo = getAdditionalUserInfo(result)!.profile!.profile_image_url_https
//       const email = getAdditionalUserInfo(result)!.profile!.email
//       const { data, error } = await supabase.from('users').insert([
//         {
//           user_id: user_id,
//           user_name: user_name,
//           provider: 0,
//           provider_id: providerId,
//           photo: photo,
//           email: email,
//         },
//       ])
//       console.log('supabase登録済')
//     }
//   }

//   const getIdToken = async (result: any) => {
//     const id = await result.user.getIdToken()
//     console.log('e')
//     // Cookieにセッションを付与するようにAPIを投げる
//     await fetch('/api/session', { method: 'POST', body: JSON.stringify({ id }) })
//     console.log('f')
//   }
//   // useEffect(() => {
//   //   if (CurrentUser) setCurrentUser('')
//   //   console.log('ログインエフェクト')
//   // }, [])

//   //メールアドレス入力のエラーチェック
//   useEffect(() => {
//     const newErrorEmail = validateEmail(email)
//     setErrorEmail(newErrorEmail)
//     if (email.length > 0 && errorEmail == '') setValidEmail(true)
//     else setValidEmail(false)
//   }, [email])

//   //パスワード入力のエラーチェック
//   useEffect(() => {
//     const newErrorPassword = validatePassword(password)
//     setErrorPassword(newErrorPassword)
//     if (password.length > 0 && newErrorPassword == '') setValidPassword(true)
//     else setValidPassword(false)
//   }, [password])

//   //全ての入力のバリデーションがtrueならボタンをアクティブにする
//   useEffect(() => {
//     if (validEmail && validPassword) setIsSubmit(true)
//     else setIsSubmit(false)
//   }, [validEmail, validPassword])
//   const router = useRouter()

//   //「メールアドレスでログイン」ボタンを押下
//   const submitLogin = async () => {
//     setIsButtonLoading(true)
//     setOpenClearOverlay(true)
//     setErrorSubmit('')
//     const uid = await login(email, password).catch((error) => {
//       if (error == 'FirebaseError: Firebase: Error (auth/wrong-password).')
//         setErrorSubmit('メールアドレスまたはパスワードが間違っています。')
//       else setErrorSubmit('エラーが発生しました。しばらく経ってからもう一度お試しください。')
//       return
//     })
//     if (uid) {
//       setCurrentUser(uid)
//       router.push('/mypage')
//     }
//     setIsButtonLoading(false)
//     setOpenClearOverlay(false)
//   }

//   return (
//     <>
//       <Head>
//         <title>Goodsist イベントのグッズ代が計算できるWEBアプリ</title>
//         <meta name='description' content='Generated by create next app' />
//         <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0' />
//         <link rel='icon' href='/favicon.ico' />
//         <link
//           href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap&text=Goodsist'
//           rel='stylesheet'
//         />
//       </Head>

//       <main className={styles.main}>
//         <Title title='ログイン' />
//         <Form>
//           <InputLabel label='SNSアカウントでログイン' />
//           <Twitter provider='Twitter' type='signin' />
//           <Line provider='LINE' type='signin' />
//           <InputLabel label='メールアドレスでログイン' />
//           <InputText
//             valid={validEmail}
//             name='email'
//             type='text'
//             placeholder='メールアドレス'
//             onChange={setEmail}
//             error={errorEmail}
//           />
//           <InputText
//             valid={validPassword}
//             name='password'
//             type='password'
//             placeholder='パスワード'
//             onChange={setPassword}
//             error={errorPassword}
//           />
//           <div className={styles.forgot_password}>
//             <Link href='/signup/password'>
//               <a>パスワードを忘れた場合</a>
//             </Link>
//           </div>
//           <SubmitButton
//             isSubmit={isSubmit}
//             isButtonLoading={isButtonLoading}
//             type='email'
//             title='メールアドレスでログイン'
//             onClick={() => submitLogin()}
//             error={errorSubmit}
//           />
//           <Link href='/signup'>
//             <a>
//               <button className={styles.btn_link_signup}>会員登録はこちら</button>
//             </a>
//           </Link>
//         </Form>
//       </main>
//     </>
//   )
// }

// export default LogIn
