import Link from 'next/link'
import React from 'react'
import { GetStaticProps } from 'next'
/* eslint-disable @next/next/no-page-custom-font */
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import Footer from '../../components/Footer'
import { supabase } from '../../components/supabase'
import styles from '../../styles/Goods.module.css'
import { GetStaticPaths } from 'next'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import Calendar from '../img/calendar.svg'
import Official_mobile from '../img/official_mobile.svg'
import Icon_witter from '../img/icon_twitter.svg'
import Line from '../img/line.svg'
import Reset from '../img/reset.svg'
import Save from '../img/save.svg'
import Button_top from '../../components/Button_top'
// import ScrollButton from '../../components/ScrollButton'
import { animateScroll as scroll } from 'react-scroll'

class EventInfo {
  content_id: number = 0
  content_name: string = ''
  event_id: number = 0
  event_name: string = ''
  first_date: string = '2000-00-00'
  one_date: boolean = false
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
  goods_group_count: number = 0
  price: number = 0
  sub_total_price: number = 0
  group_flag = styles.goodslist
}

type PathParams = {
  event_id: string
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

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
  console.log(paths)
  return { paths, fallback: false }
}

// この関数がビルド時に呼び出され、戻り値の props の値がページコンポーネントに渡される
export const getStaticProps = async (context: GetStaticPropsContext) => {
  // 本来は、ここで外部 API などを呼び出してデータを取得する

  const { event_id } = context.params as PathParams

  const { data, error } = await supabase
    .from('goods')
    .select(
      'goods_id, goods_name, goods_group, goods_type, color, size, price, events(event_id, event_name, first_date, one_date, url, contents(content_id, content_name))',
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
      one_date: doc.events.one_date,
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
        goods_group_count: 0,
        price: goods.price,
        sub_total_price: 0,
        group_flag: styles.goodslist,
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
  const router = useRouter()
  // //グッズの情報の配列
  const [goodsList, setGoodsList] = useState([...goodsLists])

  //合計金額
  const [TotalPrice, setTotalPrice] = useState(0)

  //合計個数
  const [TotalCount, setTotalCount] = useState(0)

  //グッズグループごとの個数の配列
  const [goodsGroupCounts, setgoodsGroupCounts] = useState<GoodsGroupCount[]>([...goodsGroupCount])

  //リセットボタンが押された場合、グッズとグループのカウントを0にする
  const reset = (goodsList: Goods[]) => {
    const newgoodsList = [...goodsList]
    const test = newgoodsList.map((newgoods, index) => {
      newgoods.goods_count = 0
    })
    setGoodsList(newgoodsList)
    const newGoodsGroupCounts = [...goodsGroupCounts]
    const test2 = newGoodsGroupCounts.map((newGoodsGroupCount, index) => {
      newGoodsGroupCount.goods_group_count = 0
    })
    setgoodsGroupCounts(newGoodsGroupCounts)
  }

  //プラスボタンが押されるとグッズのカウントを+1する。
  const plusGoodsCounts = (id: number) => {
    const newgoodsList = [...goodsList]
    if (newgoodsList[id].goods_count < 99) {
      newgoodsList[id].goods_count = newgoodsList[id].goods_count + 1
      setGoodsList(newgoodsList)
      //小計のカウントを+1する。
      goodsGroupCounts[newgoodsList[id].goods_group - 1].goods_group_count++
      setgoodsGroupCounts(goodsGroupCounts)
      plusButtonOnOff(newgoodsList[id].goods_count)
      minusButtonOnOff(newgoodsList[id].goods_count)
    }
  }

  //マイナスボタンが押されるとグッズのカウントを-1する。
  const minusGoodsCounts = (id: number) => {
    const newgoodsList = [...goodsList]
    if (newgoodsList[id].goods_count > 0) {
      newgoodsList[id].goods_count = newgoodsList[id].goods_count - 1
      setGoodsList(newgoodsList)
      //小計のカウントを+1する。
      goodsGroupCounts[newgoodsList[id].goods_group - 1].goods_group_count--
      setgoodsGroupCounts(goodsGroupCounts)
      plusButtonOnOff(newgoodsList[id].goods_count)
      minusButtonOnOff(newgoodsList[id].goods_count)
    }
  }

  //グッズのカウントが更新されたら、合計金額を更新する。
  useEffect(() => {
    const newgoodsList = [...goodsList]
    let newTotalPrice = 0
    let newTotalCount = 0
    const test = newgoodsList.map((newgoods, index) => {
      newTotalPrice = newTotalPrice + newgoods.price * newgoods.goods_count
      newTotalCount = newTotalCount + newgoods.goods_count
    })
    const test2 = goodsGroupCounts.map((goodsGroupCount, index) => {
      goodsGroupCount.sub_total_price = goodsGroupCount.price * goodsGroupCount.goods_group_count
    })
    if (newTotalPrice > 999999) newTotalPrice = 999999
    setTotalPrice(newTotalPrice)
    setTotalCount(newTotalCount)
    setgoodsGroupCounts(goodsGroupCounts)
    resetOnOff(newTotalPrice)
  }, [goodsList])

  //リセットボタンのオンオフフラグ
  const [reset_flag, setReset_flag] = useState(styles.reset_off)

  //合計金額を参照し、リセットボタンのオンオフを切り替える。
  const resetOnOff = (newTotalPrice: number) => {
    if (newTotalPrice > 0) setReset_flag(styles.reset)
    else setReset_flag(styles.reset_off)
  }

  let group_flag = 0
  let goods_type_area: JSX.Element
  const [goods_hidden_flag, setGoods_hidden_flag] = useState(styles.goodslist)

  const hiddenGoods = (goods_group: number) => {
    if (goodsGroupCounts[goods_group - 1].group_flag == styles.goodslist) {
      setGoods_hidden_flag(styles.goodslist_hidden)
      goodsGroupCounts[goods_group - 1].group_flag = styles.goodslist_hidden
    } else {
      setGoods_hidden_flag(styles.goodslist)
      goodsGroupCounts[goods_group - 1].group_flag = styles.goodslist
    }
  }

  // const [scrollY, setScrollY] = useState(window.screenY)

  // const [scrollButtonOnOff, setScrollButtonOnOff] = useState(styles.scroll_button_hidden)

  // if (scrollY > 100) {
  //   setScrollButtonOnOff(styles.scroll_button)
  // }

  // const scrollToTop = () => {
  //   scroll.scrollToTop()
  // }

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
      <div className={styles.main_container}>
        <div className={styles.total_bar_container} id='concept'>
          <div className={styles.total_bar}>
            <div className={reset_flag} onClick={() => reset(goodsList)}>
              <span>
                <Reset />
              </span>
              リセット
            </div>
            <div className={styles.save_off}>
              <span>
                <Save />
              </span>
              保存
            </div>
            <div className={styles.total_count}>{TotalCount}点</div>
            <div className={styles.total}>&yen;{numberFormat(TotalPrice)}</div>
          </div>
        </div>
        <div className={styles.main}>
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
                Official
                <span>
                  <Official_mobile />
                </span>
              </p>
            </a>
            <a href={goodsList[0].url} target='_blank'>
              <p className={styles.tag_twitter}>
                共有
                <span>
                  <Icon_witter />
                </span>
              </p>
            </a>
            <a href={goodsList[0].url} target='_blank'>
              <p className={styles.tag_line}>
                共有
                <span>
                  <Line />
                </span>
              </p>
            </a>
          </div>
          <ul className={styles.goodslistul}>
            {goodsList.map((goods, index) =>
              (() => {
                if (group_flag != goods.goods_group) {
                  goods_type_area = (
                    <>
                      <li className={styles.goodslisthead}>
                        <span className={styles.goodsname}>{goods.goods_name}</span>
                      </li>
                      <li className={styles.goodslist}>
                        <span className={styles.subtotalcontainer}>
                          <span onClick={() => hiddenGoods(goods.goods_group)}>あ　</span>
                          <span className={styles.subtotalcount}>
                            {goodsGroupCounts[goods.goods_group - 1].goods_group_count}点
                          </span>
                          <span className={styles.subtotal}>
                            &yen;
                            {numberFormat(goodsGroupCounts[goods.goods_group - 1].sub_total_price)}
                          </span>
                        </span>
                      </li>
                    </>
                  )
                } else {
                  goods_type_area = <></>
                }
                group_flag = goods.goods_group
                return (
                  <>
                    {goods_type_area}
                    <li
                      className={goodsGroupCounts[goods.goods_group - 1].group_flag}
                      key={goods.goods_id}
                    >
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
                    </li>
                  </>
                )
              })(),
            )}
          </ul>
          {/* <div className={styles.scroll_button} onClick={scrollToTop}>
            a
          </div> */}
        </div>
      </div>
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
//数字を3桁ごとにカンマ区切りする。
const numberFormat = (num: number): string => {
  return num.toLocaleString()
}
const dateFormat = (date: string): string => {
  const WeekJp = ['日', '月', '火', '水', '木', '金', '土']
  const result = date.split('-')
  let date_string =
    result[0] +
    '年' +
    result[1] +
    '月' +
    result[2] +
    '日' +
    '(' +
    WeekJp[new Date(date).getDay()] +
    ')'

  return date_string
}

export default Home
