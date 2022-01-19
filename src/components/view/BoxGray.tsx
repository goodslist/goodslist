import styles from '../../styles/components/view.module.css'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const BoxGray = ({ children }: Props) => {
  return <div className={styles.box_gray}>{children}</div>
}

export default BoxGray
