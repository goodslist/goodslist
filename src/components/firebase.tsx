import type { FirebaseApp } from 'firebase/app'
import type { Auth as FirebaseAuth } from 'firebase/auth'
import { getApps, initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

/**
 * @description Firebaseの管理画面から取得したAPIオブジェクト
 * @note 環境変数は`.env.local`ファイルに定義しています
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

/**
 * @description FirebaseAppを返す
 */
export const getFirebaseApp = (): FirebaseApp | undefined => {
  if (typeof window === 'undefined') return // バックエンドで実行されないようにする

  return getApps()[0] || initializeApp(firebaseConfig)
}

/**
 * @description FirebaseAuthを返す
 */
export const getFirebaseAuth = (): FirebaseAuth => {
  return getAuth(getFirebaseApp())
}

/**
 * @description メールアドレスとパスワードで新規会員登録
 */
export const signup = async (email: string, password: string) => {
  // FirebaseAuthを取得する
  const auth = getFirebaseAuth()
  alert('signup')

  let result
  await createUserWithEmailAndPassword(auth, email, password)
    // .then(() => {
    //   auth.onAuthStateChanged((user) => {
    //     if (user) {
    //       // 認証メールを送る場合はこの関数を使う。
    //       // user.sendEmailVerification()
    //     }
    //   })
    // })
    .then(() => {})
    .catch((error) => {
      result = error
      return
    })
  return result
}

/**
 * @description メールアドレスとパスワードでログイン
 */
export const login = async (email: string, password: string) => {
  // FirebaseAuthを取得する
  const auth = getFirebaseAuth()

  // メールアドレスとパスワードでログインする
  const result = await signInWithEmailAndPassword(auth, email, password)

  // セッションIDを作成するためのIDを作成する
  if (result) {
    const id = await result.user.getIdToken()
    console.log(result.user.uid)

    // Cookieにセッションを付与するようにAPIを投げる
    await fetch('/api/session', { method: 'POST', body: JSON.stringify({ id }) })
    return result.user.uid
  } else return result
}

/**
 * @description ログアウトさせる
 */
export const logout = async () => {
  // セッションCookieを削除するため、Firebase SDKでなくREST APIでログアウトさせる
  await fetch('/api/sessionLogout', { method: 'POST' })
}
