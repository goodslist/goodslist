import Link from 'next/link'
import React, { useLayoutEffect } from 'react'
import { GetStaticProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect, useCallback, useRef, createRef } from 'react'
import { supabase } from '../components/supabase'
import styles from '../styles/Home.module.css'
import Search from './img/search.svg'
import { useRouter } from 'next/router'
import { getSortedRoutes } from 'next/dist/shared/lib/router/utils'

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
    .limit(3)

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

  const [prevEventList, setPrevEventList] = useState(
    eventList.map((List) => Object.assign({}, List)),
  )
  const [sortedEventList, setSortedEventList] = useState(
    eventList.map((List) => Object.assign({}, List)),
  )
  const [prevHeights, setPrevHeights] = useState<any>([])
  const listHeights = useRef<any>([])
  const [isDefaultSort, setIsDefaultSort] = useState(true)
  let newHeights: number[] = new Array(3)
  let differenceHeights: number[] = new Array(3)
  prevEventList.forEach((_, i) => {
    listHeights.current[i] = createRef()
  })

  const sort = () => {
    //ソート直前のリストを保持する
    const newPrevEventList = [...sortedEventList]
    setPrevEventList(newPrevEventList)

    //ソート直前のリストの高さを取得する
    let newPrevHights: any = []
    listHeights.current.map((ref: any, index: number) => {
      if (ref.current) {
        newPrevHights[index] = ref.current.getBoundingClientRect().top
      }
    })
    setPrevHeights(newPrevHights)

    //ソートする（この時点ではまだ画面にレンダリングはされていない）
    let newsortedEventList = []
    newsortedEventList.push(sortedEventList[2])
    newsortedEventList.push(sortedEventList[1])
    newsortedEventList.push(sortedEventList[0])
    setSortedEventList(newsortedEventList)

    //フラグを変えてuseLayoutEffectを呼び出す
    if (isDefaultSort) {
      setIsDefaultSort(false)
    } else setIsDefaultSort(true)
  }

  //ソート処理の続き
  useLayoutEffect(() => {
    //ソート直後のリストの高さを取得する
    listHeights.current.forEach((ref: any, index: number) => {
      if (ref.current) {
      }
      newHeights[index] = ref.current.getBoundingClientRect().top
    })

    //ソート前後のリストを比較しイベントIDが一致するtopの値の差分を取得する
    sortedEventList.forEach((ref: any, index: number) => {
      prevEventList.forEach((ref2: any, index2: number) => {
        if (ref.event_id == ref2.event_id) {
          differenceHeights[index] = prevHeights[index2] - newHeights[index]
        }
      })
    })

    //ソートしたリストを差分を足して一時的に元の位置にずらす
    returnListPosition()

    //requestAnimationFrameにより1フレーム後（レンダリング後）にアニメーションをスタートさせる
    requestAnimationFrame(() => {
      listHeights.current.forEach((ref: any, index: number) => {
        var li = document.getElementById(String(sortedEventList[index].event_id))
        if (li) {
          li.style.transform = ``
          li.style.transition = `transform 300ms ease`
        }
      })
    })
  }, [isDefaultSort])

  //移動させたリストを一時的に元の位置にずらす
  const returnListPosition = () => {
    listHeights.current.forEach((ref: any, index: number) => {
      var li = document.getElementById(String(sortedEventList[index].event_id))
      if (li) {
        li.style.transform = `translateY(${differenceHeights[index]}px)`
        li.style.transition = `transform 0s`
      }
    })
  }

  // useLayoutEffect(() => {
  //   listHeights.current.forEach((ref: any, index: number) => {
  //     prevHeights = [569.5, 700.5, 811.5]
  //     if (ref.current) {
  //       console.log(ref.current.getBoundingClientRect().top)
  //     }
  //     console.log('c')
  //     newHeights[index] = ref.current.getBoundingClientRect().top
  //   })

  //   newHeights.forEach((ref: any, index: number) => {
  //     if (ref) {
  //       differenceHeights[index] = prevHeights[index] - newHeights[index]
  //     }
  //   })
  //   console.log(differenceHeights[0] + ' ' + differenceHeights[1] + ' ' + differenceHeights[2])
  //   console.log('d')

  //   console.log('ww' + prevHeights[2])
  //   console.log('ww' + newHeights[2])
  // }, [sortedEventList])

  useEffect(() => {}, [])

  const sort2 = () => {
    listHeights.current.forEach((ref: any) => {
      if (ref.current) {
        console.log(ref.current)
      }
    })
    let newsortedEventList = []
    newsortedEventList.push(eventList[0])
    newsortedEventList.push(eventList[1])
    newsortedEventList.push(eventList[2])
    setSortedEventList(newsortedEventList)

    listHeights.current.forEach((ref: any) => {
      if (ref.current) {
        console.log(ref.current)
      }
    })
  }

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
            <p className={styles.label_hot_new} onClick={() => sort()}>
              <span>人気イベント</span>
            </p>
            <p onClick={() => sort2()}>ソート２</p>
            <ul className={styles.ul_event}>
              {sortedEventList.map((event, index) => (
                <Link href={'event/' + event.event_id}>
                  <a>
                    <li
                      key={index}
                      id={String(event.event_id)}
                      ref={listHeights.current[index]}
                      className={styles.card2}
                    >
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
