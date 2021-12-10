import Link from 'next/dist/client/link'
import styles from '../styles/Header.module.css'
import React, { useEffect, useLayoutEffect } from 'react'
import { useState, useContext } from 'react'
import { AuthContext } from './auth/AuthContext'
import { useRouter } from 'next/router'

export default function Header() {
  const { currentUser, userPhoto, setUserPhoto }: any = useContext(AuthContext)
  const router = useRouter()
  // const userPhotoUrl = localStorage.getItem('photo')!

  const [photo, setPhoto] = useState('')
  // setPhoto(localStorage.getItem('photo')!)

  // useLayoutEffect(() => {
  //   const photoUrl = localStorage.getItem('photo')
  //   if (photoUrl) setUserPhoto(photoUrl)
  // }, [])

  return (
    <div className={styles.header_container}>
      <div className={styles.header}>
        <div className={styles.logo_container}>
          <Link href='/'>
            <a>
              <p className={styles.logo}>
                <span>G</span>
                oods List
              </p>
            </a>
          </Link>
        </div>
        {(() => {
          if (router.pathname == '/login') {
            return <></>
          } else if (currentUser) {
            return (
              <Link href='/user/mylist'>
                <a>
                  <div className={styles.btn_photo}>
                    <img src={currentUser.photo} />
                  </div>
                </a>
              </Link>
            )
          } else {
            return (
              <Link href={'/login'}>
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
