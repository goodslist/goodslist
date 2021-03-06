import { useRouter } from 'next/router'
import { supabase } from '../../components/supabase'
import Link from 'next/link'
import styles from '../../styles/Admin.module.css'
import Title from '../../components/view/title'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import InputText from '../../components/form/InputText'
import { useEffect, useState } from 'react'
import AdminHeader from '../../components/admin/Header'
import AdminLogin from '../../components/admin/login'

type Props = {}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  }
}
export default function Admin(props: Props) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Goods List 管理者ログイン</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0' />
        <link rel='icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap&text=Goodsist'
          rel='stylesheet'
        />
        <link
          href='https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
          rel='stylesheet'
        ></link>
      </Head>
      <AdminHeader />
      <div className={styles.wrapper_white}>
        <AdminLogin />
      </div>
    </>
  )
}
