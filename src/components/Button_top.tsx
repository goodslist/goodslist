import styles from '../styles/Button_top.module.css'
import * as React from 'react'
import { useEffect } from 'react'

export default function Button_top() {
  // scroll が高さを超えているとき trueになるstate
  const [scroll, setScroll] = React.useState(styles.button_scroll_active)
  const returnButtonTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const scrollAction = () => {
      if (150 > window.scrollY) {
        // 150の値は 判定したい高さに変更する
        setScroll(styles.button_scroll)
      } else {
        setScroll(styles.button_scroll_active)
      }
    }
    window.addEventListener('scroll', scrollAction, {
      capture: false,
      passive: true,
    })
    scrollAction() // 初期描画時に一度だけ判定する

    return () => {
      window.removeEventListener('scroll', scrollAction)
    }
  }, [])

  return (
    <>
      <div className={scroll} onClick={returnButtonTop}></div>
    </>
  )
}
