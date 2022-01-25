import styles from '../../styles/components/view.module.css'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  background: string
  padding: string
}

const Box = ({ children, background, padding }: Props) => {
  const style = {
    margin: 0,
    width: '100%',
    padding: padding,
    background: background,
  }

  return (
    <div style={style}>
      <div className={styles.box_nomal}>{children}</div>
    </div>
  )
}

export default Box
