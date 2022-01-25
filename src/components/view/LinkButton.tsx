import styles from '../../styles/components/view.module.css'
import Link from 'next/link'

const LinkButton = (props: any) => {
  return (
    <Link href='/'>
      <a>
        <button className={styles.btn_Link}>{props.text}</button>
      </a>
    </Link>
  )
}

export default LinkButton
