import Link from 'next/dist/client/link'
import styles from '../styles/Header.module.css'
import React, { useEffect, useLayoutEffect } from 'react'
import { useState, useContext } from 'react'
import { AuthContext } from './auth/AuthContext'
import { useRouter } from 'next/router'
import IconMemo from '../../public/images/search.svg'

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
        <a>
          <div className={styles.btn_search}>
            <IconMemo />
          </div>
        </a>
      </div>
    </div>
  )
}
