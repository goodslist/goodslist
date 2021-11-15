import Head from 'next/head'
import { useEffect, useContext } from 'react'
import Link from 'next/dist/client/link'
import { SignUpContext } from '../../components/signup/SignUpContext'
import { useRouter } from 'next/router'
import styles from '../../styles/Login.module.css'
import Title from '../../components/view/title'

export default function SignUpSubmit() {
  const { sendEmail }: any = useContext(SignUpContext)

  const router = useRouter()

  // useEffect(() => {
  //   if (sendEmail == undefined) router.replace('/')
  // }, [])
  return (
    <>
      <Head>
        <title>Goodsist イベントのグッズ代が計算できるWEBアプリ</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0' />
        <link rel='icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap&text=Goodsist'
          rel='stylesheet'
        />
      </Head>

      <main className={styles.main}>
        <Title title='確認メール送信' />
        <div className={styles.form_container}>
          <div className={styles.signup_step_container}>
            <div className={styles.step_on}>
              01<span>確認メール送信</span>
            </div>
            <div className={styles.step_off}>
              02<span>必要事項入力</span>
            </div>

            <div className={styles.step_off}>
              03<span>登録完了</span>
            </div>
          </div>
          <div className={styles.send_email_address}>{sendEmail}</div>
          <div className={styles.send_email_text}>
            上記のメールアドレス宛てに確認メールを送信しました。
            <br />
            24時間以内に確認メール内のリンクにアクセスし、登録を完了させてください。
            <br />
            24時間経過すると確認メールは無効となりますので、もう一度最初からお手続きください。
          </div>

          <div className={styles.link_return}>
            <Link href='/'>
              <a target='_blank'>トップページ</a>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
