import styles from '../../styles/components/view.module.css'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const BoxWhite = ({ children }: Props) => {
  return <div className={styles.box_white}>{children}</div>
}

export default BoxWhite
