import Link from 'next/dist/client/link'
import styles from '../styles/Header.module.css'
import React from 'react'
import { useContext } from 'react'
import { AuthContext } from './auth/AuthContext'
import { useRouter } from 'next/router'

export default function Header() {
  const { currentUser }: any = useContext(AuthContext)
  const router = useRouter()

  return (
    <div className={styles.header_container}>
      <div className={styles.header}>
        <div className={styles.logo_container}>
          <Link href='/'>
            <a>
              <p className={styles.logo}>
                <span>G</span>
                oods List{currentUser}
              </p>
            </a>
          </Link>
        </div>
        {(() => {
          if (currentUser) {
            return (
              <Link href='/mypage'>
                <a>
                  <div className={styles.btn_login}>マイページ</div>
                </a>
              </Link>
            )
          } else if (router.pathname == '/login' || router.pathname == '/signup') {
            return (
              <Link href={router.pathname == '/login' ? '/signup' : '/login'}>
                <a>
                  <div className={styles.btn_login_link}>
                    {router.pathname == '/login' ? '会員登録' : 'ログイン'}
                  </div>
                </a>
              </Link>
            )
          } else {
            return (
              <Link href={router.pathname == '/login' ? '/signup' : '/login'}>
                <a>
                  <div className={styles.btn_login}>ログイン</div>
                </a>
              </Link>
            )
          }
        })()}
      </div>
    </div>
  )
}

{
  /* <div className={styles.login_button} onClick={() => setOpenModalFlag(true)}>
{user ? user.user_name : 'ログイン / 新規登録'}
</div> */
}
