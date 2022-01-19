import styles from '../../styles/Home.module.css'
import ScrollAnimation from '../ScrollAnimation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Events } from '../types'
import { dateFormat } from '../../components/Utils'

const EventList = (props: any) => {
  const [isFadeInTitle, setIsFadeInTitle] = useState(false)
  const [isFadeInTitleBar, setIsFadeInTitleBar] = useState(false)
  const [isFadein, setIsFadein] = useState<boolean[]>(
    new Array<boolean>(props.events.length).fill(false),
  )

  const ref = useRef<HTMLLIElement>(null)

  //普通に配列を呼び出すとuseEffectからのコールバックで配列が常に初期状態になるのでprevStateで前回の配列を呼び出して処理する。
  const intersectCallback = (index: number) => {
    if (index == 5) {
      setIsFadeInTitle(true)
      setTimeout(function () {
        setIsFadeInTitleBar(true)
      }, 200)
    } else {
      setIsFadein((prevState) => {
        const newPrevState = [...prevState]
        newPrevState[index] = true
        return newPrevState
      })
    }
  }
  const [startAfter, setStartAfter] = useState<any>()
  const [startBefore, setStartBefore] = useState<any>()

  useEffect(() => {
    if (props.start == 'left') {
      setStartAfter(styles.fadein_left_after)
      setStartBefore(styles.fadein_left_before)
    } else {
      setStartAfter(styles.fadein_right_after)
      setStartBefore(styles.fadein_right_before)
    }
  }, [])

  return (
    <div className={styles.event_list_container}>
      <ScrollAnimation index={5} onIntersection={intersectCallback}>
        <div className={styles.event_list_title_container}>
          <p
            className={
              isFadeInTitle
                ? `${styles.event_list_title} ${styles.fadein_bottom_after}`
                : `${styles.event_list_title} ${styles.fadein_bottom_before}`
            }
          >
            {props.title}
          </p>
          <hr
            className={
              isFadeInTitleBar
                ? `${styles.event_list_title_bar} ${styles.fadein_bottom_after}`
                : `${styles.event_list_title_bar} ${styles.fadein_bottom_before}`
            }
          ></hr>
        </div>
      </ScrollAnimation>
      <ul className={styles.ul_event}>
        {props.events.map((event: Events, index: number) => (
          <ScrollAnimation index={index} onIntersection={intersectCallback}>
            <li
              ref={ref}
              key={event.event_id}
              className={
                isFadein[index]
                  ? `${styles.li_event} ${styles.fadein_right_after}`
                  : `${styles.li_event} ${styles.fadein_right_before}`
              }
            >
              <Link href={'event/' + event.event_id}>
                <a>
                  <div className={styles.li_event_padding}>
                    <p className={styles.contents_title}>
                      <b>{event.content_name}</b>
                    </p>
                    <p className={styles.event_date}>{dateFormat(event.date)}</p>
                    <hr className={styles.li_event_line} />
                    <p className={styles.event_title}>{event.event_name}</p>
                  </div>
                </a>
              </Link>
            </li>
          </ScrollAnimation>
        ))}
      </ul>
    </div>
  )
}

export default EventList

{
  /* <ScrollAnimation index={index} onIntersection={intersectCallback}>
<li
  ref={ref}
  key={event.event_id}
  className={
    isFadein[index]
      ? `${styles.li_event} ${startAfter}`
      : `${styles.li_event} ${startBefore}`
  }
>
  <Link href={'event/' + event.event_id}>
    <a>
      <div className={styles.li_event_padding}>
        <p className={styles.contents_title}>
          <b>{event.content_name}</b>
        </p>
        <p className={styles.event_date}>{dateFormat(event.date)}</p>
        <hr className={styles.li_event_line} />
        <p className={styles.event_title}>{event.event_name}</p>
      </div>
    </a>
  </Link>
</li>
</ScrollAnimation> */
}
