import Link from 'next/link'
import React from 'react'
import { GetStaticProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import { supabase } from '../../components/supabase'
import styles from '../../styles/Goods.module.css'
import { GetStaticPaths } from 'next'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Calendar from '../img/calendar.svg'
import Official_mobile from '../img/official_mobile.svg'
import IconTwitter from '../img/icon_twitter.svg'
import IconMemo from '../../../public/images/memo.svg'
import IconPlace from '../../../public/images/place.svg'
import IconPreview from '../../../public/images/preview.svg'
import Newlist from '../../../public/images/newlist.svg'
import Line from '../img/line.svg'
import Reset from '../img/reset.svg'
import Button_top from '../../components/Button_top'
import { animateScroll as scroll } from 'react-scroll'
import { numberFormat, dateFormat } from '../../components/Utils'
import { AuthContext } from '../../components/auth/AuthContext'
import { ModalContext } from '../../components/modal/ModalContext'
import Modal from '../../components/modal/Modal'
import Loading from '../../components/modal/Loading'
import DateFnsUtils from '@date-io/date-fns'
import jaLocale from 'date-fns/locale/ja'
import { format } from 'date-fns'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { Event, Group, Item, ItemCount } from '../../components/types'
import { createTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { useTotalPrice } from '../../components/hooks/event/useTotalPrice'
import { useGroups } from '../../components/hooks/event/useGroups'
import { useItems } from '../../components/hooks/event/useItems'
import { useDate } from '../../components/hooks/event/useDate'

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
    .from('items')
    .select(
      'item_id, item_name, group, order, version, color, size, price, events(event_id, event_name, date, url, contents(content_id, content_name))',
    )
    .eq('event_id', event_id)

  const event: Event = {
    content_id: data![0].events.contents.content_id,
    content_name: data![0].events.contents.content_name,
    event_id: data![0].events.event_id,
    event_name: data![0].events.event_name,
    date: data![0].events.date,
    place: '',
    url: data![0].events.url,
    memo: '',
  }

  const items: Item[] = []
  data?.map((doc) => {
    const item: Item = {
      item_id: doc.item_id,
      item_name: doc.item_name,
      group: doc.group,
      item_type: doc.version,
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
    if (item.group == now_group) {
      groups[now_group - 1] = {
        group: item.group,
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
    propsEvent: Event
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

  //モーダル関連のコンテキスト
  const { setOpenModalFlag, setModalType, setOpenModalContentFlag, setIsLoading }: any =
    useContext(ModalContext)

  //保存した場合のリストのID
  const [listId, setListId] = useState(0)

  // アイテムの配列、アイテムカウントの配列、アイテムカウントの計算、保存可能かどうかのフラグ
  const [items, setItems, itemCounts, setItemCounts, countPlus, countMinus, isSave, setIsSave] =
    useItems(propsItems)

  //グループの配列、小計の計算、インプット欄の開閉、ソート
  const [
    groups,
    setGroups,
    countSubTotal,
    openOrCloseItemInput,
    closeAllItemInputs,
    openAllItemInputs,
    sort,
    nowGroupHeights,
    isDefaultSort,
    setIsDefaultSort,
    isAllOpenArrow,
    setIsAllOpenArrow,
    isAllCloseArrow,
    setIsAllCloseArrow,
  ] = useGroups(propsGroups)

  //合計金額と合計個数
  const [totalPrice, totalCount, countTotalPrice] = useTotalPrice()

  //日程(YYYY-MM-DD)
  const [date, setDate] = useState(propsEvent.date)

  //会場名
  const [place, setPlace] = useState('')

  //会場名入力のエラー
  const [errorPlace, setErrorPlace] = useState('')

  //メモの内容
  const [memo, setMemo] = useState('')

  //メモ入力のエラー
  const [errorMemo, setErrorMemo] = useState('')

  //クライアントサイドでの初回レンダリング前の処理
  useEffect(() => {
    const localStorageEventId = localStorage.getItem('eventId')
    //ローカルストレージに引き継がれたイベントIDがあるかどうか
    if (localStorageEventId) {
      //引き継がれたイベントIDと今表示しているイベントが一致するかどうか
      if (localStorageEventId == String(propsEvent.event_id)) {
        //一致している場合、ローカルストレージから情報を読み込む

        //ローカルストレージのアイテムカウントを読み込み、アイテムを更新する。
        const localStorageItemCounts = JSON.parse(localStorage.getItem('itemCounts')!)
        const newItems = [...items]
        localStorageItemCounts.map((ItemCount: ItemCount) => {
          newItems.map((item: Item) => {
            if (ItemCount.item_id == item.item_id) item.item_count = ItemCount.item_count
          })
        })
        setItems(newItems)
        setItemCounts(localStorageItemCounts)

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
        localStorage.removeItem('itemCounts')
        localStorage.removeItem('date')
        localStorage.removeItem('place')
        localStorage.removeItem('memo')
        localStorage.setItem('eventId', String(propsEvent.event_id))
      }
      //引き継がれたイベントIDがない場合、新規にイベントIDを追加
    } else localStorage.setItem('eventId', String(propsEvent.event_id))
  }, [])

  //アイテムカウントが更新されたら小計と合計金額を計算し、ローカルストレージのアイテムカウントをを更新する。
  useEffect(() => {
    countSubTotal(items)
    countTotalPrice(items)
    localStorage.setItem('itemCounts', JSON.stringify(itemCounts))
  }, [itemCounts])

  //日時が更新されたら、ローカルストレージの日時をを更新する。
  useEffect(() => {
    localStorage.setItem('date', date)
  }, [date])

  //会場名が更新されたら、ローカルストレージの会場名をを更新する。
  useEffect(() => {
    localStorage.setItem('place', place)
  }, [place])

  //メモが更新されたら、ローカルストレージのメモをを更新する。
  useEffect(() => {
    localStorage.setItem('memo', memo)
  }, [memo])
  //会場名の入力文字数制限をする。
  const validatePlace = (place: string) => {
    if (place.length < 31) setPlace(place)
  }
  //メモの入力文字数制限をする。
  const validateMemo = (memo: string) => {
    if (memo.length < 101) setMemo(memo)
  }
  //リセットボタンが押されたら、グッズとグループとアイテムカウントのカウントを0にし、ソートを通常順にする。
  const reset = () => {
    sort('default')
    setItems(propsItems.map((item) => Object.assign({}, item)))
    setGroups(propsGroups.map((group) => Object.assign({}, group)))
    setItemCounts([])
    setIsDefaultSort(true)

    //モーダルを閉じる
    setOpenModalFlag(false)
    setOpenModalContentFlag(false)
  }

  const save = async () => {
    //ユーザーがログインしているなら保存に進む。
    if (currentUser) {
      setIsLoading(true)

      //リストIDが存在するなら、上書き保存する。
      if (listId) {
        console.log('リストあり')
        const { data, error } = await supabase
          .from('lists')
          .update({
            date: date,
            place: place,
            memo: memo,
            total_price: totalPrice,
            total_count: totalCount,
            item_counts: itemCounts,
          })
          .eq('list_id', listId)
        //リストIDが存在しないなら、新規保存し、ローカルストレージにリストIDを追加する。
      } else {
        console.log('リストなし')
        const { data, error } = await supabase.from('lists').insert([
          {
            user_id: currentUser.user_id,
            event_id: propsEvent.event_id,
            date: date,
            place: place,
            memo: memo,
            total_price: totalPrice,
            total_count: totalCount,
            item_counts: itemCounts,
          },
        ])
        if (data) {
          setListId(data[0].list_id)
          localStorage.setItem('listId', String(data[0].list_id))
        }
      }

      setIsLoading(false)
      setOpenModalFlag(true)
      setOpenModalContentFlag(true)
      setModalType('save')
      setTimeout(function () {
        setOpenModalFlag(false)
        setOpenModalContentFlag(false)
      }, 1000)
      setIsSave(false)
      //ユーザーがログインしていないなら、ログイン案内のモーダルを表示する。
    } else {
      openModal('notLogin')
    }
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

  const changeDateHandler = (newDate: any): void => {
    // setDate(newDate)
    setDate(
      newDate.getFullYear() + '-' + (Number(newDate.getMonth()) + 1) + '-' + newDate.getDate(),
    )
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

  const materialTheme = createTheme({
    palette: {
      primary: {
        main: '#68a9cf',
      },
    },
    overrides: {
      //overrideで既存スタイルを上書き
      MuiInputBase: {
        root: {
          width: '170px',
        },
        input: {
          background: '#ffffff',
          padding: '10px 0px',
          fontSize: '1.4rem',
          color: '#666666',
          cursor: 'pointer',
          '&&::focus': {
            border: 'none',
          },
          '&&:hover': {
            border: 'none',
          },
        },
      },
      MuiInput: {
        underline: {
          border: 'none',
          '&&::before': {
            border: 'none',
          },
          '&&:hover::before': {
            border: 'none',
          },
          '&&:hover::after': {
            border: 'none',
          },
          '&&::after': {
            border: 'none',
          },
          '&&::focus': {
            border: 'none',
          },
        },
      },
      MuiOutlinedInput: {
        input: {
          padding: '5px',
        },
        notchedOutline: {
          border: 'none',
        },
      },
    },
  })

  const createNewList = () => {
    localStorage.removeItem('listId')
    localStorage.removeItem('eventId')
    localStorage.removeItem('date')
    localStorage.removeItem('place')
    localStorage.removeItem('memo')
    localStorage.removeItem('itemCounts')
    location.reload()
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
      </Head>
      <div className={styles.sticky_container}>
        <div className={styles.total_bar_container}>
          <div className={styles.total_bar}>
            <div className={styles.total_count}>{totalCount}点</div>
            <div className={styles.total}>&yen;{numberFormat(totalPrice)}</div>
          </div>
        </div>
        <div className={styles.wrapper_white}>
          <main className={styles.main}>
            <div className={styles.list_header_container}>
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
              {/* <p className={styles.event_date}>{dateFormat(date)}</p> */}
              <MuiPickersUtilsProvider utils={ExtendedUtils} locale={jaLocale}>
                <ThemeProvider theme={materialTheme}>
                  <DatePicker value={date} onChange={changeDateHandler} format='yyyy年MMMd日(E)' />
                </ThemeProvider>
              </MuiPickersUtilsProvider>
              <Calendar />
            </div>
            {/* <MuiPickersUtilsProvider utils={ExtendedUtils} locale={jaLocale}>
              <ThemeProvider theme={materialTheme}>
                <DatePicker value={date} onChange={changeDateHandler} format='yyyy年MMMd日(E)' />
              </ThemeProvider>
            </MuiPickersUtilsProvider> */}
            <div
              className={
                place == '' ? styles.event_place_container : styles.event_place_container_active
              }
            >
              <p className={styles.event_place}>{place}</p>
            </div>
            <div
              className={
                memo == '' ? styles.event_memo_container : styles.event_memo_container_active
              }
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
              <p className={styles.tag_memo} onClick={() => openModal('memo')}>
                メモ
                <IconMemo />
              </p>
              <Link href={'list/' + propsEvent.event_id}>
                <a className={styles.tag_screenshot}>
                  購入一覧表示
                  <IconPreview />
                </a>
              </Link>
              <p className={styles.tag_official} onClick={() => openModal('reset')}>
                リセット
                <Reset />
              </p>
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
                {isAllCloseArrow ? (
                  <span
                    className={styles.arrow_all_close_active}
                    onClick={() => closeAllItemInputs()}
                  />
                ) : (
                  <span className={styles.arrow_all_close} />
                )}
                {isAllOpenArrow ? (
                  <span
                    className={styles.arrow_all_open_active}
                    onClick={() => openAllItemInputs()}
                  />
                ) : (
                  <span className={styles.arrow_all_open} />
                )}
              </div>
              <div className={styles.sort_container}>
                <button
                  className={isDefaultSort ? styles.sort_nomal_active : styles.sort_nomal}
                  onClick={() => sort('default')}
                >
                  通常順
                </button>
                <button
                  className={isDefaultSort ? styles.sort_buy : styles.sort_buy_active}
                  onClick={() => sort('buy')}
                >
                  購入順
                </button>
              </div>
            </div>
            <div className={styles.grid}>
              <ul className={styles.ul_event}>
                {groups.map((group: Group, index: number) => (
                  <>
                    <li
                      className={styles.card2}
                      key={group.group}
                      id={String(group.group)}
                      ref={nowGroupHeights.current[index]}
                    >
                      <div className={styles.goods_name}>{group.item_name}</div>
                      <div className={styles.subtotalcontainer}>
                        <span
                          className={
                            groups[index].open ? styles.group_arrow_open : styles.group_arrow_close
                          }
                          onClick={() => openOrCloseItemInput(index)}
                        ></span>
                        <div className={styles.subtotalwrap}>
                          <div className={styles.subtotalCount}>{groups[index].group_count}点</div>
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
                            if (group.group == item.group) {
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
                                        onClick={() => countMinus(item.item_id)}
                                        className={
                                          item.item_count > 0
                                            ? styles.minusButtonOn
                                            : styles.minusButtonOff
                                        }
                                      >
                                        <span></span>
                                      </button>
                                      <button
                                        onClick={() => countPlus(item.item_id)}
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
      <Modal
        onClick={reset}
        place={place}
        onChangePlace={validatePlace}
        errorPlace={errorPlace}
        memo={memo}
        onChangeMemo={validateMemo}
        errorMemo={errorMemo}
      />
      <Loading />
    </>
  )
}

export default Home
