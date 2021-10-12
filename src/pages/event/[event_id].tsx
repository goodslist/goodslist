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

// // ページコンポーネントに渡されるデータ
// type Props = {
//   goodsList: Goods[]
// }
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

  class GoodsGroupCount {
    goods_group: number = 0
    goods_group_count: number = 0
    price: number = 0
    sub_total_price: number = 0
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
      }
      now_goods_group++
    }
  })
  const [goodsGroupCounts, setgoodsGroupCounts] = useState<GoodsGroupCount[]>([
    ...newGoodsGroupCounts,
  ])

  //合計金額
  const [TotalPrice, setTotalPrice] = useState(0)

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
    let total = 0
    const test = newgoodsList.map((newgoods, index) => {
      total = total + newgoods.price * newgoods.goods_count
      // goodsGroupCounts[newgoods.goods_group - 1].sub_total_price =
      //   goodsGroupCounts[newgoods.goods_group - 1].sub_total_price +
      //   newgoods.price * newgoods.goods_count
    })
    const test2 = goodsGroupCounts.map((goodsGroupCount, index) => {
      goodsGroupCount.sub_total_price = goodsGroupCount.price * goodsGroupCount.goods_group_count
    })
    if (total > 999999) total = 999999
    setTotalPrice(total)
    setgoodsGroupCounts(goodsGroupCounts)
  }, [goodsList])

  let aaa = 'a'
  return (
    <>
      <Head>
        <title>GOODS CART イベントのグッズ代が計算できるWEBアプリ</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap&text=Goodsist'
          rel='stylesheet'
        />
      </Head>
      <div className={styles.main_container}>
        <div className={styles.total_bar_container}>
          <div className={styles.total_bar}>
            <p className={styles.total}>&yen;{numberFormat(TotalPrice)}</p>
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
            <div className={styles.event_date}>
              日程：{dateFormat(goodsList[0].first_date, goodsList[0].one_date)}
            </div>
          </div>
          <div className={styles.event_menu_container}>
            <div className={styles.event_title_container}></div>
          </div>
          <ul className={styles.goodslistul}>
            {goodsList.map((goods, index) =>
              (() => {
                if (aaa == goods.goods_name) {
                  aaa = goods.goods_name
                  return (
                    <>
                      <li className={styles.goodslist} key={goods.goods_id}>
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
                      </li>
                    </>
                  )
                } else {
                  aaa = goods.goods_name
                  return (
                    <>
                      <li className={styles.goodslisthead}>
                        <span className={styles.goodsname}>{goods.goods_name}</span>
                      </li>
                      <li className={styles.goodslist}>
                        <span className={styles.subtotalcontainer}>
                          <span className={styles.subtotalcount}>
                            {goodsGroupCounts[goods.goods_group - 1].goods_group_count}点合計
                          </span>
                          <span className={styles.subtotal}>
                            &yen;
                            {numberFormat(goodsGroupCounts[goods.goods_group - 1].sub_total_price)}
                          </span>
                        </span>
                      </li>
                      <li className={styles.goodslist} key={goods.goods_id}>
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
                      </li>
                    </>
                  )
                }
              })(),
            )}
          </ul>
        </div>
      </div>
    </>
  )
}

// ページコンポーネントの実装
// const Home: React.FC<Props> = ({ goodsList }) => (
//   <>
//     <Head>
//       <title>GOODS CART イベントのグッズ代が計算できるWEBアプリ</title>
//       <meta name='description' content='Generated by create next app' />
//       <link rel='icon' href='/favicon.ico' />
//       <link
//         href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap&text=Goodsist'
//         rel='stylesheet'
//       />
//     </Head>
//     <Header />
//     <div className={styles.container}>
//       <main className={styles.main}></main>
//       <div className={styles.contant_name_container}>
//         <p className={styles.content_name}>{goodsList[0].content_name}</p>
//         {/* <p className={styles.event_date}>2019年07月13日～</p> */}
//       </div>
//       <div className={styles.event_title_container}>
//         <h1 className={styles.h1}>{goodsList[0].event_name}</h1>
//       </div>
//       <div className={styles.event_menu_container}>
//         <div className={styles.event_date}>
//           {dateFormat(goodsList[0].first_date, goodsList[0].one_date)}
//         </div>
//       </div>
//       <div className={styles.event_menu_container}>
//         <div className={styles.event_title_container}></div>
//       </div>
//       <Footer />
//     </div>
//   </>
// )

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
//日付を年月日にする。
const dateFormat = (date: string, one_date: boolean): string => {
  const result = date.split('-')
  let date_string = result[0] + '年' + result[1] + '月' + result[2] + '日'
  if (one_date == false) date_string = date_string + '～'
  return date_string
}

//数字を3桁ごとにカンマ区切りする。
const numberFormat = (num: number): string => {
  return num.toLocaleString()
}

export default Home
