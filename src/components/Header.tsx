import Link from 'next/dist/client/link'
import styles from '../styles/Header.module.css'
import React, { useEffect, useLayoutEffect } from 'react'
import { useRouter } from 'next/router'
import IconMemo from '../../public/images/search.svg'

export default function Header() {
  const router = useRouter()

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
        <a>
          <div className={styles.btn_search}>
            <IconMemo />
          </div>
        </a>
      </div>
    </div>
  )
}
