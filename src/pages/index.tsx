import Link from 'next/link'
import { useState, useEffect, useRef, useContext } from 'react'
import { GetStaticProps } from 'next'
import { supabase } from '../components/supabase'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { AuthContext } from '../components/auth/AuthContext'
import { Events } from '../components/types'
import { MetaProps } from '../components/types'
import Meta from '../components/Meta'
import Header from '../components/Header'
import Loading from '../components/modal/Loading'
import Box from '../components/view/Box'
import BoxGrid from '../components/view/BoxGrid'
import SearchEventForm from '../components/SearchEventForm'
import EventList from '../components/view/EventList'
import Topic from '../components/view/top/Topic'
import { ModalContext } from '../components/modal/ModalContext'

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

  const { setCurrentUser }: any = useContext(AuthContext)

  const meta: MetaProps = {
    title: 'GOODSist イベントのグッズ代が計算できるWEBアプリ',
    url: 'https://goodslist-pearl.vercel.app/',
    image: 'https://goodslist-pearl.vercel.app/images/ogp.png',
  }

  return (
    <>
      <Meta title={meta.title} url={meta.url} image={meta.image} />
      <Header />
      <Box background='#fff' padding='0 0 0 0'>
        <main className={styles.main}>
          <h1 className={styles.title}>GOODSist</h1>
          <h2 className={styles.sub_title}>グッズ代が計算できるWEBアプリ</h2>
          <SearchEventForm />
        </main>
      </Box>

      <BoxGrid background='#f1f1f1' padding='150px 20px 60px 20px'>
        <EventList events={eventList} title='Hot Event' start='left' />
        <EventList events={eventList} title='New Event' start='right' />
      </BoxGrid>
      <Box background='#fff' padding='100px 20px 40px 20px'>
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
      </Box>
    </>
  )
}
export default Home
