import styles from '../../styles/Home.module.css'
import ScrollAnimation from '../../components/ScrollAnimation'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const Topic = (props: any) => {
  const [isImage, setIsImage] = useState(false)
  const [isTitle, setIsTitle] = useState(false)
  const [isText, setIsText] = useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const intersectCallback = (index: number) => {
    if (index == 0) setIsImage(true)
    else if (index == 1) setIsTitle(true)
    else if (index == 2) setIsText(true)
  }
  return (
    <>
      <ScrollAnimation index={0} onIntersection={intersectCallback}>
        <div
          className={
            isImage
              ? `${styles.topic_image} ${styles.fadein_bottom_after}`
              : `${styles.topic_image} ${styles.fadein_bottom_before}`
          }
        >
          <Image src='/images/iphone.png' width={355} height={355} alt='iphone' />
        </div>
      </ScrollAnimation>
      <ScrollAnimation index={1} onIntersection={intersectCallback}>
        <div
          className={
            isTitle
              ? `${styles.topic_title} ${styles.fadein_left_after}`
              : `${styles.topic_title} ${styles.fadein_left_before}`
          }
        >
          答えは27,100円です。
        </div>
      </ScrollAnimation>

      <ScrollAnimation index={2} onIntersection={intersectCallback}>
        <div
          className={
            isText
              ? `${styles.topic_text} ${styles.fadein_left_after}`
              : `${styles.topic_text} ${styles.fadein_left_before}`
          }
        >
          日頃からイベントに参加する人は、誰しもがこのような経験をしたことがあると思います。
          私自身が感じたこういうアプリがあれば便利なのになというものを作りました。
          登録があるイベントであれば、アイテムを追加していくだけで自動的に合計金額を計算します。
        </div>
      </ScrollAnimation>
    </>
  )
}

export default Topic
