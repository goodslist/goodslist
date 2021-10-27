import Link from 'next/dist/client/link'
import styles from '../styles/Navber.module.css'
import React from 'react'
import { useContext } from 'react'
import { ModalContext } from './modal/ModalContext'

export default function Navbar(props: any) {
  const { openModalFlag, setOpenModalFlag, openModal }: any = useContext(ModalContext)
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
            <div className={styles.login_button}>ログイン / 新規登録</div>
          </a>
        </Link>
      </div>
    </div>
  )
}
