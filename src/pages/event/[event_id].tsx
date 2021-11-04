import Link from 'next/link'
import React from 'react'
import { GetStaticProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect, useRef, useCallback, useContext } from 'react'
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
import Navbar from '../../components/Navber'
import { numberFormat, dateFormat } from '../../components/Utils'
import { ModalContext } from '../../components/modal/ModalContext'
import { forwardRef, useImperativeHandle } from 'react'

class EventInfo {
  content_id: number = 0
  content_name: string = ''
  event_id: number = 0
  event_name: string = ''
  first_date: string = '2000-00-00'
  url: string = ''
}

class Goods extends EventInfo {
  goods_id: number = 0
  goods_name: string = ''
  goods_group: number = 0
  goods_type: string = ''
  color: string = ''
  size: string = ''
  price: number = 0
  goods_count: number = 0
}

class GoodsGroupCount {
  goods_group: number = 0
  goods_name: string = ''
  goods_group_count: number = 0
  price: number = 0
  sub_total_price: number = 0
  open_flag: boolean = true
  open_flag_css: string = ''
  open_arrow_css: string = ''
}

type PathParams = {
  event_id: string
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export interface ChildHandles {
  getAlert(): void
}

export const Child = forwardRef<ChildHandles>((props, ref) => {
  // コンポーネントのインスタンスが拡張されます
  // 第2引数として渡されたコールバックから返されたもので拡張されます
  useImperativeHandle(ref, () => ({
    getAlert() {
      alert('getAlert from Child')
    },
  }))

  return <h1>Hi</h1>
})

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const { data, error } = await supabase.from('events').select('event_id')

  if (!data) {
    throw new Error('エラーです。')
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
      'goods_id, goods_name, goods_group, goods_type, color, size, price, events(event_id, event_name, first_date, url, contents(content_id, content_name))',
    )
    .eq('event_id', event_id)

  const goodsList: Goods[] = []
  data?.map((doc) => {
    const goods: Goods = {
      content_id: doc.events.contents.content_id,
      content_name: doc.events.contents.content_name,
      event_id: doc.events.event_id,
      event_name: doc.events.event_name,
      first_date: doc.events.first_date,
      url: doc.events.url,
      goods_id: doc.goods_id,
      goods_name: doc.goods_name,
      goods_group: doc.goods_group,
      goods_type: doc.goods_type,
      color: doc.color,
      size: doc.size,
      price: doc.price,
      goods_count: 0,
    }
    goodsList.push(goods)
  })

  const goodsGroupCount: GoodsGroupCount[] = []
  let now_goods_group = 1
  goodsList.map((goods, index) => {
    if (goods.goods_group == now_goods_group) {
      goodsGroupCount[now_goods_group - 1] = {
        goods_group: goods.goods_group,
        goods_name: goods.goods_name,
        goods_group_count: 0,
        price: goods.price,
        sub_total_price: 0,
        open_flag: true,
        open_flag_css: styles.goods_items_container,
        open_arrow_css: styles.group_arrow_open,
      }
      now_goods_group++
    }
  })

  type PageProps = {
    goodsLists: Goods[]
    goodsGroupCount: GoodsGroupCount[]
  }
  const props: PageProps = {
    goodsLists: goodsList,
    goodsGroupCount: goodsGroupCount,
  }

  return { props }
}

