import styles from '../../styles/components/view.module.css'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  background: string
  padding: string
}

const BoxGrid = ({ children, background, padding }: Props) => {
  const box = {
    margin: 0,
    width: '100%',
    padding: padding,
    background: background,
  }

  return (
    <div style={box}>
      <div className={styles.box_grid}>{children}</div>
    </div>
  )
}

export default BoxGrid
