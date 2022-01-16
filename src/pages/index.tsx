import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { GetStaticProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { supabase } from '../components/supabase'
import styles from '../styles/Home.module.css'
import Search from './img/search.svg'
import { useRouter } from 'next/router'
import Loading from '../components/modal/Loading'
import { AuthContext } from '../components/auth/AuthContext'
import { useContext } from 'react'
import { Events } from '../components/types'
import Image from 'next/image'
import Header from '../components/Header'
import ScrollAnimation from '../components/ScrollAnimation'
import Topic from '../components/view/top/Topic'
import Meta from '../components/Meta'
import { MetaProps } from '../components/types'
import EventListTitle from '../components/view/top/EventListTitle'
import EventList from '../components/view/EventList'

// ページコンポーネントに渡されるデータ
type Props = {
  eventList: Events[]
}

// この関数がビルド時に呼び出され、戻り値の props の値がページコンポーネントに渡される
export const getStaticProps: GetStaticProps<Props> = async (context) => {
  // 本来は、ここで外部 API などを呼び出してデータを取得する

  const { data, error } = await supabase
    .from('events')
    .select('event_id, event_name, date, contents(content_name)')
    .order('date', { ascending: false })
    .limit(5)

  const eventList: Events[] = []
  data?.map((doc) => {
    const data: Events = {
      content_name: doc.contents.content_name,
      event_id: doc.event_id,
      event_name: doc.event_name,
      date: doc.date,
    }
    eventList.push(data)
  })

  // この props プロパティの値がページコンポーネントに渡される
  return { props: { eventList } }
}

// ページコンポーネントの実装
const Home = ({ eventList }: Props) => {
  const router = useRouter()
  const [input, setInput] = useState<string>('')
  const [events, setEvents] = useState<Events[]>([])
  const [searchFocus, setSearchFocus] = useState<boolean>(false)

  //エンターキーを押した時、submitを止める
  const enterForm = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault()
    clickButton()
  }

  useEffect(() => {
    searchEvent()
  }, [input])

  const searchEvent = async () => {
    let newSearchResults: Events[] = []
    if (input?.length > 0) {
      const { data, error } = await supabase
        .from('search_events')
        .select('event_id, event_name, content_name, search_word')
        .ilike('search_word', '%' + input + '%')
        .limit(5)
      data?.map((doc) => {
        const searchResult: Events = {
          event_id: doc.event_id,
          event_name: doc.event_name,
          content_name: doc.content_name,
          date: doc.date,
        }
        newSearchResults.push(searchResult)
      })
    }
    setEvents(newSearchResults)
    console.log('searchEvent')
    console.log(newSearchResults)
  }

  //入力テキストを元に検索結果へ遷移する
  const clickButton = () => {
    //テキストが未入力の時は無効にする
    if (!input) {
      return
    }

    router.push({
      pathname: '/search', //URL
      query: { keyword: input }, //検索クエリ
    })
  }

  const { setCurrentUser }: any = useContext(AuthContext)

  const [searchTop, setSearchTop] = useState(0)

  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchRef.current) setSearchTop(searchRef.current.getBoundingClientRect().y)
  }, [])

  const [searchFocus2, setSearchFocus2] = useState<boolean>(false)
  const onFocusInput = () => {
    setSearchFocus(true)
    // if (!(window.scrollY == searchTop)) {
    //   window.scrollTo({
    //     top: searchTop,
    //     behavior: 'smooth',
    //   })
    // }
    console.log(searchRef.current!.getBoundingClientRect())
  }
  const onBlurInput = (e: any) => {
    console.log(e)
    setSearchFocus(false)
  }

  const onMouseOver = (e: any) => {
    setSearchFocus2(true)
    console.log(e)
  }

  const onMouseLeave = (e: any) => {
    setSearchFocus2(false)
    console.log(e)
  }

  const meta: MetaProps = {
    title: 'GOODSist イベントのグッズ代が計算できるWEBアプリ',
    url: 'https://goodslist-pearl.vercel.app/',
    image: 'https://goodslist-pearl.vercel.app/images/ogp.png',
  }

  return (
    <>
      <Meta title={meta.title} url={meta.url} image={meta.image} />
      <div className={styles.wrapper_white}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            GOODSist
            {/* GOODS<br></br>LIST */}
          </h1>
          <h2 className={styles.sub_title}>イベントグッズ代が計算できるWEBアプリ</h2>
          <form className={styles.search_container} onSubmit={enterForm}>
            <input
              type='text'
              className={input ? styles.search_active : styles.search}
              placeholder='アーティスト・イベント名で検索'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => onFocusInput()}
              onBlur={(e) => onBlurInput(e.target)}
              ref={searchRef}
            />
            <span
              className={input ? styles.search_button_active : styles.search_button}
              onClick={clickButton}
            >
              <Search />
            </span>
            {(events?.length > 0 && input.length > 0 && searchFocus) || searchFocus2 ? (
              <ul className={styles.search_result_active}>
                {events.map((event) => (
                  <li key={event.event_id} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
                    <Link href={'event/' + event.event_id}>
                      <a>
                        <b>{event.content_name}</b>
                        <br />
                        {event.event_name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <></>
            )}
          </form>
        </main>
      </div>

      <div className={styles.wrapper_glay}>
        <div className={styles.grid}>
          <EventList events={eventList} title='Hot Event' start='left' />
          <EventList events={eventList} title='New Event' start='right' />
        </div>
      </div>
      <div className={styles.wrapper_white}>
        <Topic
          image='/images/iphone.png'
          alt='はじめに'
          title='答えは27,100円です'
          text='日頃からイベントに参加する人は、誰しもがこのような経験をしたことがあると思います。
          私自身が感じたこういうアプリがあれば便利なのになというものを作りました。
          登録があるイベントであれば、アイテムを追加していくだけで自動的に合計金額を計算します。'
        />
        <Topic
          image='/images/iphone.png'
          alt='かんたん操作'
          title='かんたん操作'
          text='日頃からイベントに参加する人は、誰しもがこのような経験をしたことがあると思います。
          私自身が感じたこういうアプリがあれば便利なのになというものを作りました。
          登録があるイベントであれば、アイテムを追加していくだけで自動的に合計金額を計算します。'
        />
        <Topic
          image='/images/iphone.png'
          alt='取り扱いジャンル'
          title='取り扱いジャンル'
          text='コンサート、フェス、映画、アニメ、漫画、ミュージカル、演劇、スポーツなど様々なジャンルのイベントを扱います。'
        />
      </div>
    </>
  )
}
export default Home
