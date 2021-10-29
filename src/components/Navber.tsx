import Link from 'next/dist/client/link'
import styles from '../styles/Navber.module.css'
import React from 'react'
import { useContext } from 'react'
import { ModalContext } from './modal/ModalContext'
import { AuthContext } from '../components/auth/AuthContext'
import { useRouter } from 'next/router'

export default function Navbar(props: any) {
  const { user, session, signOut }: any = useContext(AuthContext)
  const { openModal }: any = useContext(ModalContext)
  const router = useRouter()
  if (router.pathname != '/signup') {
    if (user?.sign_up == false) {
      router.replace('/signup')
    }
  }
  //親から送られてきた関数を実行
  const clickLoginButton = () => {
    openModal('login')
  }

  return (
    <div className={styles.header_container}>
      <div className={styles.header}>
        <div className={styles.logo_container}>
          <Link href='/'>
            <a>
              <p className={styles.logo}>
                <span>G</span>oodsist
              </p>
            </a>
          </Link>
        </div>
        <Link href='/login/'>
          <a>
            <div className={styles.login_button}>
              {user ? user.user_name : 'ログイン / 新規登録'}
            </div>
          </a>
        </Link>
      </div>
    </div>
  )
}
