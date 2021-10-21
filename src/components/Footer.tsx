import styles from '../styles/Footer.module.css'

export default function Footer() {
  return (
    <>
      <div className={styles.footer_container}>
        <div className={styles.footer}>
          <p>運営者について　|　プライバシー・ポリシー　|　お問い合わせ</p>
          <br />
          <p>© 2021 Goodsist</p>
        </div>
      </div>
    </>
  )
}
