import Link from 'next/dist/client/link'
import styles from '../styles/Header.module.css'

export default function Navbar() {
  return (
    <div className={styles.header_container}>
      <div className={styles.header}>
        <div className={styles.logo_container}>
          <Link href='/'>
            <a>
              <p className={styles.logo}>Goodsist</p>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
