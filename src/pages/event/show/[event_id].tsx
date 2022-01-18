import Link from 'next/link'
import React from 'react'
import { GetStaticProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import {
  useState,
  useEffect,
  useRef,
  createRef,
  useCallback,
  useContext,
  useLayoutEffect,
} from 'react'
import { supabase } from '../../../components/supabase'
import styles from '../../../styles/Goods.module.css'
import { GetStaticPaths } from 'next'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Calendar from '../../img/calendar.svg'
import Official_mobile from '../../img/official_mobile.svg'
import IconTwitter from '../../img/icon_twitter.svg'
import IconMemo from '../../../../public/images/memo.svg'
import IconScreenshot from '../../../../public/images/screenshot.svg'
import Newlist from '../../../../public/images/newlist.svg'
import Line from '../../img/line.svg'
import Reset from '../../img/reset.svg'
import Save from '../../img/save.svg'
import Button_top from '../../../components/Button_top'
import { animateScroll as scroll } from 'react-scroll'
import { numberFormat, dateFormat } from '../../../components/Utils'
import { AuthContext } from '../../../components/auth/AuthContext'
import { ModalContext } from '../../../components/modal/ModalContext'
import Modal from '../../../components/modal/Modal'
import {
  getPrevGroupHeights,
  sortGroups,
  getAfterGroupHeights,
  getDifferenceGroupHeights,
  returnPosition,
  startSortAnimation,
} from '../../../components/event/Sort'
import { Event, ShowGroup, ShowItem, ItemCount } from '../../../components/types'
import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Meta from '../../../components/Meta'
import { MetaProps } from '../../../components/types'
import Title from '../../../components/view/title'

type PathParams = {
  event_id: string
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const { data, error } = await supabase.from('events').select('event_id')

  if (!data) {
    throw new Error('予期せぬエラーが起きました。時間を空けて再度お試しください。')
  }
  const paths = data?.map((doc) => ({
    params: {
      event_id: doc.event_id.toString(),
    },
  }))
  return { paths, fallback: false }
}

// この関数がビルド時に呼び出され、戻り値の props の値がページコンポーネントに渡される
export const getStaticProps = async (context: GetStaticPropsContext) => {
  // 本来は、ここで外部 API などを呼び出してデータを取得する

  const { event_id } = context.params as PathParams

  const { data, error } = await supabase
    .from('events')
    .select(
      'event_id, event_name, date, url, items, content_id2, content_id3, contents(content_id, content_name)',
    )
    .eq('event_id', event_id)
  console.log(data![0])
  const event: Event = {
    content_id: data![0].contents.content_id,
    content_name: data![0].contents.content_name,
    event_id: data![0].event_id,
    event_name: data![0].event_name,
    date: data![0].date,
    place: '',
    url: data![0].url,
    memo: '',
  }

  const items: ShowItem[] = []
  data![0].items.map((doc: any) => {
    const item: ShowItem = {
      item_id: doc.item_id,
      group: doc.group,
      order: doc.order,
      item_name: doc.item_name,
      item_type: doc.version,
      color: doc.color,
      size: doc.size,
      price: doc.price,
      item_count: 0,
      check: false,
    }
    items.push(item)
  })

  const groups: ShowGroup[] = []
  let now_group = 1
  data![0].items.map((item: any) => {
    if (item.group == now_group) {
      groups[now_group - 1] = {
        group: item.group,
        item_version_count: 0,
        item_check_count: 0,
        check: false,
      }
      now_group++
    }
  })

  type PageProps = {
    propsEvent: Event
    propsShowItems: ShowItem[]
    propsShowGroups: ShowGroup[]
  }
  const props: PageProps = {
    propsEvent: event,
    propsShowItems: items,
    propsShowGroups: groups,
  }

  return { props }
}

const Home = ({ propsEvent, propsShowItems, propsShowGroups }: Props) => {
  //ログインユーザー
  const { currentUser }: any = useContext(AuthContext)

  //保存した場合のリストのID
  const [listId, setListId] = useState(0)

  // アイテムの配列
  const [items, setItems] = useState<ShowItem[]>([])

  // グループの配列
  const [group, setGroup] = useState<ShowGroup[]>([])

  //日程(YYYY-MM-DD)
  const [date, setDate] = useState(propsEvent.date)

  //会場名
  const [place, setPlace] = useState('')

  //メモ
  const [memo, setMemo] = useState('')

  //合計金額
  const [totalPrice, setTotalPrice] = useState(0)

  //合計個数
  const [totalCount, setTotalCount] = useState(0)

  const router = useRouter()

  useEffect(() => {
    const localStorageEventId = localStorage.getItem('eventId')
    //ローカルストレージに引き継がれたイベントIDがあるかどうか
    if (localStorageEventId) {
      //引き継がれたイベントIDと今表示しているイベントが一致するかどうか
      if (localStorageEventId == String(propsEvent.event_id)) {
        //一致しているなら、ローカルストレージから情報を読み込む

        //ローカルストレージのアイテムカウントを読み込み、アイテムを更新する。
        const localStorageItemCounts = JSON.parse(localStorage.getItem('itemCounts')!)
        const newItems: ShowItem[] = []
        localStorageItemCounts.map((ItemCount: ItemCount) => {
          propsShowItems.map((showItem: ShowItem) => {
            if (ItemCount.item_id == showItem.item_id) {
              showItem.item_count = ItemCount.item_count
              newItems.push(showItem)
            }
          })
        })
        setItems(newItems)

        //リストIDがあるなら、ステートに読み込む。
        const localStorageListId = localStorage.getItem('listId')
        if (localStorageListId) setListId(Number(localStorageListId))

        //会場名があるなら、ステートに読み込む。
        const localStorageDate = localStorage.getItem('date')
        if (localStorageDate) setDate(localStorageDate)

        //会場名があるなら、ステートに読み込む。
        const localStoragePlace = localStorage.getItem('place')
        if (localStoragePlace) setPlace(localStoragePlace)

        //メモがあるなら、ステートに読み込む。
        const localStorageMemo = localStorage.getItem('memo')
        if (localStorageMemo) setMemo(localStorageMemo)

        //一致しない場合、ローカルストレージの情報を削除して新規にイベントIDを追加
      } else {
        localStorage.removeItem('listId')
        localStorage.removeItem('items')
        localStorage.removeItem('date')
        localStorage.removeItem('place')
        localStorage.setItem('eventId', String(propsEvent.event_id))
      }
      //引き継がれたイベントIDがない場合、新規にイベントIDを追加
    } else localStorage.setItem('eventId', String(propsEvent.event_id))
  }, [])

  useEffect(() => {
    let totalPrice: number = 0
    let totalCount: number = 0
    items.map((item) => {
      if (item.item_count > 0) {
        totalPrice = totalPrice + item.price * item.item_count
        totalCount = totalCount + item.item_count
      }
    })
    setTotalPrice(totalPrice)
    setTotalCount(totalCount)
  }, [items])

  let prevGroupId = 0

  const checkItem = (index: number) => {
    const newitems = [...items]
    if (newitems[index].check == false) newitems[index].check = true
    else newitems[index].check = false
    setItems(newitems)
  }

  // useEffect(() => {

  // },[items])

  const meta: MetaProps = {
    title: propsEvent.content_name + ' ' + propsEvent.event_name,
    url: 'https://goodslist-pearl.vercel.app/event/' + propsEvent.event_id,
    image: 'https://goodslist-pearl.vercel.app/ogp/' + propsEvent.event_id,
  }

  const [isCheckItem, setIsCheckItem] = useState<boolean[]>(
    new Array<boolean>(items.length).fill(false),
  )

  return (
    <>
      <Meta title={meta.title} url={meta.url} image={meta.image} />
      <Header />
      <div className={styles.sticky_container}>
        <div className={styles.wrapper_white}>
          <main className={styles.main}>
            <Title title='Show List' />
            <div className={styles.contant_name_container}>
              <p className={styles.content_name}>{propsEvent.content_name}</p>
            </div>
            <div className={styles.event_title_container}>
              <h1 className={styles.h1}>{propsEvent.event_name}</h1>
            </div>
            <div className={styles.event_date_container}>
              <p className={styles.event_date}>{dateFormat(date)}</p>
              {place ? <p className={styles.s_event_date}>{place}</p> : <></>}
            </div>
            <Link href={'../../event/' + propsEvent.event_id}>
              <a>
                <button className={styles.btn_show_list_active}>Create List</button>
              </a>
            </Link>
          </main>
        </div>
        <div className={styles.wrapper_glay}>
          <main className={styles.main}>
            <div className={styles.screenshot_container}>
              <p className={styles.s_content_name}>{propsEvent.content_name}</p>
              <p className={styles.s_event_name}>{propsEvent.event_name}</p>
              <p className={styles.s_event_date}>{dateFormat(date)}</p>
              {place ? <p className={styles.s_event_date}>{place}</p> : <></>}
              {memo ? <p className={styles.s_event_date}>{memo}</p> : <></>}
              <div className={styles.s_total_container}>
                <div className={styles.s_total_count}>{totalCount}点</div>
                <div className={styles.s_total_price}>&yen;{numberFormat(totalPrice)}</div>
              </div>
              {items.map((item: ShowItem, index) =>
                (() => {
                  if (item.item_count > 0) {
                    if (prevGroupId != item.group) {
                      prevGroupId = item.group
                      return (
                        <>
                          <hr className={styles.li_goods_line} />
                          <p className={styles.s_item_name}>{item.item_name}</p>
                          <div
                            className={
                              items[index].check
                                ? styles.s_detail_container_checked
                                : styles.s_detail_container
                            }
                            onClick={() => checkItem(index)}
                          >
                            <p className={styles.s_item_type}>
                              {item.item_type}
                              {item.item_type && item.color ? ' ' : ''}
                              {item.color}
                              {item.color && item.size ? ' ' : ''}
                              {item.size}
                            </p>
                            <p className={styles.s_price}>
                              &yen;{numberFormat(Number(item.price))} x {item.item_count}
                            </p>
                          </div>
                        </>
                      )
                    } else {
                      return (
                        <>
                          <div
                            className={
                              items[index].check
                                ? styles.s_detail_container_checked
                                : styles.s_detail_container
                            }
                            onClick={() => checkItem(index)}
                          >
                            <p className={styles.s_item_type}>
                              {item.item_type}
                              {item.item_type && item.color ? ' ' : ''}
                              {item.color}
                              {item.color && item.size ? ' ' : ''}
                              {item.size}
                            </p>
                            <p className={styles.s_price}>
                              &yen;{numberFormat(Number(item.price))} x {item.item_count}
                            </p>
                          </div>
                        </>
                      )
                    }
                  }
                })(),
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default Home
