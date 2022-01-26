import styles from '../styles/Footer.module.css'
import Link from 'next/link'

export default function Footer() {
  const currentTime = new Date()
  const thisYear = currentTime.getFullYear()
  return (
    <>
      <div className={styles.footer_container}>
        <p className={styles.footer_twitter}>Follow me!!</p>
        <p className={styles.footer_nav}>
          <Link href={'/'}>
            <a>Home</a>
          </Link>
          　　
          <Link href={'/privacy'}>
            <a>Privacy Policy</a>
          </Link>
          　　
          <Link href={'/contact'}>
            <a>Contact</a>
          </Link>
        </p>
        <p className={styles.copyright}>© {thisYear} GOODSist All rights reserved.</p>
      </div>
    </>
  )
}
