import { useState, useEffect, useRef, useCallback, useContext } from 'react'
import Link from 'next/dist/client/link'
import { SignUpContext } from '../../components/signup/SignUpContext'
import { useRouter } from 'next/router'
import styles from '../../styles/Login.module.css'

export default function SignUpFromSubmit() {
  const { sendEmail }: any = useContext(SignUpContext)

  const router = useRouter()

  useEffect(() => {
    if (sendEmail == undefined) router.replace('/')
  }, [])

  return (
    <>
      <main className={styles.main}>
        <div className={styles.content_title}>
          <span>会員登録</span>
        </div>
        <div className={styles.login_signup_form_container}>
          <div className={styles.notes}>
            <Link href='/privacy'>
              <a target='_blank'>利用規約</a>
            </Link>
            、
            <Link href='/privacy'>
              <a target='_blank'>プライバシーポリシー</a>
            </Link>
            をお読みいただき、同意の上登録してください。{sendEmail}
          </div>
          <div className={styles.form_login_sns}>
            {sendEmail}宛てに確認メールを送信しました。
            <br />
            24時間以内に確認メール内のリンクにアクセスし、登録を完了させてください。
            <br />
            24時間経過するとメールは無効となり、もう一度最初から登録になります。
          </div>
        </div>
      </main>
    </>
  )
}
