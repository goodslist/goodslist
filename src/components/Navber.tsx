import Link from 'next/dist/client/link'
import styles from '../styles/Navber.module.css'
import React from 'react'
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
        <div className={styles.login_container}>ログイン</div>
        <div className={styles.signup_container}>新規登録</div>
      </div>
    </div>
  )
}
