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
  type PageProps = {
    goodsLists: Goods[]
  }
  const props: PageProps = {
    goodsLists: goodsList,
  }

  return { props }
}

const Home = ({ goodsLists }: Props) => {
  const router = useRouter()
  // //グッズの情報の配列
  const [goodsList, setGoodsList] = useState([...goodsLists])

  //合計金額
  const [TotalPrice, setTotalPrice] = useState(0)

  const [TotalCount, setTotalCount] = useState(0)

  class GoodsGroupCount {
    goods_group: number = 0
    goods_group_count: number = 0
    price: number = 0
    sub_total_price: number = 0
    group_flag = styles.goodslist
  }

  const newGoodsGroupCounts: GoodsGroupCount[] = []
  let now_goods_group = 1
  goodsList.map((goods, index) => {
    if (goods.goods_group == now_goods_group) {
      newGoodsGroupCounts[now_goods_group - 1] = {
        goods_group: goods.goods_group,
        goods_group_count: 0,
        price: goods.price,
        sub_total_price: 0,
        group_flag: styles.goodslist,
      }
      now_goods_group++
    }
  })
  const [goodsGroupCounts, setgoodsGroupCounts] = useState<GoodsGroupCount[]>([
    ...newGoodsGroupCounts,
  ])

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
  }, [goodsList])

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
        <div className={styles.total_bar_container}>
          <div className={styles.total_bar}>
            <div className={styles.reset}>
              <span>
                <Reset />
              </span>
              リセット
            </div>
            <div className={styles.save}>
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
            <p className={styles.event_date}>
              {dateFormat(goodsList[0].first_date, goodsList[0].one_date)}
            </p>
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
                return <>{goods_type_area}</>
              })(),
            )}
          </ul>
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
const dateFormat = (date: string, one_date: boolean): string => {
  const result = date.split('-')
  let date_string = result[0] + '年' + result[1] + '月' + result[2] + '日'
  if (one_date == false) date_string = date_string + '～'

  return date_string
}
export default Home
