import { useRouter } from 'next/router'
import { supabase } from '../components/supabase'
import Link from 'next/link'
import styles from '../styles/Search.module.css'
import Title from '../components/view/title'
import Head from 'next/head'
import { GetServerSideProps } from 'next'

class SearchResult {
  event_id: number = 0
  content_name: string = ''
  event_name: string = ''
}

type Props = {
  searchResults: SearchResult[]
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const searchWord = ctx.query.keyword

  let newSearchResults: SearchResult[] = []
  const { data, error } = await supabase
    .from('search_events')
    .select('event_id, event_name, content_name, search_word')
    .ilike('search_word', '%' + searchWord + '%')
  data?.map((doc) => {
    const searchResult: SearchResult = {
      event_id: doc.event_id,
      event_name: doc.event_name,
      content_name: doc.content_name,
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
      <div className={styles.wrapper_white}>
        <main className={styles.main}>
          <Title title='検索結果' />
        </main>
      </div>
      <div className={styles.wrapper_glay}>
        <main className={styles.main2}>
          <div className={styles.grid}>
            <div className={styles.search_result_title}>
              {keyword}　を含む検索結果({props.searchResults.length}件)
            </div>
            <ul className={styles.ul_event}>
              {props.searchResults?.map((searchResult: SearchResult) => (
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

// import { useRouter } from 'next/router'
// import { supabase } from '../components/supabase'
// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import styles from '../styles/Search.module.css'
// import Navbar from '../components/Navber'

// export default function Output() {
//   const router = useRouter()

//   const searchWord = router.query.word

//   class SearchResult {
//     event_id: number = 0
//     content_name: string = ''
//     event_name: string = ''
//   }

//   const [searchResults, setSearchResults] = useState<SearchResult[]>([])

//   async function search() {
//     let newSearchResults: SearchResult[] = []
//     const { data, error } = await supabase
//       .from('searches')
//       .select('event_id, event_name, content_name, search_word')
//       .ilike('search_word', '%' + searchWord + '%')
//     data?.map((doc) => {
//       const searchResult: SearchResult = {
//         event_id: doc.event_id,
//         event_name: doc.event_name,
//         content_name: doc.content_name,
//       }
//       newSearchResults.push(searchResult)
//     })
//     setSearchResults(newSearchResults)
//   }
//   useEffect(() => {
//     search()
//   }, [])

//   return (
//     <>
//       <Navbar />
//       <main className={styles.main}>
//         <div className={styles.content_title}>
//           <span>検索結果</span>
//         </div>
//         {/* パラメータの表示 */}
//         <div className={styles.search_result_title}>
//           {searchWord}　を含む検索結果({searchResults.length}件)
//         </div>
//         {console.log('aaa')}
//         <ul className={styles.card}>
//           {searchResults?.map((searchResult) => (
//             <>
//               <li>
//                 <Link href={'../event/' + searchResult.event_id}>
//                   <a>
//                     <b>{searchResult.content_name}</b>
//                     <br />
//                     {searchResult.event_name}
//                     <span />
//                   </a>
//                 </Link>
//               </li>
//             </>
//           ))}
//         </ul>
//       </main>
//     </>
//   )
// }
