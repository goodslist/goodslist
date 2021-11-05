import Link from 'next/dist/client/link'
import styles from '../styles/Navber.module.css'
import React from 'react'
import { useEffect, useRef, useState, useContext } from 'react'
import { ModalContext } from './modal/ModalContext'
import { AuthContext } from '../components/auth/AuthContext'
import { useRouter } from 'next/router'
// import Modal from './modal/Modal'
import Modal from '../components/modal/Modal'

export default function Navbar(props: any) {
  const { user, session, signOut }: any = useContext(AuthContext)
  const {
    openModalFlag,
    setOpenModalFlag,
    openModalContentFlag,
    setOpenModalContentFlag,
    setShowLogin,
    setModalType,
  }: any = useContext(ModalContext)
  const router = useRouter()
  if (router.pathname != '/signup') {
    if (user?.sign_up == false) {
      router.replace('/signup')
    }
  }

  const onClickLogin = () => {
    setModalType('login')
    setOpenModalFlag(true)
    setShowLogin(true)
    setOpenModalContentFlag(true)
  }
  return (
    <div className={styles.header_container}>
      <div className={styles.header}>
        <div className={styles.logo_container}>
          <Link href='/'>
            <a>
              <p className={styles.logo}>
                <span>G</span>
                oodsist
              </p>
            </a>
          </Link>
        </div>
        <Modal reset={props.reset} />
        <Link href='/login'>
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

{
  /* <div className={styles.login_button} onClick={() => setOpenModalFlag(true)}>
{user ? user.user_name : 'ログイン / 新規登録'}
</div> */
}
