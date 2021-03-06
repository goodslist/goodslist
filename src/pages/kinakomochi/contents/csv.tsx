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
import { useEffect, useState } from 'react'
import AdminHeader from '../../../components/admin/Header'
import AdminLogin from '../../../components/admin/login'
import { Contents } from '../../../components/types'
import { GetStaticPropsContext } from 'next'
import { useCsvContents } from '../../../components/hooks/admin/useCsvContents'

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

  const [csvDragDrop, contents] = useCsvContents()
  const [renderContents, setRenderContents] = useState<JSX.Element>(<></>)

  useEffect(() => {
    console.log(contents)
    if (contents.length > 0) renderCsvContents()
  }, [contents])

  const register = async () => {
    contents.map((content: any) => {
      registerContents(content)
    })
    router.push({
      pathname: '/kinakomochi/contents', //URL
    })
    alert('登録完了')
  }

  const registerContents = async (content: any) => {
    const { data, error } = await supabase.from('contents').insert([
      {
        content_name: content.content_name,
        content_name_hira: content.content_name_hira,
        content_name_kana: content.content_name_kana,
      },
    ])

    if (error) {
      alert('エラーが発生しました')
    } else {
      // alert('登録完了')
    }
  }

  const renderCsvContents = () => {
    const viewContents = (
      <>
        <ul>
          {contents.map((content: any, index: number) => (
            <li>
              {content.content_name} {content.content_name_hira} {content.content_name_kana}
            </li>
          ))}
        </ul>
        <SubmitButton title='登録' isSubmit={true} onClick={register} />
      </>
    )
    setRenderContents(viewContents)
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
        <Title title='コンテンツCSV新規登録' />
        {/* <ContentsCSVReader /> */}
        {csvDragDrop}
        {renderContents}
      </div>
    </>
  )
}
