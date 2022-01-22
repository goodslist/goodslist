import Link from 'next/dist/client/link'
import styles from '../styles/components/SearchEventForm.module.css'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { Events } from '../components/types'
import searchEvent from '../components/db/SearchEvent'

export default function SearchEventForm(props: any) {
  const router = useRouter()

  const [input, setInput] = useState<string>('')
  const [events, setEvents] = useState<Events[]>([])

  const [isFocusSearchInput, setIsFocusSearchInput] = useState(false)
  const [isHoverSearchResult, setIsHoverSearchResult] = useState(false)

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
    if (input.length == 0) setEvents([])
  }, [input])

  const inputSearchWord = async () => {
    if (input?.length > 0) {
      const SearchResults: Events[] = await searchEvent(input)
      setEvents(SearchResults)
    }
  }

  //虫眼鏡ボタンかエンターが押下されたら、検索結果ページに遷移する。
  const clickButton = async () => {
    //テキストが未入力の時は無効にする
    if (!input) {
      return
    }

    await router.push({
      pathname: '/search',
      query: { keyword: input },
    })

    setInput('')
    setEvents([])
    props.setIsSearchOpen(false)
  }

  //サジェストのイベントが押下されたら、イベントページに遷移する。
  const moveEvent = async (event_id: number) => {
    await router.push({
      pathname: '/event/' + event_id,
    })

    setInput('')
    setEvents([])
    props.setIsSearchOpen(false)
  }

  return (
    <div>
      <form
        className={styles.search_container}
        onSubmit={enterForm}
        onBlur={() => setIsFocusSearchInput(false)}
      >
        <input
          type='text'
          className={input ? styles.search_active : styles.search}
          placeholder='アーティスト・イベント名で検索'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocusSearchInput(true)}
          ref={searchRef}
        />
        <span
          className={input ? styles.search_button_active : styles.search_button}
          onClick={clickButton}
        ></span>
        {isFocusSearchInput || isHoverSearchResult ? (
          <ul className={styles.search_result_active}>
            {events.map((event) => (
              <li
                key={event.event_id}
                onMouseOver={() => setIsHoverSearchResult(true)}
                onMouseLeave={() => setIsHoverSearchResult(false)}
                onClick={() => moveEvent(event.event_id)}
              >
                <b>{event.content_name}</b>
                <br />
                {event.event_name}
              </li>
            ))}
          </ul>
        ) : (
          <></>
        )}
      </form>
    </div>
  )
}
