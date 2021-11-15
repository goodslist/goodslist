import styles from '../../styles/components/form.module.css'
import { FC } from 'react'

//フォームの枠
const Form: FC = ({ children }) => {
  return <div className={styles.form}>{children}</div>
}

export default Form
