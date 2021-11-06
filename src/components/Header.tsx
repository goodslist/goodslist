import Link from 'next/dist/client/link'
import styles from '../styles/Header.module.css'
import React from 'react'
import { useEffect, useRef, useState, useContext } from 'react'
import { ModalContext } from './modal/ModalContext'
import { AuthContext } from './auth/AuthContext'
import { useRouter } from 'next/router'

export default function Header(props: any) {
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
      router.replace('/signup/profile')
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
        {(() => {
          if (user) {
            return <div className={styles.btn_login}>マイページ</div>
          } else if (router.pathname == '/login' || router.pathname == '/signup') {
            return (
              <Link href={router.pathname == '/login' ? '/signup' : '/login'}>
                <a>
                  <div className={styles.btn_login_link}>
                    {router.pathname == '/login' ? '会員登録はこちら' : 'ログインはこちら'}
                  </div>
                </a>
              </Link>
            )
          } else {
            return (
              <Link href={router.pathname == '/login' ? '/signup' : '/login'}>
                <a>
                  <div className={styles.btn_login}>ログイン / 会員登録</div>
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
