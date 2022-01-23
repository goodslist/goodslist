import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from '../../styles/Contact.module.css'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Title from '../../components/view/title'
import Form from '../../components/form/Form'
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

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const data = 'テスト'

  return {
    props: { data },
  }
}

const Contact = (data: Props) => {
  //クイズの答え
  const [quizNumbers, setQuizNumbers] = useState<Number[]>([])

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
          <InputLabel label='お名前' />
          <InputText />
          <InputNotes notes='20文字以内' />
          <InputLabel label='メールアドレス' />
          <InputText />
          <InputNotes notes='50文字以内' />
          <InputLabel label='お問い合わせ内容' />
          <InputTextArea />
          <InputNotes notes='500文字以内' />
          <InputLabel label='クイズ' />

          <div className={styles.contact_text_container}>
            {quizNumbers[0]} + {quizNumbers[1]} + {quizNumbers[2]} = ?
          </div>
          <InputText />
          <InputNotes notes='半角数字' />
          <SubmitButton type='email' btn_name='送信' />
        </BoxLineText>
      </Box>
    </>
  )
}

export default Contact
