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

  //エンターキーを押した時、submitを止める
  const enterForm = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault()
    clickButton()
  }

  //入力テキストを元に検索結果へ遷移する
  const clickButton = () => {
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
      <div className={styles.wrapper_white}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            <span>G</span>oods List
          </h1>
          <h2 className={styles.sub_title}>グッズ代が計算できるWEBアプリ</h2>
          <form className={styles.search_container} onSubmit={enterForm}>
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
        </main>
      </div>
      <div className={styles.wrapper_glay}>
        <main className={styles.main}>
          <div className={styles.grid}>
            <p className={styles.label_hot_new}>
              <span>人気イベント</span>
            </p>
            <ul className={styles.ul_event}>
              {eventList.map((event) => (
                <Link href={'event/' + event.event_id}>
                  <a>
                    <li key={event.event_id} className={styles.card2}>
                      <p className={styles.contents_title}>
                        <b>{event.content_name}</b>
                      </p>
                      <hr className={styles.li_event_line} />
                      <p className={styles.event_title}>{event.event_name}</p>
                    </li>
                  </a>
                </Link>
              ))}
            </ul>
            <p className={styles.label_hot_new}>
              <span>新しいイベント</span>
            </p>
            <ul className={styles.ul_event}>
              {eventList.map((event) => (
                <Link href={'event/' + event.event_id}>
                  <a>
                    <li key={event.event_id} className={styles.card2}>
                      <p className={styles.contents_title}>
                        <b>{event.content_name}</b>
                      </p>
                      <hr className={styles.li_event_line} />
                      <p className={styles.event_title}>{event.event_name}</p>
                    </li>
                  </a>
                </Link>
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
