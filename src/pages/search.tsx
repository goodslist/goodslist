import { useRouter } from 'next/router'
import { supabase } from '../components/supabase'
import Link from 'next/link'
import styles from '../styles/Search.module.css'
import Title from '../components/view/title'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { Events } from '../components/types'
import Header from '../components/Header'

type Props = {
  searchResults: Events[]
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const searchWord = ctx.query.keyword

  let newSearchResults: Events[] = []
  const { data, error } = await supabase
    .from('search_events')
    .select('event_id, event_name, content_name, date, search_word')
    .ilike('search_word', '%' + '2021' + '%')
    .ilike('search_word', '%' + 'tour' + '%')
  data?.map((doc) => {
    const searchResult: Events = {
      event_id: doc.event_id,
      event_name: doc.event_name,
      content_name: doc.content_name,
      date: doc.date,
    }
    newSearchResults.push(searchResult)
  })

  return {
    props: {
      searchResults: newSearchResults,
    },
  }
}
export default function Output(props: Props) {
  const router = useRouter()
  const keyword = router.query.keyword

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
        <link
          href='https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
          rel='stylesheet'
        ></link>
      </Head>
      <Header />
      <div className={styles.wrapper_white}>
        <main className={styles.main}>
          <Title title='Search Result' />
        </main>
      </div>
      <div className={styles.wrapper_glay}>
        <main className={styles.main2}>
          <div className={styles.grid}>
            <div className={styles.search_result_title}>
              {keyword}　を含む検索結果({props.searchResults.length}件)
            </div>
            <ul className={styles.ul_event}>
              {props.searchResults?.map((searchResult: Events) => (
                <li key={searchResult.event_id} className={styles.li_event}>
                  <Link href={'event/' + searchResult.event_id}>
                    <a>
                      <div className={styles.li_event_padding}>
                        <p className={styles.contents_title}>
                          <b>{searchResult.content_name}</b>
                        </p>
                        <hr className={styles.li_event_line} />
                        <p className={styles.event_title}>{searchResult.event_name}</p>
                      </div>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
      {/* パラメータの表示 */}
      {/* {isLoading ? lodingNow : lodingComplete} */}
    </>
  )
}
