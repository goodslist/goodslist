import Link from 'next/link'
import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { supabase } from '../components/supabase'
import styles from '../styles/Privacy.module.css'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Navbar from '../components/Navber'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const data = 'テスト'

  return {
    props: { data },
  }
}

const LoginGate = (data: Props) => {
  return (
    <>
      <Head>
        <title>Goodsist イベントのグッズ代が計算できるWEBアプリ</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width' />
        <link rel='icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap&text=Goodsist'
          rel='stylesheet'
        />
      </Head>

      <Navbar />
      <main className={styles.main}>
        <div className={styles.content_title}>
          <span>プライバシー・ポリシー</span>
        </div>
        <div className={styles.card}>
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
        </div>
      </main>
    </>
  )
}

export default LoginGate
