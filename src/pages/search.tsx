import { useRouter } from 'next/router'
import { supabase } from '../components/supabase'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Output() {
  const router = useRouter()

  const word = router.query.word

  class SearchResult {
    event_id: number = 0
    content_name: string = ''
    event_name: string = ''
    content_name_hira: string = ''
  }

  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  let newSearchResults: SearchResult[] = []

  async function abc() {
    const { data, error } = await supabase
      .from('events')
      .select('event_id, event_name, contents(content_name, content_name_hira, content_name_kana)')
      .ilike('event_name', '%' + word + '%')
    data?.map((doc) => {
      const searchResult: SearchResult = {
        event_id: doc.event_id,
        content_name: doc.contents.content_name,
        event_name: doc.event_name,
        content_name_hira: doc.contents.content_name_hira,
      }
      newSearchResults.push(searchResult)
    })
    setSearchResults(newSearchResults)
  }
  useEffect(() => {
    abc()
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {/* パラメータの表示 */}
      <h1>input：{word}</h1>
      <ul>
        {searchResults?.map((searchResult) => (
          <>
            <li>
              <b>{searchResult.content_name}</b>{' '}
              <Link href={'../event/' + searchResult.event_id}>
                <a>{searchResult.event_name}</a>
              </Link>
            </li>
          </>
        ))}
      </ul>
    </div>
  )
}
