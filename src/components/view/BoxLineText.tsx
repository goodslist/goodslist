import styles from '../../styles/components/view.module.css'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const BoxLineText = ({ children }: Props) => {
  return <div className={styles.box_line_text}>{children}</div>
}

export default BoxLineText
