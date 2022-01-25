import Link from 'next/link'
import React from 'react'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Title from '../components/view/title'
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

      <div className='w-72 y-64 bg-blue-400 text-center text-white'>Hello Nextjs & tailwindcss</div>
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
    </>
  )
}

export default PrivacyPolicy
