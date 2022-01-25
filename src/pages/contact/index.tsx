import Link from 'next/link'
import { useEffect, useState, useContext } from 'react'
import styles from '../../styles/Contact.module.css'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Title from '../../components/view/title'
import Header from '../../components/Header'
import Meta from '../../components/Meta'
import { MetaProps } from '../../components/types'
import Box from '../../components/view/Box'
import BoxLineText from '../../components/view/BoxLineText'
import InputText from '../../components/form/InputText'
import InputLabel from '../../components/form/InputLabel'
import InputTextArea from '../../components/form/InputTextArea'
import SubmitButton from '../../components/form/SubmitButton'
import InputNotes from '../../components/form/InputNotes'
import { ModalContext } from '../../components/modal/ModalContext'
import { validateName, validateEmail, validateContactText } from '../../components/Validation'
import { useRouter } from 'next/router'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import axios from 'axios'
import Spacer from '../../components/view/Spacer'

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

  const [checkName, setCheckName] = useState<boolean>(false)

  const [email, setEmail] = useState<string>('')

  const [errorEmail, setErrorEmail] = useState<string>('')

  const [checkEmail, setCheckEmail] = useState<boolean>(false)

  const [contactText, setContactText] = useState<string>('')

  const [errorContactText, setErrorContactText] = useState<string>('')

  const [checkContactText, setCheckContactText] = useState<boolean>(false)

  const [errorSubmit, setErrorSubmit] = useState<string>('')

  useEffect(() => {
    const newErrorName = validateName(name)
    setErrorName(newErrorName)
    if (name != '' && newErrorName == '') setCheckName(true)
    else setCheckName(false)
  }, [name])

  useEffect(() => {
    const newErrorEmail = validateEmail(email)
    setErrorEmail(newErrorEmail)
    if (email != '' && newErrorEmail == '') setCheckEmail(true)
    else setCheckEmail(false)
  }, [email])

  useEffect(() => {
    const newErrorContactText = validateContactText(contactText)
    setErrorContactText(newErrorContactText)
    if (contactText != '' && newErrorContactText == '') setCheckContactText(true)
    else setCheckContactText(false)
  }, [contactText])

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
        '【お名前】' + name + '様\n【メールアドレス】' + email + '\n【メール本文】\n' + contactText,
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
            valid={checkName}
          />
          <InputNotes limit='30' legnth={name.length} />
          <InputLabel id='email' label='メールアドレス' />
          <InputText
            id='email'
            type='email'
            name='email'
            value={email}
            placeholder='メールアドレスを入力'
            onChange={setEmail}
            error={errorEmail}
            valid={checkEmail}
          />
          <InputNotes limit='256' legnth={email.length} />
          <InputLabel id='text' label='お問い合わせ内容' />
          <InputTextArea
            id='text'
            type='text'
            name='text'
            value={contactText}
            placeholder='お問い合わせの内容を入力'
            onChange={setContactText}
            error={errorContactText}
            valid={checkContactText}
          />
          <InputNotes limit='500' legnth={contactText.length} />
          <SubmitButton
            type='email'
            btn_name='送信'
            onClick={submitMail}
            isSubmit={checkName && checkEmail && checkContactText}
          />
          <div className={styles.spacer}></div>
          <Spacer padding='30px 0px 0px 0px' />
        </BoxLineText>
      </Box>
    </>
  )
}

export default Contact
