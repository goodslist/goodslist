import Link from 'next/dist/client/link'
import styles from '../styles/components/SearchEventForm.module.css'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { Events } from '../components/types'
import searchEvent from '../components/db/SearchEvent'

export default function SearchEventForm(props: any) {
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
  const clickButton = async () => {
    //テキストが未入力の時は無効にする
    if (!input) {
      return
    }

    await router.push({
      pathname: '/search', //URL
      query: { keyword: input }, //検索クエリ
    })

    // props.setIsSearchOpen(false)
    setInput('')
    setEvents([])
    setSearchFocus(false)
  }

  const moveEvent = async (event_id: number) => {
    await router.push({
      pathname: '/event/' + event_id, //URL
      // query: { keyword: input }, //検索クエリ
    })
    // props.setIsSearchOpen(false)
    setInput('')
    setEvents([])
    setSearchFocus(false)
  }

  const [isShowSearchResult, setIsShowSearchResult] = useState(false)
  const [isShowSearchResult2, setIsShowSearchResult2] = useState(false)
  const textInputRef: any = useRef()
  useEffect(() => {
    if (events?.length > 0) {
      setIsShowSearchResult(true)
    }
  }, [events])

  return (
    <div>
      {isShowSearchResult ? 'isShowSearchResulttrue' : 'isShowSearchResultfalse'}
      <br></br>
      {isShowSearchResult2 ? 'isShowSearchResult2true' : 'isShowSearchResult2false'}
      <form className={styles.search_container} onSubmit={enterForm}>
        <div onBlur={() => setIsShowSearchResult(false)}>
          <input
            type='text'
            className={input ? styles.search_active : styles.search}
            placeholder='アーティスト・イベント名で検索'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsShowSearchResult(true)}
            onBlur={(e) => onBlurInput(e.target)}
            // ref={searchRef}
            ref={searchRef}
          />
          <span
            className={input ? styles.search_button_active : styles.search_button}
            onClick={clickButton}
          >
            {/* <Search /> */}
          </span>
          {/* {(events?.length > 0 && input.length > 0 && searchFocus) || searchFocus2 ? ( */}
          {isShowSearchResult || isShowSearchResult2 ? (
            <ul className={styles.search_result_active} onBlur={() => console.log('onBlur')}>
              {events.map((event) => (
                // <li key={event.event_id} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
                //   <Link href={'/event/' + event.event_id}>
                //     <a>
                //       <b>{event.content_name}</b>
                //       <br />
                //       {event.event_name}
                //     </a>
                //   </Link>
                // </li>
                <li
                  key={event.event_id}
                  onMouseOver={() => setIsShowSearchResult2(true)}
                  onMouseLeave={() => setIsShowSearchResult2(false)}
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
        </div>
      </form>
    </div>
  )
}

//   {/* {(events?.length > 0 && input.length > 0 && searchFocus) || searchFocus2 ? ( */}
//     {(events?.length > 0 && input.length > 0) || searchFocus2 ? (
//       <ul className={styles.search_result_active} ref={menuRef} onBlur={() => console.log('aaa')}>
//         {events.map((event) => (
//           // <li key={event.event_id} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
//           //   <Link href={'/event/' + event.event_id}>
//           //     <a>
//           //       <b>{event.content_name}</b>
//           //       <br />
//           //       {event.event_name}
//           //     </a>
//           //   </Link>
//           // </li>
//           <li
//             key={event.event_id}
//             onMouseOver={onMouseOver}
//             onMouseLeave={onMouseLeave}
//             onClick={() => moveEvent(event.event_id)}
//           >
//             <b>{event.content_name}</b>
//             <br />
//             {event.event_name}
//           </li>
//         ))}
//       </ul>
//     ) : (
//       <></>
//     )}
//   </form>
// )
