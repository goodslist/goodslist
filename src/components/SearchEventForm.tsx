import Link from 'next/dist/client/link'
import styles from '../styles/components/SearchEventForm.module.css'
import { useState, useEffect, useRef, useContext } from 'react'
import { useRouter } from 'next/router'
import { Events } from '../components/types'
import { searchEvent } from '../components/db/SearchEvent'
import { ModalContext } from '../components/modal/ModalContext'

export default function SearchEventForm(props: any) {
  const router = useRouter()

  //検索ウインドウのコンテキスト
  const { setIsLoading, setIsShowSearch }: any = useContext(ModalContext)

  const [input, setInput] = useState<string>('')
  const [events, setEvents] = useState<Events[]>([])

  const [isFocusSearchInput, setIsFocusSearchInput] = useState(false)
  const [isHoverSearchResult, setIsHoverSearchResult] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)
  const [searchTop, setSearchTop] = useState(0)

  useEffect(() => {
    if (searchRef.current) setSearchTop(searchRef.current.getBoundingClientRect().y)
  }, [])

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
    await setIsLoading(true)

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
    setIsShowSearch(false)
    await setIsLoading(false)
  }

  //サジェストのイベントが押下されたら、イベントページに遷移する。
  const moveEvent = async (event_id: number) => {
    await setIsLoading(true)

    await router.push({
      pathname: '/event/' + event_id,
    })

    setInput('')
    setEvents([])
    setIsShowSearch(false)
    await setIsLoading(false)
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
        {input.length != 0 ? (
          <span className={styles.search_button_active} onClick={clickButton} />
        ) : (
          <span className={styles.search_button} />
        )}
        {isFocusSearchInput || isHoverSearchResult ? (
          <ul className={styles.search_result_active}>
            {events.map((event, index) => (
              <li
                className={
                  index == 0 ? styles.search_result_active_li_top : styles.search_result_active_li
                }
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
