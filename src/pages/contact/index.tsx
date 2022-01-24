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
import {
  validateName,
  validateEmail,
  validateContactText,
  validateQuiz,
} from '../../components/Validation'
import { useRouter } from 'next/router'
import {
  useGoogleReCaptcha,
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
} from 'react-google-recaptcha-v3'
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

  //クイズの問題
  const [quizNumbers, setQuizNumbers] = useState<number[]>([])

  const [quiz, setQuiz] = useState<number>(0)

  const [errorQuiz, setErrorQuiz] = useState<string>('')

  const [isSubmit, setIsSubmit] = useState<boolean>(false)

  const [token, setToken] = useState<string>()

  const min = 1
  const max = 9

  useEffect(() => {
    const newQuizNumbers = []
    for (let i = 0; i < 3; i++) {
      const num = Math.floor(Math.random() * (max + 1 - min)) + min
      newQuizNumbers.push(num)
    }
    setQuizNumbers(newQuizNumbers)
  }, [])

  useEffect(() => {
    setErrorName(validateName(name))
  }, [name])

  useEffect(() => {
    setErrorEmail(validateEmail(email))
  }, [email])

  useEffect(() => {
    setErrorContactText(validateContactText(contactText))
  }, [contactText])

  useEffect(() => {
    if (quiz) setErrorQuiz(validateQuiz(quiz, quizNumbers))
  }, [quiz])

  useEffect(() => {
    console.log('a')
    if (
      name.length > 0 &&
      errorName.length == 0 &&
      email.length > 0 &&
      errorEmail.length == 0 &&
      contactText.length > 0 &&
      errorContactText.length == 0 &&
      // quiz > 0 &&
      errorQuiz.length == 0
    )
      setIsSubmit(true)
    else setIsSubmit(false)
  }, [name, email, contactText, quiz])

  const { executeRecaptcha } = useGoogleReCaptcha()
  const submitMail = async () => {
    if (!executeRecaptcha) {
      return
    }

    const token = await executeRecaptcha('contact')

    // const result = await axios.post('/api/recaptcha', { token: token })

    console.log(token)
    await axios
      .post('/api/recaptcha', { token: token })
      .then(function (result) {
        console.log(result)
        console.log('成功')
        alert(result.data.data.score)
      })
      .catch(function (error) {
        console.log('エラー')
      })

    // const result = fetch('/api/recaptcha', params)

    // const params = {
    //   method: 'POST',
    //   body: JSON.stringify({ token: token }),
    // }

    // const result = fetch('/api/recaptcha', params)
    //   .then(function (response) {
    //     console.log(response)
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //   })
    // console.log(result.data.data)
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
          <div className={styles.contact_text_container}>
            お問い合わせをご希望の方は、全ての項目を入力してください。
          </div>
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
          <InputLabel id='quiz' label='クイズ' />
          {/* <div className={styles.contact_text_container}>
            {quizNumbers[0]} + {quizNumbers[1]} + {quizNumbers[2]} = ?
          </div> */}
          <InputText
            id='quiz'
            type='text'
            name='quiz'
            value={quiz}
            placeholder='答えを入力(半角数字)'
            onChange={setQuiz}
            error={errorQuiz}
          />
          <InputNotes notes='半角数字' />
          {/* <GoogleReCaptcha onVerify={(t) => console.log({ t })} /> */}
          <SubmitButton type='email' btn_name='送信' onClick={submitMail} isSubmit={isSubmit} />
        </BoxLineText>
      </Box>
    </>
  )
}

export default Contact

// className={props.valid ? styles.input_text_validated : styles.input_text}
// type={props.type}
// id={props.id}
// name={props.name}
// value={props.value}
// placeholder={props.placeholder}
// onChange={(e) => props.onChange(e.target.value)}
