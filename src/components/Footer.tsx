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
            |　
            <Link href={'/privacy'}>
              <a>
                <u>プライバシーポリシー</u>
              </a>
            </Link>
            　|　
            <Link href={'/contact'}>
              <a>
                <u>お問い合わせ</u>
              </a>
            </Link>
            　|
          </p>
          <br />
          <p>© {thisYear} Goods List</p>
        </div>
      </div>
    </>
  )
}
