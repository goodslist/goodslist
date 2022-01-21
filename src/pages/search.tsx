import { useRouter } from 'next/router'
import { supabase } from '../components/supabase'
import Link from 'next/link'
import styles from '../styles/Search.module.css'
import Title from '../components/view/title'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { MetaProps, Events } from '../components/types'
import Header from '../components/Header'
import Meta from '../components/Meta'
import searchEvent from '../components/db/SearchEvent'
import { dateFormat } from '../components/Utils'
import Box from '../components/view/Box'
import BoxGrid from '../components/view/BoxGrid'

type Props = {
  searchResults: Events[]
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const searchWord = String(ctx.query.keyword)

  const searchWords = String(searchWord).replace(/　/g, ' ').split(' ')

  console.log(searchWord)
  console.log(searchWords)
  const aa = 'aa'
  const aaa = `'${aa}'`
  const bbb = `'bbbb'`
  const test = aaa + ' & ' + bbb
  console.log(test)

  let qurry = ''
  for (let i = 0; i < searchWords.length; i++) {
    if (i == searchWords.length - 1) {
      qurry = qurry + `'${searchWords[i]}'`
    } else {
      qurry = qurry + `'${searchWords[i]}'` + ' & '
    }
  }
  console.log(qurry)

  let newSearchResults: Events[] = []

  // const { data, error } = await supabase
  //   .from('search_events')
  //   .select('event_id, event_name, content_name,date, search_word')
  //   .ilike('search_word', `%ばんぷ% & %ちきん%`)

  // const { data, error } = await supabase
  //   .from('search_events')
  //   .select('event_id, event_name, content_name, search_word')
  //   .ilike('search_word', '%' + searchWord + '%')

  // const { data, error } = await supabase
  //   .from('search_events')
  //   .select('event_id, event_name, content_name,date, search_word')
  //   .textSearch('search_word', `'ばんぷ' & 'ちきん'`)

  // const { data, error } = await supabase
  //   .from('search_events')
  //   .select('event_id, event_name, content_name,date, search_word')
  //   .textSearch('search_word', `'chicken' & '2017'`, {
  //     config: 'english',
  //   })
  if (searchWord != undefined) {
    const data: Events[] = await searchEvent(searchWord)

    data?.map((doc) => {
      const searchResult: Events = {
        event_id: doc.event_id,
        event_name: doc.event_name,
        content_name: doc.content_name,
        date: doc.date,
      }
      newSearchResults.push(searchResult)
    })
  }

  return {
    props: {
      searchResults: newSearchResults,
    },
  }
}
export default function Output(props: Props) {
  const router = useRouter()
  const keyword = router.query.keyword

  const meta: MetaProps = {
    title: 'GOODSist イベントのグッズ代が計算できるWEBアプリ',
    url: 'https://goodslist-pearl.vercel.app/',
    image: 'https://goodslist-pearl.vercel.app/images/ogp.png',
  }

  return (
    <>
      <Meta title={meta.title} url={meta.url} image={meta.image} />
      <Header />
      <Box background='#fff' padding='60px 20px 20px 20px'>
        <Title title='Search Result' />
      </Box>
      <BoxGrid background='#f1f1f1' padding='80px 20px 60px 20px'>
        <div className={styles.search_result_title}>
          {keyword}　を含む検索結果({props.searchResults.length}件)
        </div>
        <div className={styles.grid}>
          <ul className={styles.ul_event}>
            {props.searchResults?.map((searchResult: Events) => (
              <li key={searchResult.event_id} className={styles.li_event}>
                <Link href={'event/' + searchResult.event_id}>
                  <a>
                    <div className={styles.li_event_padding}>
                      <p className={styles.contents_title}>
                        <b>{searchResult.content_name}</b>
                      </p>
                      <p className={styles.event_date}>{dateFormat(searchResult.date)}</p>
                      <hr className={styles.li_event_line} />
                      <p className={styles.event_title}>{searchResult.event_name}</p>
                    </div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </BoxGrid>
    </>
  )
}
