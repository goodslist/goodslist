import styles from '../styles/Button_top.module.css'
import * as React from 'react'
import { useEffect } from 'react'

export default function App() {
  // scroll が高さを超えているとき trueになるstate
  const [go_top, setGo_top] = React.useState(false)
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
        setGo_top(true)
      } else {
        setGo_top(false)
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
      <div className={go_top ? 'scroll go_top' : 'scroll'} onClick={returnButtonTop}>
        あ2
      </div>
    </>
  )
}
