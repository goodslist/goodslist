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
import { EventList } from '../components/types'
import Image from 'next/image'

// ページコンポーネントに渡されるデータ
type Props = {
  eventList: EventList[]
}

// この関数がビルド時に呼び出され、戻り値の props の値がページコンポーネントに渡される
export const getStaticProps: GetStaticProps<Props> = async (context) => {
  // 本来は、ここで外部 API などを呼び出してデータを取得する

  const { data, error } = await supabase
    .from('events')
    .select('event_id, event_name, date, contents(content_name)')
    .order('date', { ascending: false })
    .limit(10)

  const eventList: EventList[] = []
  data?.map((doc) => {
    const data: EventList = {
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
  const [input, setInput] = useState<string>('')
  const [events, setEvents] = useState<EventList[]>([])
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
    let newSearchResults: EventList[] = []
    if (input?.length > 0) {
      const { data, error } = await supabase
        .from('search_events')
        .select('event_id, event_name, content_name, search_word')
        .ilike('search_word', '%' + input + '%')
        .limit(5)
      data?.map((doc) => {
        const searchResult: EventList = {
          event_id: doc.event_id,
          event_name: doc.event_name,
          content_name: doc.content_name,
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

  return (
    <>
      <Head>
        <title>Goods List イベントのグッズ代が計算できるWEBアプリ</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0' />
        <link rel='icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/css2?family=Hind:wght@700&display=swap&text=GOODS LIST'
          // href='https://fonts.googleapis.com/css2?family=Hind:wght@600&display=swap&text=GOODS LIST'
          rel='stylesheet'
        />
        <link
          href='https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
          rel='stylesheet'
        ></link>
      </Head>
      <div className={styles.wrapper_white}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            GOODS
            <br />
            LIST
          </h1>
          <h2 className={styles.sub_title}>グッズ代が計算できるWEBアプリ</h2>
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
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
      <div className={styles.wrapper_glay}>
        <main className={styles.main_g}>
          <div className={styles.grid}>
            <p className={styles.label_hot_new}>
              <span>人気イベント</span>
            </p>
            <ul className={styles.ul_event}>
              {eventList.map((event) => (
                <li key={event.event_id} className={styles.li_event}>
                  <Link href={'event/' + event.event_id}>
                    <a>
                      <div className={styles.li_event_padding}>
                        <p className={styles.contents_title}>
                          <b>{event.content_name}</b>
                        </p>
                        <hr className={styles.li_event_line} />
                        <p className={styles.event_title}>{event.event_name}</p>
                      </div>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
            <p className={styles.label_hot_new}>
              <span>新しいイベント</span>
            </p>
            <ul className={styles.ul_event}>
              {eventList.map((event) => (
                <li key={event.event_id} className={styles.li_event}>
                  <Link href={'event/' + event.event_id}>
                    <a>
                      <div className={styles.li_event_padding}>
                        <p className={styles.contents_title}>
                          <b>{event.content_name}</b>
                        </p>
                        <hr className={styles.li_event_line} />
                        <p className={styles.event_title}>{event.event_name}</p>
                      </div>
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
}
export default Home

// <>
//       <Head>
//         <title>Goodsist イベントのグッズ代が計算できるWEBアプリ</title>
//         <meta name='description' content='Generated by create next app' />
//         <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0' />
//         <link rel='icon' href='/favicon.ico' />
//         <link
//           href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap&text=Goodsist'
//           rel='stylesheet'
//         />
//         <link
//           href='https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
//           rel='stylesheet'
//         ></link>
//       </Head>
//       <main className={styles.main}>
//         <h1 className={styles.title}>
//           <span>G</span>oods List
//         </h1>
//         <h2 className={styles.sub_title}>グッズ代が計算できるWEBアプリ</h2>
//         <form className={styles.search_container} onSubmit={enterForm}>
//           <input
//             type='text'
//             className={styles.search}
//             placeholder='アーティスト・イベント名で検索'
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//           />
//           <span className={styles.search_button} onClick={clickButton}>
//             <Search />
//           </span>
//         </form>
//         <div className={styles.grid}>
//           <p className={styles.label_hot_new}>
//             <span>人気イベント</span>
//           </p>
//           <ul className={`${styles.card} ${styles.new_event_border}`}>
//             {eventList.map((event) => (
//               <li key={event.event_id}>
//                 <Link href={'event/' + event.event_id}>
//                   <a>
//                     <b>{event.content_name}</b>
//                     <br />
//                     {event.event_name}
//                     <span />
//                   </a>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//           <p className={styles.label_hot_new}>
//             <span>新しいイベント</span>
//           </p>
//           <ul className={`${styles.card} ${styles.hot_event_border}`}>
//             {eventList.map((event) => (
//               <li key={event.event_id}>
//                 <Link href={'event/' + event.event_id}>
//                   <a>
//                     <b>{event.content_name}</b>
//                     <br />
//                     {event.event_name}
//                     <span />
//                   </a>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </main>
//     </>
