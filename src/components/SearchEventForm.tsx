import Link from 'next/dist/client/link'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { Events } from '../components/types'
import searchEvent from '../components/db/SearchEvent'

export default function SearchEventForm() {
  const [input, setInput] = useState<string>('')
  const [events, setEvents] = useState<Events[]>([])
  const [searchFocus, setSearchFocus] = useState<boolean>(false)
  const router = useRouter()

  const searchRef = useRef<HTMLInputElement>(null)
  const [searchTop, setSearchTop] = useState(0)

  useEffect(() => {
    if (searchRef.current) setSearchTop(searchRef.current.getBoundingClientRect().y)
  }, [])

  const [searchFocus2, setSearchFocus2] = useState<boolean>(false)

  //エンターキーを押した時、submitを止める
  const enterForm = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault()
    clickButton()
  }

  useEffect(() => {
    inputSearchWord()
  }, [input])

  const inputSearchWord = async () => {
    if (input?.length > 0) {
      const SearchResults: Events[] = await searchEvent(input)
      setEvents(SearchResults)
    }
  }

  const onFocusInput = () => {
    setSearchFocus(true)
    console.log(searchRef.current!.getBoundingClientRect())
  }
  const onBlurInput = (e: any) => {
    console.log(e)
    setSearchFocus(false)
  }

  const onMouseOver = (e: any) => {
    setSearchFocus2(true)
    console.log(e)
  }

  const onMouseLeave = (e: any) => {
    setSearchFocus2(false)
    console.log(e)
  }

  //入力テキストを元に検索結果へ遷移する
  const clickButton = () => {
    //テキストが未入力の時は無効にする
    if (!input) {
      return
    }

    router.push({
      pathname: '/search', //URL
      query: { keyword: input }, //検索クエリ
    })
  }

  return (
    <form className={styles.search_container} onSubmit={enterForm}>
      <input
        type='text'
        className={input ? styles.search_active : styles.search}
        placeholder='アーティスト・イベント名で検索'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => onFocusInput()}
        onBlur={(e) => onBlurInput(e.target)}
        ref={searchRef}
      />
      <span
        className={input ? styles.search_button_active : styles.search_button}
        onClick={clickButton}
      >
        {/* <Search /> */}
      </span>
      {(events?.length > 0 && input.length > 0 && searchFocus) || searchFocus2 ? (
        <ul className={styles.search_result_active}>
          {events.map((event) => (
            <li key={event.event_id} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
              <Link href={'/event/' + event.event_id}>
                <a>
                  <b>{event.content_name}</b>
                  <br />
                  {event.event_name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <></>
      )}
    </form>
  )
}
