import styles from '../../styles/Home.module.css'
import ScrollAnimation from '../ScrollAnimation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Events } from '../types'
import { dateFormat } from '../../components/Utils'

const EventList = (props: any) => {
  const [isFadein, setIsFadein] = useState<boolean[]>(
    new Array<boolean>(props.events.length).fill(false),
  )

  const ref = React.useRef<HTMLLIElement>(null)

  const intersectCallback = (index: number) => {
    setIsFadein((prevState) => {
      const newPrevState = [...prevState]
      newPrevState[index] = true
      return newPrevState
    })
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
    <ul className={styles.ul_event}>
      {props.events.map((event: Events, index: number) => (
        <ScrollAnimation index={index} onIntersection={intersectCallback}>
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
        </ScrollAnimation>
      ))}
    </ul>
  )
}

export default EventList
