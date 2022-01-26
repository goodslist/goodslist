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
import { searchEvent10 } from '../components/db/SearchEvent'
import Box from '../components/view/Box'
import SearchResult from '../components/view/search/SearchResult'
import NoSearchResult from '../components/view/search/NoSearchResult'

type Props = {
  searchResults: Events[]
  searchResultsTotalCount: number
  currentPage: number
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const searchWord: string = String(ctx.query.keyword)
  const currentPage: number = ctx.query.page ? Number(ctx.query.page) : 1
  // const currentPage: number = 1
  // const currentPage: number = 1

  const searchResults: Events[] = []

  let searchResultsTotalCount: number = 0

  if (searchWord != undefined) {
    const data: Events[] = await searchEvent10(searchWord)

    searchResultsTotalCount = data.length

    //検索結果の件数以上のページにアクセスされた場合、ホームにリダイレクトする
    if ((currentPage - 1) * 10 > searchResultsTotalCount) {
      return {
        redirect: {
          permanent: false, // 永続的なリダイレクトかどうか
          destination: '/',
        },
      }
    }

    let startCount: number = (currentPage - 1) * 10

    let roopCount: number = 0

    //ループ回数を計算する(3パータン) 1.検索1桁 2.最終ページ表示検索2桁 3.最終以外表示検索2桁
    if (currentPage * 10 > searchResultsTotalCount) {
      if (searchResultsTotalCount < 10) {
        roopCount = searchResultsTotalCount
      } else {
        roopCount = startCount + (searchResultsTotalCount % 10)
      }
    } else {
      roopCount = 10
    }

    for (startCount; startCount < roopCount; startCount++) {
      const searchResult: Events = {
        event_id: data[startCount].event_id,
        event_name: data[startCount].event_name,
        content_name: data[startCount].content_name,
        date: data[startCount].date,
      }
      searchResults.push(searchResult)
    }
  }

  return {
    props: {
      searchResults: searchResults,
      searchResultsTotalCount: searchResultsTotalCount,
      currentPage: currentPage,
    },
  }
}
export default function Search(props: Props) {
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
      <Box background='#fff' padding='60px 20px 0px 20px'>
        <Title title='Search Result' />
      </Box>
      {props.searchResults.length > 0 ? (
        <SearchResult
          searchResults={props.searchResults}
          searchResultsTotalCount={props.searchResultsTotalCount}
          currentPage={props.currentPage}
          keyword={keyword}
        />
      ) : (
        <NoSearchResult keyword={keyword} />
      )}
    </>
  )
}

// import { useRouter } from 'next/router'
// import { supabase } from '../components/supabase'
// import Link from 'next/link'
// import styles from '../styles/Search.module.css'
// import Title from '../components/view/title'
// import Head from 'next/head'
// import { GetServerSideProps } from 'next'
// import { MetaProps, Events } from '../components/types'
// import Header from '../components/Header'
// import Meta from '../components/Meta'
// import { searchEvent10 } from '../components/db/SearchEvent'
// import Box from '../components/view/Box'
// import SearchResult from '../components/view/search/SearchResult'
// import NoSearchResult from '../components/view/search/NoSearchResult'

// type Props = {
//   searchResults: Events[]
// }

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const searchWord = String(ctx.query.keyword)

//   let newSearchResults: Events[] = []

//   if (searchWord != undefined) {
//     const data: Events[] = await searchEvent10(searchWord)

//     data?.map((doc) => {
//       const searchResult: Events = {
//         event_id: doc.event_id,
//         event_name: doc.event_name,
//         content_name: doc.content_name,
//         date: doc.date,
//       }
//       newSearchResults.push(searchResult)
//     })
//   }

//   return {
//     props: {
//       searchResults: newSearchResults,
//     },
//   }
// }
// export default function Search(props: Props) {
//   const router = useRouter()
//   const keyword = router.query.keyword

//   const meta: MetaProps = {
//     title: 'GOODSist イベントのグッズ代が計算できるWEBアプリ',
//     url: 'https://goodslist-pearl.vercel.app/',
//     image: 'https://goodslist-pearl.vercel.app/images/ogp.png',
//   }

//   return (
//     <>
//       <Meta title={meta.title} url={meta.url} image={meta.image} />
//       <Header />
//       <Box background='#fff' padding='60px 20px 0px 20px'>
//         <Title title='Search Result' />
//       </Box>
//       {props.searchResults.length > 0 ? (
//         <SearchResult searchResults={props.searchResults} keyword={keyword} />
//       ) : (
//         <NoSearchResult keyword={keyword} />
//       )}
//     </>
//   )
// }
