import Link from 'next/dist/client/link'
import styles from '../styles/Header.module.css'
import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import Title from '../components/view/title'
import SearchEventForm from '../components/SearchEventForm'
import { ModalContext } from '../components/modal/ModalContext'

export default function Header() {
  const router = useRouter()

  const openSearch = () => {
    if (isShowSearch == false) setIsShowSearch(true)
    else setIsShowSearch(false)
  }

  //モーダル関連のコンテキスト
  const { isShowSearch, setIsShowSearch }: any = useContext(ModalContext)

  return (
    <>
      <div
        id='top'
        className={isShowSearch ? styles.header_container_fixed : styles.header_container}
      >
        <div className={styles.header}>
          <div className={styles.logo_container}>
            <Link href='/'>
              <a>
                <p className={styles.logo}>GOODSist</p>
              </a>
            </Link>
          </div>
          <a>
            <button
              onClick={openSearch}
              className={isShowSearch ? styles.btn_search_active : styles.btn_search}
            ></button>
          </a>
        </div>
      </div>
      <div
        className={
          isShowSearch ? styles.header_search_container_active : styles.header_search_container
        }
      >
        <Title title='Search Event' />
        <SearchEventForm />
      </div>
    </>
  )
}
