import styles from '../../styles/Home.module.css'
import ScrollAnimation from '../../components/ScrollAnimation'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { TopicProps } from '../../components/types'

const Topic = (props: TopicProps) => {
  const [isImage, setIsImage] = useState(false)
  const [isTitle, setIsTitle] = useState(false)
  const [isText, setIsText] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const intersectCallback = (index: number) => {
    if (index == 0) setIsImage(true)
    else if (index == 1) setIsTitle(true)
    else if (index == 2) setIsText(true)
  }
  return (
    <div className={styles.topic_container}>
      <ScrollAnimation index={0} onIntersection={intersectCallback}>
        <div
          className={
            isImage
              ? `${styles.topic_image} ${styles.fadein_bottom_after}`
              : `${styles.topic_image} ${styles.fadein_bottom_before}`
          }
        >
          <Image src={props.image} width={355} height={355} alt={props.alt} />
        </div>
      </ScrollAnimation>
      <ScrollAnimation index={1} onIntersection={intersectCallback}>
        <p
          className={
            isTitle
              ? `${styles.topic_title} ${styles.fadein_left_after}`
              : `${styles.topic_title} ${styles.fadein_left_before}`
          }
        >
          {props.title}
        </p>
      </ScrollAnimation>

      <ScrollAnimation index={2} onIntersection={intersectCallback}>
        <p
          className={
            isText
              ? `${styles.topic_text} ${styles.fadein_left_after}`
              : `${styles.topic_text} ${styles.fadein_left_before}`
          }
        >
          {props.text}
        </p>
      </ScrollAnimation>
    </div>
  )
}

export default Topic
