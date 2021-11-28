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
import { supabase } from '../../components/supabase'
import styles from '../../styles/Goods.module.css'
import { GetStaticPaths } from 'next'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Calendar from '../img/calendar.svg'
import Official_mobile from '../img/official_mobile.svg'
import IconTwitter from '../img/icon_twitter.svg'
import IconMemo from '../../../public/images/memo.svg'
import IconPlace from '../../../public/images/place.svg'
import IconScreenshot from '../../../public/images/screenshot.svg'
import Newlist from '../../../public/images/newlist.svg'
import Line from '../img/line.svg'
import Reset from '../img/reset.svg'
import Save from '../img/save.svg'
import Button_top from '../../components/Button_top'
import { animateScroll as scroll } from 'react-scroll'
import { numberFormat, dateFormat } from '../../components/Utils'
import { AuthContext } from '../../components/auth/AuthContext'
import { ListContext } from '../../components/list/ListContext'
import { ModalContext } from '../../components/modal/ModalContext'
import Modal from '../../components/modal/Modal'
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
} from '../../components/list/Sort'
import { EventInfo, Group, Item, SaveItem } from '../../components/types/event'

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
  const {
    currentListId,
    setCurrentListId,
    currentEventId,
    setCurrentEventId,
    currentItems,
    setCurrentItems,
    currentGroups,
    setCurrentGroups,
  } = useContext(ListContext)

  // setAGroups(propsGroups)
  // console.log(agroups)
  // const { currentListId, setCurrentListId, items, setItems, groups, setGroups } =
  //   useContext(ListContext)
  // useEffect(() => {
  //   setGroups(propsGroups.map((group) => Object.assign({}, group)))
  //   setItems(propsItems.map((item) => Object.assign({}, item)))
  //   console.log(propsGroups.map((group) => Object.assign({}, group)))
  // }, [])

  setCurrentEventId(propsEvent.event_id)

  // //グッズの情報の配列
  const [items, setItems] = useState<Item[]>(propsItems.map((item) => Object.assign({}, item)))
  setCurrentItems(items)

  // //グッズの情報の初期値の配列(更新しない)
  const initialItems: Item[] = [...propsItems.map((item) => Object.assign({}, item))]

  //グッズグループ情報の配列

  const [groups, setGroups] = useState(propsGroups.map((group) => Object.assign({}, group)))
  setCurrentGroups(groups)
  useEffect(() => {
    setCurrentGroups(groups)
  }, [groups])

  useEffect(() => {
    setCurrentItems(items)
  }, [items])

  const test = () => {
    currentItems!.map((newItem) => {
      if (newItem.item_id == 438) console.log(newItem.item_name)
    })
  }

  //グッズグループ情報の初期値の配列(更新しない)
  const initialGroups: Group[] = [...propsGroups]

  //合計金額
  const [TotalPrice, setTotalPrice] = useState(0)

  //合計個数
  const [TotalCount, setTotalCount] = useState(0)

  //会場
  const [place, setPlace] = useState('千葉県 幕張メッセ 国際展示場9〜11ホール')

  //会場
  const [isPlace, setIsPlace] = useState(true)

  const [errorPlace, setErrorPlace] = useState('')

  //メモの内容
  const [memo, setMemo] = useState('〇〇の分')

  //メモ
  const [isMemo, setIsMemo] = useState(false)

  //今セーブできるかどうかのフラグ
  const [isSave, setIsSave] = useState(false)

  //リセットボタンが押された場合、グッズとグループのカウントを0にする
  const reset = () => {
    sort('default')
    setItems(initialItems.map((item) => Object.assign({}, item)))
    setGroups(initialGroups.map((initialGroup) => Object.assign({}, initialGroup)))
    setIsDefaultSort(true)

    //モーダルを閉じる
    setOpenModalFlag(false)
    setOpenModalContentFlag(false)
  }

  //プラスボタンが押されるとグッズのカウントを+1する。
  const plusCount = (id: number) => {
    const newItems = [...items]
    const newGroups = [...groups]
    if (newItems[id].item_count < 99) {
      newItems[id].item_count = newItems[id].item_count + 1
      setItems(newItems)
      //小計のカウントを+1する。
      newGroups.map((newGroup) => {
        if (newGroup.group_id == newItems[id].group_id) newGroup.group_count++
      })
      setGroups(newGroups)
      setIsSave(true)
    }
  }

  //マイナスボタンが押されるとグッズのカウントを-1する。
  const minusCount = (id: number) => {
    const newItems = [...items]
    const newGroups = [...groups]
    if (newItems[id].item_count > 0) {
      newItems[id].item_count = newItems[id].item_count - 1
      setItems(newItems)
      //小計のカウントを+1する。
      newGroups.map((newGroup) => {
        if (newGroup.group_id == newItems[id].group_id) newGroup.group_count--
      })
      setGroups(newGroups)
      setIsSave(true)
    }
  }

  //グッズのカウントが更新されたら、合計金額を更新する。
  useEffect(() => {
    const newItems = [...items]
    const newGroups = [...groups]
    let newTotalPrice = 0
    let newTotalCount = 0
    newItems.map((newItem) => {
      newTotalPrice = newTotalPrice + newItem.price * newItem.item_count
      newTotalCount = newTotalCount + newItem.item_count
    })
    newGroups.map((newGroup) => {
      newGroup.sub_total = newGroup.price * newGroup.group_count
    })
    if (newTotalPrice > 999999) newTotalPrice = 999999
    setTotalPrice(newTotalPrice)
    setTotalCount(newTotalCount)
    setGroups(newGroups)
  }, [items])

  //グループの矢印がクリックされたら、グッズの個数の入力蘭を開閉する。
  const chengeOpenCloseCss = (group_id: number) => {
    const newGroups = [...groups]
    if (groups[group_id].open == true) {
      newGroups[group_id].open = false
    } else {
      newGroups[group_id].open = true
    }
    setGroups(newGroups)
  }

  const { setOpenModalFlag, modalType, setModalType, setOpenModalContentFlag }: any =
    useContext(ModalContext)

  const save = async () => {
    if (currentUser) {
      let itemCounts: SaveItem[] = []
      currentItems?.map((item) => {
        if (item.item_count > 0) {
          const itemCount = { item_id: item.item_id, item_count: item.item_count }
          itemCounts.push(itemCount)
        }
      })
      console.log(itemCounts)

      const { data, error } = await supabase.from('lists').insert([
        {
          user_id: currentUser,
          event_id: propsEvent.event_id,
          date: new Date(),
          groups: 'グループ1',
          goods: itemCounts,
          updated_at: new Date(),
        },
      ])
      if (data) setCurrentListId(data[0].list_id)
    }
    setIsSave(false)
  }

  const openModal = (action: string) => {
    setOpenModalFlag(true)
    setModalType(action)
    setOpenModalContentFlag(true)

    if (action == 'save') {
      setTimeout(function () {
        setOpenModalFlag(false)
        setOpenModalContentFlag(false)
      }, 1000)
    }
  }

  const [prevGroups, setPrevGroups] = useState(
    groups.map((group: Group) => Object.assign({}, group)),
  )
  const [prevGroupHeights, setPrevGroupHeights] = useState<any>([])
  const nowGroupHeights = useRef<any>([])
  const [isDefaultSort, setIsDefaultSort] = useState(true)
  const [sortFlag, setSortFlag] = useState(false)

  //グループの高さを取得する
  prevGroups.forEach((_: any, i: number) => {
    nowGroupHeights.current[i] = createRef()
  })

  const sort = (sortType: string) => {
    //ソート直前のリストを保持する
    setPrevGroups([...groups])

    //ソート前のグループの高さを取得する
    const newPrevGroupHeights = getPrevGroupHeights(nowGroupHeights)
    setPrevGroupHeights(newPrevGroupHeights)

    //ソートボタンの色を変える
    sortType == 'buy' ? setIsDefaultSort(false) : setIsDefaultSort(true)

    //グループをソートする（この時点ではまだ画面にレンダリングはされていない）
    const sortedGroups = sortGroups(sortType, groups)
    setGroups(sortedGroups)

    //ソートしたグループと同じ順にアイテムをソートする
    // const sortedItems = sortItems(sortedGroups, items)
    // setItems(sortedItems)

    // フラグを変えてuseLayoutEffectを呼び出す
    sortFlag ? setSortFlag(false) : setSortFlag(true)
  }

  //ソート処理の続き（useLayoutEffectなのでまだレンダリング前）
  useLayoutEffect(() => {
    //ソート直後のリストの高さを取得する
    const newGroupHeights = getAfterGroupHeights(nowGroupHeights)

    //ソート前後のリストを比較しグループのtopの値の差分を取得する
    const differenceGroupHeights = getDifferenceGroupHeights(
      groups,
      prevGroups,
      prevGroupHeights,
      newGroupHeights,
    )

    //ソートしたリストを差分を足して一時的に元の位置にずらす
    returnPosition(groups, nowGroupHeights, differenceGroupHeights)

    //requestAnimationFrameにより1フレーム後（ここからレンダリング後）にアニメーションをスタートさせる
    startSortAnimation(groups, nowGroupHeights)
  }, [sortFlag])

  const [date, setDate] = useState<Date | null>(new Date())

  const changeDateHandler = (newDate: Date | null): void => {
    setDate(newDate)
  }

  class ExtendedUtils extends DateFnsUtils {
    getCalendarHeaderText(date: Date) {
      return format(date, 'yyyy年MMM', { locale: this.locale })
    }
    getDatePickerHeaderText(date: Date) {
      return format(date, 'MMMd日(E)', { locale: this.locale })
    }

    getYearText = (date: Date): string => {
      const seireki = date.getFullYear() + '年'
      return seireki
    }
  }

  const clickMemo = () => {
    isMemo ? setIsMemo(false) : setIsMemo(true)
  }

  const clickPlace = () => {
    isPlace ? setIsPlace(false) : setIsPlace(true)
  }

  const allClose = () => {
    const newGroups = [...groups]
    newGroups.map((newGroup) => {
      newGroup.open = false
    })
    setGroups(newGroups)
  }

  const allOpen = () => {
    const newGroups = [...groups]
    newGroups.map((newGroup) => {
      newGroup.open = true
    })
    setGroups(newGroups)
  }

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
        <div className={styles.total_bar_container}>
          <div className={styles.total_bar}>
            <div
              className={isSave && TotalPrice > 0 ? styles.save : styles.save_off}
              onClick={() => save()}
            >
              <Save />
              保存
            </div>
            <div className={styles.total_count}>{TotalCount}点</div>
            <div className={styles.total}>&yen;{numberFormat(TotalPrice)}</div>
          </div>
        </div>
        <div className={styles.wrapper_white}>
          <main className={styles.main}>
            <div className={styles.list_header_container}>
              <div className={styles.list_header_status}>
                <p className={styles.tag_status}>
                  {currentListId ? 'マイリスト' + currentListId : '新規作成'}
                </p>
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
              <p className={styles.content_name} onClick={() => test()}>
                {propsEvent.content_name}
              </p>
            </div>
            <div className={styles.event_title_container}>
              <h1 className={styles.h1}>{propsEvent.event_name}</h1>
            </div>
            <div className={styles.event_date_container}>
              <p className={styles.event_date}>{dateFormat(propsEvent.date)}</p>
              <Calendar />
            </div>
            <div
              className={
                isPlace ? styles.event_place_container_active : styles.event_place_container
              }
            >
              <p className={styles.event_place}>{place}</p>
            </div>
            <div
              className={isMemo ? styles.event_memo_container_active : styles.event_memo_container}
            >
              <p className={styles.event_memo}>{memo}</p>
            </div>
            <div className={styles.event_link_container}>
              <a className={styles.tag_official} href={propsEvent.url} target='_blank'>
                公式サイト
                <Official_mobile />
              </a>
              <p className={styles.tag_memo} onClick={() => openModal('place')}>
                会場名
                <IconPlace />
              </p>
              <p className={styles.tag_memo} onClick={() => clickMemo()}>
                メモ
                <IconMemo />
              </p>
              <Link href={'screenshot/' + propsEvent.event_id}>
                <a className={styles.tag_screenshot}>
                  スクショ
                  <IconScreenshot />
                </a>
              </Link>
              <p className={styles.tag_official} onClick={() => openModal('reset')}>
                リセット
                <Reset />
              </p>
              {/* <a href={propsEvent.url} target='_blank' className={styles.tag_screenshot}>
                新規作成
                <Newlist />
              </a> */}
            </div>
            {/* <div className={styles.event_link_container}>
              <a href={propsEvent.url} target='_blank' className={styles.tag_screenshot}>
                ツイート
                <IconTwitter />
              </a>
              <a href={propsEvent.url} target='_blank' className={styles.tag_screenshot}>
                LINE
                <Line />
              </a>
            </div> */}
          </main>
        </div>
        <div className={styles.wrapper_glay}>
          <main className={styles.main}>
            <div className={styles.sort_arrow_container}>
              <div className={styles.arrow_container}>
                <span className={styles.arrow_all_close} onClick={() => allClose()} />
                <span className={styles.arrow_all_open} onClick={() => allOpen()} />
              </div>
              <div className={styles.sort_container}>
                <button
                  className={isDefaultSort ? styles.sort_nomal_active : styles.sort_nomal}
                  onClick={currentUser ? () => sort('default') : () => openModal('login')}
                >
                  通常順
                </button>
                <button
                  className={isDefaultSort ? styles.sort_buy : styles.sort_buy_active}
                  onClick={currentUser ? () => sort('buy') : () => openModal('login')}
                >
                  購入順
                </button>
              </div>
            </div>
            <div className={styles.grid}>
              {/* <MuiPickersUtilsProvider utils={ExtendedUtils} locale={jaLocale}>
                <DatePicker
                  value={date}
                  onChange={changeDateHandler}
                  format='yyyy年MMMd日(E)'
                  label='DateTimePicker'
                />
              </MuiPickersUtilsProvider> */}
              <ul className={styles.ul_event}>
                {groups.map((group: Group, index: number) => (
                  <>
                    <li
                      className={styles.card2}
                      key={group.group_id}
                      id={String(group.group_id)}
                      ref={nowGroupHeights.current[index]}
                    >
                      <div className={styles.goods_name}>{group.item_name}</div>
                      <div className={styles.subtotalcontainer}>
                        <span
                          className={
                            groups[index].open ? styles.group_arrow_open : styles.group_arrow_close
                          }
                          onClick={() => chengeOpenCloseCss(index)}
                        ></span>
                        <div className={styles.subtotalwrap}>
                          <div className={styles.subtotalcount}>{groups[index].group_count}点</div>
                          <div className={styles.subtotal}>
                            &yen;
                            {numberFormat(groups[index].sub_total)}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          groups[index].open
                            ? styles.goods_items_container
                            : styles.goods_items_container_active
                        }
                      >
                        <hr className={styles.li_goods_line} />
                        {items.map((item: Item, index: number) =>
                          (() => {
                            if (group.group_id == item.group_id) {
                              return (
                                <>
                                  <div className={styles.goods_detail_container}>
                                    <div className={styles.goods_type_container}>
                                      {item.item_type} {item.color} {item.size}
                                    </div>
                                    <div className={styles.goods_price_container}>
                                      &yen;{numberFormat(item.price)} x {item.item_count}
                                    </div>
                                    <div className={styles.plus_minus_container}>
                                      <button
                                        onClick={() => minusCount(index)}
                                        className={
                                          item.item_count > 0
                                            ? styles.minusButtonOn
                                            : styles.minusButtonOff
                                        }
                                      >
                                        <span></span>
                                      </button>
                                      <button
                                        onClick={() => plusCount(index)}
                                        className={
                                          item.item_count < 99
                                            ? styles.plusButtonOn
                                            : styles.plusButtonOff
                                        }
                                      >
                                        <span></span>
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )
                            }
                          })(),
                        )}
                      </div>
                    </li>
                  </>
                ))}
              </ul>
            </div>
          </main>
        </div>
      </div>
      <Modal reset={reset} />
      {/* <Modal reset={reset} place={place} onChangePlace={setPlace} errorPlace={errorPlace} /> */}
    </>
  )
}

export default Home
