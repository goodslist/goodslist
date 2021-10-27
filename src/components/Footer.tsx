import styles from '../styles/Footer.module.css'
import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <div className={styles.footer_container}>
        <div className={styles.footer}>
          <p>
            |　
            <Link href={'/privacy'}>
              <a>プライバシー・ポリシー</a>
            </Link>
            　|　
            <Link href={'/contact'}>
              <a>お問い合わせ</a>
            </Link>
            　|
          </p>
          <br />
          <p>© 2021 Goodsist</p>
        </div>
      </div>
    </>
  )
}
