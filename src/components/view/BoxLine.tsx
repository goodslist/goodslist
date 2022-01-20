import styles from '../../styles/components/view.module.css'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const BoxLine = ({ children }: Props) => {
  return <div className={styles.box_line}>{children}</div>
}

export default BoxLine
