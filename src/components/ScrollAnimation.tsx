import { StylesProvider } from '@material-ui/core'
import React, { useEffect } from 'react'
import styles from '../styles/Home.module.css'

type Props = {
  index: number
  onIntersection?: (index: number) => void
}

const Container: React.FC<Props> = ({ index, onIntersection, children }) => {
  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (onIntersection !== undefined) {
            onIntersection(index)
          }
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current === null) return

    observer.observe(ref.current)

    const { current } = ref

    return () => {
      observer.unobserve(current)
    }
  }, [])

  return (
    <div className={styles.abc} ref={ref}>
      {children}
    </div>
  )
}

export default Container
