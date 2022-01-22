import styles from '../../styles/components/view.module.css'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  background: string
  padding: string
  // zIndex: string
}

const Box = ({ children, background, padding }: Props) => {
  const box = {
    margin: 0,
    width: '100%',
    padding: padding,
    background: background,
    // zIndex: Number(zIndex),
  }

  return (
    <div style={box}>
      <div className={styles.box_nomal}>{children}</div>
    </div>
  )
}

export default Box
