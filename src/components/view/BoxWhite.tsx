import styles from '../../styles/components/view.module.css'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const style = {
  // minWidth: 64,       // 数値は"64px"のように、pxとして扱われます
  // lineHeight: "32px",
  // borderRadius: 4,
  // border: "none",
  // padding: "0 16px",
  background: 'red',
  // background: "#639"
}

const BoxWhite = ({ children }: Props) => {
  return (
    <div className={styles.box_white} style={style}>
      {children}
    </div>
  )
}

export default BoxWhite
