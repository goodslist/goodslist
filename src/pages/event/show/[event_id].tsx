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
import { Event, ShowGroup, ShowItem, ItemCount } from '../../../components/types'
import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Meta from '../../../components/Meta'
import { MetaProps } from '../../../components/types'
import Title from '../../../components/view/title'
import BoxWhite from '../../../components/view/BoxWhite'
import BoxGray from '../../../components/view/BoxGray'
import SocialButton from '../../../components/form/SocialButton'
import InputTextArea from '../../../components/form/InputTextArea'
import Box from '../../../components/view/Box'

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
        item_name: item.item_name,
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

  //シェアリストのテキスト
  const [shareListText, setShareListText] = useState('BUMP OF CHICKEN')

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
        const newGroup: ShowGroup[] = [...propsShowGroups]
        localStorageItemCounts.map((ItemCount: ItemCount) => {
          propsShowItems.map((showItem: ShowItem) => {
            showItem.check = false
            if (ItemCount.item_id == showItem.item_id) {
              showItem.item_count = ItemCount.item_count
              newItems.push(showItem)
              newGroup[showItem.group - 1].item_version_count =
                newGroup[showItem.group - 1].item_version_count + 1

              newGroup[showItem.group - 1].check = false
              newGroup[showItem.group - 1].item_check_count = 0
            }
          })
        })
        setItems(newItems)
        setGroup(newGroup)

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

        let totalPrice: number = 0
        let totalCount: number = 0
        propsShowItems.map((item) => {
          if (item.item_count > 0) {
            totalPrice = totalPrice + item.price * item.item_count
            totalCount = totalCount + item.item_count
          }
        })
        setTotalPrice(totalPrice)
        setTotalCount(totalCount)

        let createShareListText = propsEvent.content_name + '\n' + propsEvent.event_name
        if (localStorageDate) createShareListText += '\n' + dateFormat(localStorageDate)
        else createShareListText += '\n' + dateFormat(propsEvent.date)
        if (localStoragePlace) createShareListText += '\n' + localStoragePlace
        if (localStorageMemo) createShareListText += '\n' + localStorageMemo
        createShareListText += '\n' + '\n'
        newGroup.map((group) => {
          if (group.item_version_count == 1) {
            newItems.map((item) => {
              if (group.group == item.group) {
                createShareListText += item.item_name + ' '
                createShareListText += createShareListVersionText(item)
                createShareListText +=
                  '￥' + numberFormat(Number(item.price)) + ' x' + item.item_count + '\n\n'
              }
            })
          } else if (group.item_version_count > 1) {
            let count = false
            newItems.map((item) => {
              if (group.group == item.group) {
                if (count == false) {
                  createShareListText += item.item_name + '\n'
                  count = true
                }
                createShareListText += createShareListVersionText(item) + ' '
                createShareListText +=
                  numberFormat(Number(item.price)) + ' x' + item.item_count + '\n'
              }
            })
            createShareListText += '\n'
          }
        })
        createShareListText +=
          totalCount +
          '点 ￥' +
          numberFormat(Number(totalPrice)) +
          '\n\n' +
          'GOODSist' +
          '\n' +
          'イベントグッズ代が計算できるWEBアプリ' +
          '\n' +
          'https://goodslist-pearl.vercel.app/' +
          'event/' +
          propsEvent.event_id

        setShareListText(createShareListText)

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

  const createShareListVersionText = (item: ShowItem) => {
    let versionText: string = ''
    if (item.item_type.length > 0) versionText += item.item_type + ' '
    if (item.color.length > 0) versionText += item.color + ' '
    if (item.size.length > 0) versionText += item.size + ' '
    return versionText
  }

  const resetChecked = () => {
    const newGroup = [...group]
    const newItems = [...items]

    newGroup.map((item) => {
      item.check = false
      item.item_check_count = 0
    })

    newItems.map((item) => {
      item.check = false
    })

    setGroup(newGroup)
    setItems(newItems)
    setCheckedItems(0)
  }

  const [checkedItems, setCheckedItems] = useState(0)
  const checkItem = (index: number) => {
    const newItems = [...items]
    const newGroup = [...group]
    if (newItems[index].check == false) {
      newItems[index].check = true
      newGroup[newItems[index].group - 1].item_check_count =
        newGroup[newItems[index].group - 1].item_check_count + 1
      setCheckedItems(checkedItems + 1)
    } else {
      newItems[index].check = false
      newGroup[newItems[index].group - 1].item_check_count =
        newGroup[newItems[index].group - 1].item_check_count - 1
      setCheckedItems(checkedItems - 1)
    }
    if (
      newGroup[newItems[index].group - 1].item_check_count ==
      newGroup[newItems[index].group - 1].item_version_count
    )
      newGroup[newItems[index].group - 1].check = true
    else newGroup[newItems[index].group - 1].check = false
    setItems(newItems)
    setGroup(newGroup)
    console.log(newGroup)
  }

  const meta: MetaProps = {
    title: propsEvent.content_name + ' ' + propsEvent.event_name,
    url: 'https://goodslist-pearl.vercel.app/event/' + propsEvent.event_id,
    image: 'https://goodslist-pearl.vercel.app/ogp/' + propsEvent.event_id,
  }

  return (
    <>
      <Meta title={meta.title} url={meta.url} image={meta.image} />
      <Header />
      <div className={styles.sticky_container}>
        <Box background='#fff' padding='60px 0 90px 0'>
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
        </Box>
        <Box background='#f1f1f1' padding='90px 0 60px 0'>
          <div
            className={
              checkedItems == items.length
                ? styles.screenshot_container_checked
                : styles.screenshot_container
            }
          >
            <p className={styles.s_content_name}>{propsEvent.content_name}</p>
            <p className={styles.s_event_name}>{propsEvent.event_name}</p>
            <p className={styles.s_event_date}>{dateFormat(date)}</p>
            {place ? <p className={styles.s_event_date}>{place}</p> : <></>}
            {memo ? <p className={styles.s_event_date}>{memo}</p> : <></>}
            {group.map((group: ShowGroup, index) =>
              (() => {
                if (group.item_version_count > 0) {
                  return (
                    <div
                      className={
                        group.check ? styles.group_container_checked : styles.group_container
                      }
                    >
                      <p className={styles.s_item_name}>
                        {group.item_name} {group.item_version_count}{' '}
                        {group.check ? 'true' : 'false'}
                      </p>
                      {items.map((item: ShowItem, index) =>
                        (() => {
                          if (group.group == item.group) {
                            return (
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
                            )
                          }
                        })(),
                      )}
                    </div>
                  )
                }
              })(),
            )}
            <div className={styles.s_total_container}>
              <div className={styles.s_total_count}>{totalCount}点</div>
              <div className={styles.s_total_price}>&yen;{numberFormat(totalPrice)}</div>
            </div>
          </div>
          <div className={styles.show_list_reset_container}>
            {checkedItems > 0 ? (
              <button className={styles.btn_show_list_reset_active} onClick={() => resetChecked()}>
                Reset
              </button>
            ) : (
              <button className={styles.btn_show_list_reset}>Reset</button>
            )}
          </div>
        </Box>
        <Box background='#fff' padding='60px 0 90px 0'>
          <Title title='Share List' />
          <p className={styles.list_sns_text}>
            完成したリストをSNS等で共有しよう。
            <br />
            Twitterは140文字の制限があるので、分割するかスクリーンショットを撮影して投稿できます。
            <br />
            LINEとメールはボタンを押せば投稿できます。
          </p>
          <InputTextArea
            name='share'
            placeholder='リストの内容(Twitterは140文字以内)'
            value={shareListText}
            onChange={setShareListText}
          />
          <p>{shareListText.length} / 140文字</p>
          <button className={styles.btn_login_twitter}>
            Twitterで共有
            <span></span>
          </button>
          <br></br>
          <button className={styles.btn_login_line}>
            LINEで共有
            <span></span>
          </button>
        </Box>
      </div>
    </>
  )
}

export default Home

{
  /* {items.map((item: ShowItem, index) =>
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
              )} */
}
