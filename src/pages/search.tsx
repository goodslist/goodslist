import { useRouter } from 'next/router'
import { supabase } from '../components/supabase'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '../styles/Search.module.css'
import Navbar from '../components/Navber'

export default function Output() {
  const router = useRouter()

  const searchWord = router.query.word

  class SearchResult {
    event_id: number = 0
    content_name: string = ''
    event_name: string = ''
  }

  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  async function search() {
    let newSearchResults: SearchResult[] = []
    const { data, error } = await supabase
      .from('searches')
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
    setSearchResults(newSearchResults)
  }
  useEffect(() => {
    search()
  }, [])

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* パラメータの表示 */}
        <div className={styles.search_result_title}>
          {searchWord}　を含む検索結果({searchResults.length}件)
        </div>
        {console.log('aaa')}
        <ul className={styles.card}>
          {searchResults?.map((searchResult) => (
            <>
              <li>
                <Link href={'../event/' + searchResult.event_id}>
                  <a>
                    <b>{searchResult.content_name}</b>
                    <br />
                    {searchResult.event_name}
                    <span />
                  </a>
                </Link>
              </li>
            </>
          ))}
        </ul>
      </main>
    </>
  )
}