const Home = ({ goodsLists, goodsGroupCount }: Props) => {
  // //グッズの情報の配列
  const [goodsList, setGoodsList] = useState(goodsLists.map((List) => Object.assign({}, List)))

  // //グッズの情報の初期値の配列(更新しない)
  const initialGoodsList: Goods[] = [...goodsLists]

  //グッズグループ情報の配列
  const [goodsGroupCounts, setGoodsGroupCounts] = useState<GoodsGroupCount[]>(
    goodsGroupCount.map((List) => Object.assign({}, List)),
  )

  //グッズグループ情報の初期値の配列(更新しない)
  const initialGoodsGroupCount: GoodsGroupCount[] = [...goodsGroupCount]

  //合計金額
  const [TotalPrice, setTotalPrice] = useState(0)

  //合計個数
  const [TotalCount, setTotalCount] = useState(0)

  //購入優先に並び替える
  const sortBuy = (flag: number) => {
    let sortedGroupCounts: GoodsGroupCount[] = []
    if (flag == 1) {
      let group_count_true: GoodsGroupCount[] = []
      let group_count_false: GoodsGroupCount[] = []
      const test = goodsGroupCounts.map((newGoodsGroupCount, index) => {
        if (newGoodsGroupCount.goods_group_count > 0) group_count_true.push(newGoodsGroupCount)
        else group_count_false.push(newGoodsGroupCount)
      })
      group_count_true.sort(function (a, b) {
        if (a.goods_group > b.goods_group) {
          return 1
        }
        if (a.goods_group < b.goods_group) {
          return -1
        }
        return 0
      })
      group_count_false.sort(function (a, b) {
        if (a.goods_group > b.goods_group) {
          return 1
        }
        if (a.goods_group < b.goods_group) {
          return -1
        }
        return 0
      })

      sortedGroupCounts = group_count_true.concat(group_count_false)
    } else {
      sortedGroupCounts = [...goodsGroupCounts]
      sortedGroupCounts.sort(function (a, b) {
        if (a.goods_group > b.goods_group) {
          return 1
        }
        if (a.goods_group < b.goods_group) {
          return -1
        }
        return 0
      })
    }
    const newgoodsList = [...goodsList]
    const sortedNewgoodsList: Goods[] = []
    const test2 = sortedGroupCounts.map((sortedGroupCount, index) => {
      const test3 = newgoodsList.map((newgoods, index) => {
        if (sortedGroupCount.goods_group == newgoods.goods_group) sortedNewgoodsList.push(newgoods)
      })
    })
    setGoodsGroupCounts(sortedGroupCounts)
    setGoodsList(sortedNewgoodsList)
  }

  //リセットボタンが押された場合、グッズとグループのカウントを0にする
  const reset = () => {
    console.log('リセット')
    setGoodsList(initialGoodsList.map((List) => Object.assign({}, List)))
    setGoodsGroupCounts(initialGoodsGroupCount.map((List) => Object.assign({}, List)))

    //モーダルを閉じる
    setOpenModalFlag(false)
    setOpenModalContentFlag(false)
  }

  // const reset = (goodsList: Goods[]) => {
  //   const newgoodsList = [...goodsList]
  //   const test = newgoodsList.map((newgoods, index) => {
  //     newgoods.goods_count = 0
  //   })
  //   setGoodsList(newgoodsList)
  //   const newGoodsGroupCounts = [...goodsGroupCounts]
  //   const test2 = newGoodsGroupCounts.map((newGoodsGroupCount, index) => {
  //     newGoodsGroupCount.goods_group_count = 0
  //   })
  //   setGoodsGroupCounts(newGoodsGroupCounts)
  // }

  //プラスボタンが押されるとグッズのカウントを+1する。
  const plusGoodsCounts = (id: number) => {
    const newgoodsList = [...goodsList]
    const newGoodsGroupCounts = [...goodsGroupCounts]
    if (newgoodsList[id].goods_count < 99) {
      newgoodsList[id].goods_count = newgoodsList[id].goods_count + 1
      setGoodsList(newgoodsList)
      //小計のカウントを+1する。
      const test2 = newGoodsGroupCounts.map((newGoodsGroupCount, index) => {
        if (newGoodsGroupCount.goods_group == newgoodsList[id].goods_group)
          newGoodsGroupCount.goods_group_count++
      })
      setGoodsGroupCounts(goodsGroupCounts)
      plusButtonOnOff(newgoodsList[id].goods_count)
      minusButtonOnOff(newgoodsList[id].goods_count)
    }
  }

  //マイナスボタンが押されるとグッズのカウントを-1する。
  const minusGoodsCounts = (id: number) => {
    const newgoodsList = [...goodsList]
    const newGoodsGroupCounts = [...goodsGroupCounts]
    if (newgoodsList[id].goods_count > 0) {
      newgoodsList[id].goods_count = newgoodsList[id].goods_count - 1
      setGoodsList(newgoodsList)
      //小計のカウントを+1する。
      const test2 = newGoodsGroupCounts.map((newGoodsGroupCount, index) => {
        if (newGoodsGroupCount.goods_group == newgoodsList[id].goods_group)
          newGoodsGroupCount.goods_group_count--
      })
      setGoodsGroupCounts(goodsGroupCounts)
      plusButtonOnOff(newgoodsList[id].goods_count)
      minusButtonOnOff(newgoodsList[id].goods_count)
    }
  }

  //グッズのカウントが更新されたら、合計金額を更新する。
  useEffect(() => {
    const newgoodsList = [...goodsList]
    const newGoodsGroupCounts = [...goodsGroupCounts]
    let newTotalPrice = 0
    let newTotalCount = 0
    const test = newgoodsList.map((newgoods, index) => {
      newTotalPrice = newTotalPrice + newgoods.price * newgoods.goods_count
      newTotalCount = newTotalCount + newgoods.goods_count
    })
    const test2 = newGoodsGroupCounts.map((newGoodsGroupCount, index) => {
      newGoodsGroupCount.sub_total_price =
        newGoodsGroupCount.price * newGoodsGroupCount.goods_group_count
    })
    if (newTotalPrice > 999999) newTotalPrice = 999999
    setTotalPrice(newTotalPrice)
    setTotalCount(newTotalCount)
    setGoodsGroupCounts(newGoodsGroupCounts)
    resetOnOff(newTotalPrice)
  }, [goodsList])

  //リセットボタンのオンオフフラグ
  const [reset_flag, setReset_flag] = useState(styles.reset_off)

  //合計金額を参照し、リセットボタンのオンオフを切り替える。
  const resetOnOff = (newTotalPrice: number) => {
    if (newTotalPrice > 0) setReset_flag(styles.reset)
    else setReset_flag(styles.reset_off)
  }

  let group_flag = 1
  let goods_type_area: JSX.Element

  //グループの矢印がクリックされたら、グッズの個数の入力蘭を開閉する。
  const chengeOpenCloseCss = (group_id: number) => {
    const newGoodsGroupCounts = [...goodsGroupCounts]
    if (goodsGroupCounts[group_id].open_flag == true) {
      newGoodsGroupCounts[group_id].open_flag = false
      newGoodsGroupCounts[group_id].open_flag_css = styles.goods_items_container_active
      newGoodsGroupCounts[group_id].open_arrow_css = styles.group_arrow_close
    } else {
      newGoodsGroupCounts[group_id].open_flag = true
      newGoodsGroupCounts[group_id].open_flag_css = styles.goods_items_container
      newGoodsGroupCounts[group_id].open_arrow_css = styles.group_arrow_open
    }
    setGoodsGroupCounts(newGoodsGroupCounts)
  }

  //スクロール量
  const [scrollY, setScrollY] = useState(0)
  const [changeNavbarCss, setChangeNavbarCss] = useState(styles.total_bar_container)

  //スクロール量を取得
  const handleScroll = () => {
    setScrollY(window.scrollY)

    if (window.scrollY > 60) {
      setChangeNavbarCss(styles.total_bar_container_fixed)
    } else setChangeNavbarCss(styles.total_bar_container)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
  }, [])

  const { openModalFlag, setOpenModalFlag, modalType, setModalType, setOpenModalContentFlag }: any =
    useContext(ModalContext)

  //モーダルを開く
  const openModal = (action: string) => {
    setOpenModalFlag(true)
    setModalType(action)
    setOpenModalContentFlag(true)
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

      <Navbar reset={reset} />

      <div className={changeNavbarCss} id='concept'>
        <div className={styles.total_bar}>
          <div className={reset_flag} onClick={() => openModal('reset')}>
            <span>
              <Reset />
            </span>
            リセット
          </div>
          <div className={styles.save_off} onClick={() => openModal('save')}>
            <span>
              <Save />
            </span>
            保存
          </div>
          <div className={styles.total_count}>{TotalCount}点</div>
          <div className={styles.total}>&yen;{numberFormat(TotalPrice)}</div>
        </div>
      </div>
      <main className={styles.main}>
        <div className={styles.contant_name_container}>
          <p className={styles.content_name}>{goodsList[0].content_name}</p>
        </div>
        <div className={styles.event_title_container}>
          <h1 className={styles.h1}>{goodsList[0].event_name}</h1>
        </div>
        <div className={styles.event_menu_container}>
          <p className={styles.event_date}>{dateFormat(goodsList[0].first_date)}</p>
          <Calendar />
        </div>
        <div className={styles.event_link_container}>
          <a href={goodsList[0].url} target='_blank'>
            <p className={styles.tag_official}>
              公式サイト
              <span>
                <Official_mobile />
              </span>
            </p>
          </a>
          <a href={goodsList[0].url} target='_blank'>
            <p className={styles.tag_twitter}>
              ツイート
              <span>
                <Icon_witter />
              </span>
            </p>
          </a>
          <a href={goodsList[0].url} target='_blank'>
            <p className={styles.tag_line}>
              LINE
              <span>
                <Line />
              </span>
            </p>
          </a>
        </div>
        <div className={styles.sort_container}>
          <span onClick={() => openModal('sort')}>並び替え：　</span>
          <span className={styles.sort_nomal} onClick={() => sortBuy(0)}>
            通常順
          </span>
          <span>　/　</span>
          <span className={styles.sort_buy} onClick={() => sortBuy(1)}>
            購入優先順
          </span>
        </div>
        {console.log('event_id.tsx jsx')}
        <ul className={styles.goods_list_ul}>
          {goodsGroupCounts.map((group, index) => (
            <>
              <li className={styles.goods_list_li} key={group.goods_group}>
                <div className={styles.goods_name}>{group.goods_name}</div>
                <div className={styles.subtotalcontainer}>
                  <span
                    className={goodsGroupCounts[index].open_arrow_css}
                    onClick={() => chengeOpenCloseCss(index)}
                  ></span>
                  <div className={styles.subtotalwrap}>
                    <div className={styles.subtotalcount}>
                      {goodsGroupCounts[index].goods_group_count}点
                    </div>
                    <div className={styles.subtotal}>
                      &yen;
                      {numberFormat(goodsGroupCounts[index].sub_total_price)}
                    </div>
                  </div>
                </div>
                <div className={goodsGroupCounts[index].open_flag_css}>
                  {goodsList.map((goods, index) =>
                    (() => {
                      if (group.goods_group == goods.goods_group) {
                        return (
                          <>
                            <div className={styles.goods_detail_container}>
                              <div className={styles.goods_type_container}>
                                {goods.goods_type} {goods.color} {goods.size}
                              </div>
                              <div className={styles.goods_price_container}>
                                &yen;{numberFormat(goods.price)} x {goods.goods_count}
                              </div>
                              <div className={styles.plus_minus_container}>
                                <button
                                  onClick={() => minusGoodsCounts(index)}
                                  className={minusButtonOnOff(goods.goods_count)}
                                >
                                  <span></span>
                                </button>
                                <button
                                  onClick={() => plusGoodsCounts(index)}
                                  className={plusButtonOnOff(goods.goods_count)}
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
      </main>
    </>
  )
}

//プラスボタンをグッズのカウントが99の時はオフ、99以下の時はオンに切り替える。
function plusButtonOnOff(goodsCount: number) {
  if (goodsCount < 99) {
    return styles.plusButtonOn
  } else {
    return styles.plusButtonOff
  }
}
//マイナスボタンをグッズのカウントが0の時はオフ、1以上の時はオンに切り替える。
const minusButtonOnOff = (goodsCount: number) => {
  if (goodsCount > 0) {
    return styles.minusButtonOn
  } else {
    return styles.minusButtonOff
  }
}

export default Home
