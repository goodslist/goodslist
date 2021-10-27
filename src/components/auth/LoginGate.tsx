import Link from 'next/link'
import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { supabase } from '../../components/supabase'
import styles from '../../styles/Goods.module.css'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Icon_witter from '../img/icon_twitter.svg'
import Navbar from '../../components/Navber'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return {}
}

const LoginGate = () => {
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

      <Navbar />
      <main className={styles.main}>ログインゲート</main>
    </>
  )
}

export default LoginGate

// 本来は、ここで外部 API などを呼び出してデータを取得する

// const { data, error } = await supabase
//   .from('goods')
//   .select(
//     'goods_id, goods_name, goods_group, goods_type, color, size, price, events(event_id, event_name, first_date, url, contents(content_id, content_name))',
//   )
//   .eq('event_id', event_id)

// const goodsList: Goods[] = []
// data?.map((doc) => {
//   const goods: Goods = {
//     content_id: doc.events.contents.content_id,
//     content_name: doc.events.contents.content_name,
//     event_id: doc.events.event_id,
//     event_name: doc.events.event_name,
//     first_date: doc.events.first_date,
//     url: doc.events.url,
//     goods_id: doc.goods_id,
//     goods_name: doc.goods_name,
//     goods_group: doc.goods_group,
//     goods_type: doc.goods_type,
//     color: doc.color,
//     size: doc.size,
//     price: doc.price,
//     goods_count: 0,
//   }
//   goodsList.push(goods)
// })
