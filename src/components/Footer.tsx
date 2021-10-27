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
              <a>
                <u>プライバシー・ポリシー</u>
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
          <p>© 2021 Goodsist</p>
        </div>
      </div>
    </>
  )
}
