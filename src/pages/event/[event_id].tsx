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
import Icon_witter from '../img/icon_twitter.svg'
import Line from '../img/line.svg'
import Reset from '../img/reset.svg'
import Save from '../img/save.svg'
import Button_top from '../../components/Button_top'
import { animateScroll as scroll } from 'react-scroll'
import { numberFormat, dateFormat } from '../../components/Utils'
import { AuthContext } from '../../components/auth/AuthContext'
import { ModalContext } from '../../components/modal/ModalContext'
import Modal from '../../components/modal/Modal'
import DateFnsUtils from '@date-io/date-fns'
import jaLocale from 'date-fns/locale/ja'
import { format } from 'date-fns'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import {
  getPrevGroupHeights,
  sortGroups,
  sortItems,
  getAfterGroupHeights,
  getDifferenceGroupHeights,
  returnPosition,
} from '../../components/list/Sort'
import { EventInfo, Group, Item } from '../../components/types/event'

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
    url: data![0].events.url,
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
      goods_count: 0,
    }
    items.push(item)
  })

  const groups: Group[] = []
  let now_group = 1
  items.map((item, index) => {
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

  // //グッズの情報の配列
  const [items, setItems] = useState<Item[]>(propsItems.map((item) => Object.assign({}, item)))

  // //グッズの情報の初期値の配列(更新しない)
  const initialItems: Item[] = [...propsItems.map((item) => Object.assign({}, item))]

  //グッズグループ情報の配列
  const [groups, setGroups] = useState<Group[]>(
    propsGroups.map((group) => Object.assign({}, group)),
  )

  //グッズグループ情報の初期値の配列(更新しない)
  const initialGroups: Group[] = [...propsGroups]

  //合計金額
  const [TotalPrice, setTotalPrice] = useState(0)

  //合計個数
  const [TotalCount, setTotalCount] = useState(0)

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
    if (newItems[id].goods_count < 99) {
      newItems[id].goods_count = newItems[id].goods_count + 1
      setItems(newItems)
      //小計のカウントを+1する。
      newGroups.map((newGroup) => {
        if (newGroup.group_id == newItems[id].group_id) newGroup.group_count++
      })
      setGroups(newGroups)
    }
  }

  //マイナスボタンが押されるとグッズのカウントを-1する。
  const minusCount = (id: number) => {
    const newItems = [...items]
    const newGroups = [...groups]
    if (newItems[id].goods_count > 0) {
      newItems[id].goods_count = newItems[id].goods_count - 1
      setItems(newItems)
      //小計のカウントを+1する。
      newGroups.map((newGroup) => {
        if (newGroup.group_id == newItems[id].group_id) newGroup.group_count--
      })
      setGroups(newGroups)
    }
  }

  //グッズのカウントが更新されたら、合計金額を更新する。
  useEffect(() => {
    const newItems = [...items]
    const newGroups = [...groups]
    let newTotalPrice = 0
    let newTotalCount = 0
    newItems.map((newItem) => {
      newTotalPrice = newTotalPrice + newItem.price * newItem.goods_count
      newTotalCount = newTotalCount + newItem.goods_count
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

  const { openModalFlag, setOpenModalFlag, modalType, setModalType, setOpenModalContentFlag }: any =
    useContext(ModalContext)

  const save = async () => {
    const { data, error } = await supabase.from('lists').insert([
      {
        user_id: 'hsakHAGFSjggh',
        event_id: propsEvent.event_id,
        date: propsEvent.date,
        goods: items,
        updated_at: new Date(),
      },
    ])
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

  const [prevGroups, setPrevGroups] = useState(groups.map((group) => Object.assign({}, group)))
  const [prevGroupHeights, setPrevGroupHeights] = useState<any>([])
  const nowGroupHeights = useRef<any>([])
  const [isDefaultSort, setIsDefaultSort] = useState(true)
  const [sortFlag, setSortFlag] = useState(false)

  //グループの高さを取得する
  prevGroups.forEach((_, i) => {
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
    const sortedItems = sortItems(sortedGroups, items)
    setItems(sortedItems)

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
    requestAnimationFrame(() => {
      nowGroupHeights.current.forEach((ref: any, index: number) => {
        var li = document.getElementById(String(groups[index].group_id))
        if (li) {
          li.style.transform = ``
          li.style.transition = `transform 300ms ease`
        }
      })
    })
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
              className={TotalPrice > 0 ? styles.reset : styles.reset_off}
              onClick={() => openModal('reset')}
            >
              <span>
                <Reset />
              </span>
              リセット
            </div>
            {/* <div className={styles.save_off} onClick={() => openModal('save')}>
             */}
            <div className={styles.save_off} onClick={() => save()}>
              <span>
                <Save />
              </span>
              保存
            </div>
            <div className={styles.total_count}>{TotalCount}点</div>
            <div className={styles.total}>&yen;{numberFormat(TotalPrice)}</div>
          </div>
        </div>
        <div className={styles.wrapper_white}>
          <main className={styles.main}>
            <div className={styles.contant_name_container}>
              <p className={styles.content_name}>{propsEvent.content_name}</p>
            </div>
            <div className={styles.event_title_container}>
              <h1 className={styles.h1}>{propsEvent.event_name}</h1>
            </div>
            <div className={styles.event_date_container}>
              <p className={styles.event_date}>{dateFormat(propsEvent.date)}</p>
              <Calendar />
            </div>
            <div className={styles.event_link_container}>
              <a href={propsEvent.url} target='_blank'>
                <p className={styles.tag_official}>
                  公式サイト
                  <span>
                    <Official_mobile />
                  </span>
                </p>
              </a>
              <a href={propsEvent.url} target='_blank'>
                <p className={styles.tag_twitter}>
                  ツイート
                  <span>
                    <Icon_witter />
                  </span>
                </p>
              </a>
              <a href={propsEvent.url} target='_blank'>
                <p className={styles.tag_line}>
                  LINE
                  <span>
                    <Line />
                  </span>
                </p>
              </a>
            </div>
          </main>
        </div>
        <div className={styles.wrapper_glay}>
          <main className={styles.main}>
            <div className={styles.grid}>
              <div className={styles.sort_container}>
                <span
                  className={isDefaultSort ? styles.sort_nomal_active : styles.sort_nomal}
                  onClick={currentUser ? () => sort('default') : () => openModal('login')}
                >
                  通常順
                </span>
                　　　
                <span
                  className={isDefaultSort ? styles.sort_buy : styles.sort_buy_active}
                  onClick={currentUser ? () => sort('buy') : () => openModal('login')}
                >
                  購入順
                </span>
              </div>
              {/* <MuiPickersUtilsProvider utils={ExtendedUtils} locale={jaLocale}>
                <DatePicker
                  value={date}
                  onChange={changeDateHandler}
                  format='yyyy年MMMd日(E)'
                  label='DateTimePicker'
                />
              </MuiPickersUtilsProvider> */}
              <ul className={styles.ul_event}>
                {groups.map((group, index) => (
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
                        {items.map((item, index) =>
                          (() => {
                            if (group.group_id == item.group_id) {
                              return (
                                <>
                                  <div className={styles.goods_detail_container}>
                                    <div className={styles.goods_type_container}>
                                      {item.item_type} {item.color} {item.size}
                                    </div>
                                    <div className={styles.goods_price_container}>
                                      &yen;{numberFormat(item.price)} x {item.goods_count}
                                    </div>
                                    <div className={styles.plus_minus_container}>
                                      <button
                                        onClick={() => minusCount(index)}
                                        className={
                                          item.goods_count > 0
                                            ? styles.minusButtonOn
                                            : styles.minusButtonOff
                                        }
                                      >
                                        <span></span>
                                      </button>
                                      <button
                                        onClick={() => plusCount(index)}
                                        className={
                                          item.goods_count < 99
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
    </>
  )
}

export default Home
