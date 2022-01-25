import styles from '../styles/Footer.module.css'
import Link from 'next/link'

export default function Footer() {
  const currentTime = new Date()
  const thisYear = currentTime.getFullYear()
  return (
    <>
      <div className={styles.footer_container}>
        <div className={styles.footer}>
          <p>
            <Link href={'/'}>
              <a>Top</a>
            </Link>
            　　
            <Link href={'/privacy'}>
              <a>Privacy Policy</a>
            </Link>
            　　
            <Link href={'/contact'}>
              <a>Contact</a>
            </Link>
          </p>
          <br />
          <p>© {thisYear} GOODSist All rights reserved.</p>
        </div>
      </div>
    </>
  )
}
