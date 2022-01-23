import Link from 'next/link'
import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { supabase } from '../components/supabase'
import styles from '../styles/Privacy.module.css'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Title from '../components/view/title'
import Form from '../components/form/Form'
import Header from '../components/Header'
import Meta from '../components/Meta'
import { MetaProps } from '../components/types'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const data = 'テスト'

  return {
    props: { data },
  }
}

const LoginGate = (data: Props) => {
  const meta: MetaProps = {
    title: 'GOODSist イベントのグッズ代が計算できるWEBアプリ',
    url: 'https://goodslist-pearl.vercel.app/',
    image: 'https://goodslist-pearl.vercel.app/images/ogp23.png',
  }
  return (
    <>
      <Meta title={meta.title} url={meta.url} image={meta.image} />
      <Header />

      <main className={styles.main}>
        <Title title='Privacy Policy' />
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
      </main>
    </>
  )
}

export default LoginGate
