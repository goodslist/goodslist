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
import DateFnsUtils from '@date-io/date-fns'
import jaLocale from 'date-fns/locale/ja'
import { format } from 'date-fns'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import {
  getPrevGroupHeights,
  sortGroups,
  getAfterGroupHeights,
  getDifferenceGroupHeights,
  returnPosition,
  startSortAnimation,
} from '../../../components/list/Sort'
import { EventInfo, Group, Item, ItemCount } from '../../../components/types/event'
import { useRouter } from 'next/router'

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
    .from('goods')
    .select(
      'goods_id, goods_name, group_id, goods_type, color, size, price, events(event_id, event_name, first_date, url, contents(content_id, content_name))',
    )
    .eq('event_id', event_id)

  const event: EventInfo = {
    content_id: data![0].events.contents.content_id,
    content_name: data![0].events.contents.content_name,
    event_id: data![0].events.event_id,
    event_name: data![0].events.event_name,
    date: data![0].events.first_date,
    place: '',
    url: data![0].events.url,
    memo: '',
  }

  const items: Item[] = []
  data?.map((doc) => {
    const item: Item = {
      item_id: doc.goods_id,
      item_name: doc.goods_name,
      group_id: doc.group_id,
      item_type: doc.goods_type,
      color: doc.color,
      size: doc.size,
      price: doc.price,
      item_count: 0,
    }
    items.push(item)
  })

  const groups: Group[] = []
  let now_group = 1
  items.map((item) => {
    if (item.group_id == now_group) {
      groups[now_group - 1] = {
        group_id: item.group_id,
        item_name: item.item_name,
        group_count: 0,
        price: item.price,
        sub_total: 0,
        open: true,
      }
      now_group++
    }
  })

  type PageProps = {
    propsEvent: EventInfo
    propsItems: Item[]
    propsGroups: Group[]
  }
  const props: PageProps = {
    propsEvent: event,
    propsItems: items,
    propsGroups: groups,
  }

  return { props }
}

const Home = ({ propsEvent, propsItems, propsGroups }: Props) => {
  //ログインユーザー
  const { currentUser }: any = useContext(AuthContext)

  //保存した場合のリストのID
  const [listId, setListId] = useState(0)

  // アイテムの配列
  const [items, setItems] = useState<Item[]>(propsItems.map((item) => Object.assign({}, item)))

  //アイテムカウントの配列(DBとローカルストレージに保存する配列)
  const [itemCounts, setItemCounts] = useState<ItemCount[]>([])

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
        const newItems = [...items]
        localStorageItemCounts.map((ItemCount: ItemCount) => {
          newItems.map((item: Item) => {
            if (ItemCount.item_id == item.item_id) item.item_count = ItemCount.item_count
          })
        })
        setItems(newItems)

        //リストIDがあるなら、ステートに読み込む。
        const localStorageListId = localStorage.getItem('listId')
        if (localStorageListId) setListId(Number(localStorageListId))

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
        localStorage.removeItem('place')
        localStorage.setItem('eventId', String(propsEvent.event_id))
      }
      //引き継がれたイベントIDがない場合、新規にイベントIDを追加
    } else localStorage.setItem('eventId', String(propsEvent.event_id))

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
  }, [])
  let prevGroupId = 0

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
      <div className={styles.sticky_container}>
        <div className={styles.wrapper_white}>
          <main className={styles.main}>
            <div className={styles.list_header_container}>
              <div className={styles.list_header_status}>
                <p className={styles.tag_status}>{listId ? 'マイリスト' + listId : '新規作成'}</p>
              </div>
              <div className={styles.list_header_sns}>
                <a href={propsEvent.url} target='_blank'>
                  <p className={styles.tag_twitter}>
                    Twitter
                    <IconTwitter />
                  </p>
                </a>
                <a href={propsEvent.url} target='_blank'>
                  <p className={styles.tag_line}>
                    LINE
                    <Line />
                  </p>
                </a>
              </div>
            </div>
            <div className={styles.contant_name_container}>
              <p className={styles.content_name}>{propsEvent.content_name}</p>
            </div>
            <div className={styles.event_title_container}>
              <h1 className={styles.h1}>{propsEvent.event_name}</h1>
            </div>
            <div className={styles.event_date_container}>
              <p className={styles.event_date}>{dateFormat(propsEvent.date)}</p>
            </div>
            <div className={styles.event_screenshot_title}>一覧表示</div>
          </main>
        </div>
        <div className={styles.wrapper_glay}>
          <main className={styles.main}>
            <div className={styles.screenshot_container}>
              <p className={styles.s_content_name}>{propsEvent.content_name}</p>
              <p className={styles.s_event_name}>{propsEvent.event_name}</p>
              <p className={styles.s_event_date}>{dateFormat(propsEvent.date)}</p>
              {place ? <p className={styles.s_event_date}>{place}</p> : <></>}
              {memo ? <p className={styles.s_event_date}>{memo}</p> : <></>}
              <div className={styles.s_total_container}>
                <div className={styles.s_total_count}>{totalCount}点</div>
                <div className={styles.s_total_price}>&yen;{numberFormat(totalPrice)}</div>
              </div>
              {items.map((item: Item) =>
                (() => {
                  if (item.item_count > 0) {
                    if (prevGroupId != item.group_id) {
                      prevGroupId = item.group_id
                      return (
                        <>
                          <hr className={styles.li_goods_line} />
                          <p className={styles.s_item_name}>{item.item_name}</p>
                          <div className={styles.s_detail_container}>
                            <p className={styles.s_item_type}>
                              {item.item_type}
                              {item.item_type && item.color ? ' ' : ''}
                              {item.color}
                              {item.color && item.size ? ' ' : ''}
                              {item.size}
                            </p>
                            <p className={styles.s_price}>
                              &yen;{numberFormat(item.price)} x {item.item_count}
                            </p>
                          </div>
                        </>
                      )
                    } else {
                      return (
                        <>
                          <div className={styles.s_detail_container}>
                            <p className={styles.s_item_type}>
                              {item.item_type}
                              {item.item_type && item.color ? ' ' : ''}
                              {item.color}
                              {item.color && item.size ? ' ' : ''}
                              {item.size}
                            </p>
                            <p className={styles.s_price}>
                              &yen;{numberFormat(item.price)} x {item.item_count}
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
