import { useRouter } from 'next/router'
import { supabase } from '../../../components/supabase'
import Link from 'next/link'
import styles from '../../../styles/Admin.module.css'
import Title from '../../../components/view/title'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import InputText from '../../../components/form/InputText'
import InputLabel from '../../../components/form/InputLabel'
import SubmitButton from '../../../components/form/SubmitButton'
import Form from '../../../components/form/Form'
import { useEffect, useState } from 'react'
import AdminHeader from '../../../components/admin/Header'
import AdminLogin from '../../../components/admin/login'
import { Contents } from '../../../components/types'
import { GetStaticPropsContext } from 'next'

type PathParams = {
  content_id: string
}

// ページコンポーネントに渡されるデータ
type Props = {
  contents: Contents[]
}

export const getServerSideProps: GetServerSideProps = async (context: GetStaticPropsContext) => {
  return { props: {} }
}
export default function Admin({}: Props) {
  const router = useRouter()

  const [contentName, setContentName] = useState('')
  const [contentNameHira, setContentNameHira] = useState('')
  const [contentNameKana, setContentNameKana] = useState('')
  const [isSubmit, setIsSubmit] = useState(false)
  const [checkContentName, setCheckContentName] = useState(false)

  useEffect(() => {
    if (contentName.length > 0 && contentNameHira.length > 0 && contentNameKana.length > 0)
      setIsSubmit(true)
  }, [contentName, contentNameHira, contentNameKana])

  const checkDoubleContentName = async () => {
    let resultContentName
    const { data, error } = await supabase
      .from('contents')
      .select('content_name')
      .eq('content_name', contentName)
    if (data) {
      if (data.length > 0) {
        resultContentName = true
      } else {
        resultContentName = false
      }
    }
    return resultContentName
  }

  const registerContent = async () => {
    if (isSubmit == true) {
      // alert('新規登録')
      const resultContentName = await checkDoubleContentName()
      console.log(resultContentName)

      if (resultContentName) {
        alert('コンテンツ名が重複しています')
      } else {
        const { data, error } = await supabase.from('contents').insert([
          {
            content_name: contentName,
            content_name_hira: contentNameHira,
            content_name_kana: contentNameKana,
          },
        ])

        if (error) {
          alert('エラーが発生しました')
        } else {
          // alert('登録完了')

          router.push({
            pathname: '/kinakomochi/contents', //URL
          })
        }
      }
    }
  }
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
        <Title title='コンテンツ新規登録' />
        <div className={styles.input_container}>
          <ul>
            <li>
              <InputLabel label='コンテンツ名' />
              <InputText value={contentName} onChange={setContentName} />
            </li>
            <li>
              <InputLabel label='コンテンツ名ひらがな' />
              <InputText value={contentNameHira} onChange={setContentNameHira} />
            </li>
            <li>
              <InputLabel label='コンテンツ名カタカナ' />
              <InputText value={contentNameKana} onChange={setContentNameKana} />
            </li>
          </ul>
          <SubmitButton title='新規登録' isSubmit={isSubmit} onClick={registerContent} />
        </div>
      </div>
    </>
  )
}
