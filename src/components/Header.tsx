import Link from 'next/dist/client/link'
import styles from '../styles/Header.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Title from '../components/view/title'
import SearchEventForm from '../components/SearchEventForm'

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()

  const openSearch = () => {
    if (isSearchOpen == false) setIsSearchOpen(true)
    else setIsSearchOpen(false)
  }

  return (
    <>
      <div className={styles.header_container}>
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
              className={isSearchOpen ? styles.btn_search_active : styles.btn_search}
            ></button>
          </a>
        </div>
      </div>
      <div
        className={
          isSearchOpen ? styles.header_search_container_active : styles.header_search_container
        }
      >
        <Title title='Search Event' />
        <SearchEventForm />
      </div>
    </>
  )
}
