import Link from 'next/link'
import React from 'react'
import styles from '../styles/Privacy.module.css'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Title from '../components/view/title'
import Form from '../components/form/Form'
import Header from '../components/Header'
import Meta from '../components/Meta'
import { MetaProps } from '../components/types'
import Box from '../components/view/Box'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const data = 'テスト'

  return {
    props: { data },
  }
}

const PrivacyPolicy = (data: Props) => {
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
        <Title title='Privacy Policy' />
      </Box>
      <Box background='#ccc' padding='60px 20px 60px 20px'>
        <Form>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </Form>
      </Box>
    </>
  )
}

export default PrivacyPolicy
