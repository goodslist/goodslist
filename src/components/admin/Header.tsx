import Link from 'next/link'
import styles from '../../styles/Admin.module.css'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useRouter } from 'next/router'

export default function AdminHeader() {
  const router = useRouter()

  const [isOpenMenu, setIsOpenMenu] = useState(false)

  const openOrCloseMenu = () => {
    if (isOpenMenu == false) setIsOpenMenu(true)
    else setIsOpenMenu(false)
  }

  return (
    <>
      <div className={styles.header_container}>
        <div className={styles.header}>
          <div className={styles.logo_container}>
            <Link href='/'>
              <a>
                <p className={styles.logo}>
                  <span>G</span>
                  oods List Admin
                </p>
              </a>
            </Link>
          </div>
          <div
            className={isOpenMenu ? styles.btn_menu_active : styles.btn_menu}
            onClick={() => openOrCloseMenu()}
          >
            <span></span>
          </div>
        </div>
      </div>
      <div className={isOpenMenu ? styles.menu_container_active : styles.menu_container}>
        <ul>
          <li>トップ</li>
          <Link href='/kinakomochi/contents/'>
            <a>
              <li>コンテンツリスト</li>
            </a>
          </Link>
          <li>コンテンツ新規登録</li>
          <Link href='/kinakomochi/events/'>
            <a>
              <li>イベントリスト</li>
            </a>
          </Link>
          <li>イベント新規登録</li>
          <li>ログアウト</li>
        </ul>
      </div>
    </>
  )
}
