import Link from 'next/dist/client/link'
import styles from '../styles/Navber.module.css'
import React from 'react'
import Login from '../pages/img/login.svg'
import Sign_up from '../pages/img/sign_up.svg'
export default function Navbar() {
  return (
    <div className={styles.header_container}>
      <div className={styles.header}>
        <div className={styles.logo_container}>
          <Link href='/'>
            <a>
              <p className={styles.logo}>Goodsist</p>
            </a>
          </Link>
        </div>
        <div className={styles.login_sign_up_container}>
          <div className={styles.login}>
            <span>
              <Login />
            </span>
            ログイン
          </div>
          <div className={styles.sign_up}>
            <span>
              <Sign_up />
            </span>
            新規登録
          </div>
        </div>
      </div>
    </div>
  )
}
