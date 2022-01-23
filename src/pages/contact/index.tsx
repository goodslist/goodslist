import Link from 'next/link'
import React from 'react'
import styles from '../styles/Contact.module.css'
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

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const data = 'テスト'

  return {
    props: { data },
  }
}

const Contact = (data: Props) => {
  const meta: MetaProps = {
    title: 'GOODSist イベントのグッズ代が計算できるWEBアプリ',
    url: 'https://goodslist-pearl.vercel.app/',
    image: 'https://goodslist-pearl.vercel.app/images/ogp9.png',
  }
  return (
    <>
      <Meta title={meta.title} url={meta.url} image={meta.image} />
      <Header />
      <Box background='#fff' padding='60px 20px 60px 20px'>
        <Title title='Contact' />
        <BoxLineText>
          <InputLabel label='お名前' />
          <InputText />
          <InputLabel label='メールアドレス' />
          <InputText />
          <InputLabel label='お問い合わせ内容' />
          <InputTextArea />
          <InputLabel label='クイズ' />
          <InputText />
          <SubmitButton type='email' btn_name='送信' />
        </BoxLineText>
      </Box>
    </>
  )
}

export default Contact
