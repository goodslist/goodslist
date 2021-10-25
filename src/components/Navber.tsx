import Link from 'next/dist/client/link'
import styles from '../styles/Navber.module.css'
import React from 'react'
import { useContext } from 'react'
import { ModalContext } from './modal/ModalContext'

export default function Navbar(props: any) {
  const { openModal, setOpenModal }: any = useContext(ModalContext)
  console.log(openModal)
  //親から送られてきた関数を実行
  const clickNavLogin = () => {
    setOpenModal(true)
    console.log('1')
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
        <div className={styles.login_sign_up_container} onClick={clickNavLogin}>
          ログイン / 新規登録
        </div>
      </div>
    </div>
  )
}
