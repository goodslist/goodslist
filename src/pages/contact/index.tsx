import Link from 'next/link'
import { useEffect, useState, useContext, useCallback } from 'react'
import styles from '../../styles/Contact.module.css'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Title from '../../components/view/title'
import Header from '../../components/Header'
import Meta from '../../components/Meta'
import { MetaProps } from '../../components/types'
import Box from '../../components/view/Box'
import BoxLineText from '../../components/view/BoxLineText'
import InputText from '../../components/form/InputText'
import InputText2 from '../../components/form/InputText2'
import InputLabel from '../../components/form/InputLabel'
import InputTextArea from '../../components/form/InputTextArea'
import SubmitButton from '../../components/form/SubmitButton'
import InputNotes from '../../components/form/InputNotes'
import { ModalContext } from '../../components/modal/ModalContext'
import { validateName, validateEmail, validateContactText } from '../../components/Validation'
import { useRouter } from 'next/router'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import axios from 'axios'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const data = 'テスト'

  return {
    props: { data },
  }
}

const Contact = (data: Props) => {
  const router = useRouter()

  //モーダル関連のコンテキスト
  const { setIsLoading }: any = useContext(ModalContext)

  const [name, setName] = useState<string>('')

  const [errorName, setErrorName] = useState<string>('')

  const [email, setEmail] = useState<string>('')

  const [errorEmail, setErrorEmail] = useState<string>('')

  const [contactText, setContactText] = useState<string>('')

  const [errorContactText, setErrorContactText] = useState<string>('')

  const [isSubmit, setIsSubmit] = useState<boolean>(false)

  const [errorSubmit, setErrorSubmit] = useState<string>('')

  useEffect(() => {
    setErrorName(validateName(name))
  }, [name])

  useEffect(() => {
    setErrorEmail(validateEmail(email))
  }, [email])

  useEffect(() => {
    // setErrorContactText(validateContactText(contactText))
    // setErrorContactText(contactText)
  }, [contactText])

  useEffect(() => {
    console.log('a')
    if (
      name.length > 0 &&
      errorName.length == 0 &&
      email.length > 0 &&
      errorEmail.length == 0 &&
      contactText.length > 0 &&
      errorContactText.length == 0
    )
      setIsSubmit(true)
    else setIsSubmit(false)
  }, [name, email, contactText])

  const { executeRecaptcha } = useGoogleReCaptcha()

  //送信ボタンが押下されたら、reCAPTCHAで認証してからメールを送信し、送信完了ページへ遷移する。
  const submitMail = async () => {
    setIsLoading(true)

    if (!executeRecaptcha) {
      return
    }

    const token = await executeRecaptcha('contact')

    const result = await axios.post('/api/recaptcha', { token: token })

    if (result.data.status != 'success') {
      setErrorSubmit('エラーが発生しました。しばらく経ってから再度お試しください。')
      return
    }

    const mailInfo = {
      subject: 'お問い合わせ(' + name + '様)',
      email: email,
      text:
        '【お名前】' +
        name +
        '様\n【メールアドレス】' +
        email +
        '\n【メール本文】\n\n' +
        contactText,
    }
    const resultSubmit = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(mailInfo),
    })

    if (resultSubmit.status != 200) {
      setErrorSubmit('エラーが発生しました。しばらく経ってから再度お試しください。')
    }

    await router.push({
      pathname: '/contact/complete',
    })

    setIsLoading(false)
  }

  const meta: MetaProps = {
    title: 'GOODSist イベントのグッズ代が計算できるWEBアプリ',
    url: 'https://goodslist-pearl.vercel.app/contact',
    image: 'https://goodslist-pearl.vercel.app/images/ogp9.png',
  }
  return (
    <>
      <Meta title={meta.title} url={meta.url} image={meta.image} />
      <Header />
      <Box background='#fff' padding='60px 20px 60px 20px'>
        <Title title='Contact' />
        <BoxLineText>
          <p className={styles.contact_text}>
            お問い合わせをご希望の方は、全ての項目を入力してください。
          </p>
          <InputLabel id='name' label='お名前' />
          <InputText
            id='name'
            type='text'
            name='name'
            value={name}
            placeholder='名前を入力'
            onChange={setName}
            error={errorName}
          />

          <InputNotes notes='30文字以内' />
          <InputLabel id='email' label='メールアドレス' />
          <InputText
            id='email'
            type='email'
            name='email'
            value={email}
            placeholder='メールアドレスを入力'
            onChange={setEmail}
            error={errorEmail}
          />
          <InputNotes notes='' />
          <InputLabel id='text' label='お問い合わせ内容' />
          <InputTextArea
            id='text'
            type='text'
            name='text'
            value={contactText}
            placeholder='お問い合わせの内容を入力'
            onChange={setContactText}
            error={errorContactText}
          />
          <InputNotes notes='500文字以内' />
          <SubmitButton type='email' btn_name='送信' onClick={submitMail} isSubmit={isSubmit} />
        </BoxLineText>
      </Box>
    </>
  )
}

export default Contact
