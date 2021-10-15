import Link from 'next/link'
import React from 'react'
import { GetStaticProps } from 'next'
/* eslint-disable @next/next/no-page-custom-font */
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import Footer from '../components/Footer'
import Navber from '../components/Navber'
import { supabase } from '../components/supabase'
import styles from '../styles/Home.module.css'
import Search from './img/search.svg'

type EventInfo = {
  content_id: number
  content_name: string
  event_id: number
  event_name: string
}

// ページコンポーネントに渡されるデータ
type Props = {
  eventList: EventInfo[]
}

// この関数がビルド時に呼び出され、戻り値の props の値がページコンポーネントに渡される
export const getStaticProps: GetStaticProps<Props> = async (context) => {
  // 本来は、ここで外部 API などを呼び出してデータを取得する

  const { data, error } = await supabase
    .from('events')
    .select('event_id, event_name, contents(content_id, content_name)')

  const eventList: EventInfo[] = []
  data?.map((doc) => {
    const data: EventInfo = {
      content_id: doc.contents.content_id,
      content_name: doc.contents.content_name,
      event_id: doc.event_id,
      event_name: doc.event_name,
    }
    eventList.push(data)
  })

  // const eventList = [
  //   { content_id: '001', content_name: 'Title-1', event_id: 1, event_name: 'Title-1' },
  //   { content_id: '002', content_name: 'Title-2', event_id: 1, event_name: 'Title-1' },
  //   { content_id: '003', content_name: 'Title-3', event_id: 1, event_name: 'Title-1' },
  // ]

  // この props プロパティの値がページコンポーネントに渡される
  return { props: { eventList } }
}

// ページコンポーネントの実装
const Home: React.FC<Props> = ({ eventList }) => (
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
      <link
        href='https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
        rel='stylesheet'
      ></link>
    </Head>
    <div className={styles.main_container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Goodsist</h1>
        <h2 className={styles.sub_title}>グッズ代が計算できるWEBアプリ</h2>
        <form method='get' action='#' className={styles.search_container}>
          <input
            type='text'
            className={styles.search}
            placeholder='アーティスト・イベント・作品名等で検索'
          />
          <span className={styles.search_button}>
            <Search />
          </span>
        </form>
        <div className={styles.grid}>
          <p className={styles.new_hot_label}>新しいイベント</p>
          <ul className={`${styles.card} ${styles.new_event_border}`}>
            {eventList.map((event) => (
              <li key={event.event_id}>
                <Link href={'event/' + event.event_id}>
                  <a>
                    <b>{event.content_name}</b> {event.event_name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          <p className={styles.new_hot_label}>人気イベント</p>
          <ul className={`${styles.card} ${styles.hot_event_border}`}>
            {eventList.map((event) => (
              <li key={event.event_id}>
                <Link href={'event/' + event.event_id}>
                  <a>
                    <b>{event.content_name}</b> {event.event_name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  </>
)
export default Home

//数字を3桁ごとにカンマ区切りする。
const numberFormat = (num: number): string => {
  return num.toLocaleString()
}
