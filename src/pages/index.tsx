import Link from 'next/link'
import React from 'react'
import { GetStaticProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../components/supabase'
import styles from '../styles/Home.module.css'
import Search from './img/search.svg'
import { useRouter } from 'next/router'

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
    .limit(10)

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

  // この props プロパティの値がページコンポーネントに渡される
  return { props: { eventList } }
}

// ページコンポーネントの実装
const Home = ({ eventList }: Props) => {
  const router = useRouter()
  const [input, setInput] = useState<string>()

  // 検索ボタンをクリックした時、エンターキーを押した時の処理
  const clickButton = (e?: React.FormEvent<HTMLFormElement>) => {
    //エンターキーを押した時、submitを止める
    if (e) e.preventDefault()

    //テキストが未入力の時は無効にする
    if (!input) {
      return
    }

    router.push({
      pathname: '/search', //URL
      query: { word: input }, //検索クエリ
    })
  }

  useEffect(() => {
    // alert(input)
    async function abc() {
      const { data, error } = await supabase
        .from('events')
        .select('event_id, event_name, contents(content_id, content_name)')
    }
  }, [input])

  return (
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
      <h1 className={styles.title}>Goodsist</h1>
      <h2 className={styles.sub_title}>グッズ代が計算できるWEBアプリ</h2>
      <form className={styles.search_container} onSubmit={clickButton}>
        <input
          type='text'
          className={styles.search}
          placeholder='アーティスト・イベント名で検索'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <span className={styles.search_button} onClick={clickButton}>
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
                  <b>{event.content_name}</b>
                  <br />
                  {event.event_name}
                  <span />
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
                  <b>{event.content_name}</b>
                  <br />
                  {event.event_name}
                  <span />
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
export default Home
