import Footer from './Footer'
import { ReactNode } from 'react'
// import ScrollButton from './ScrollButton'
import styles from '../styles/Layout.module.css'
import ScrollTopButton from './ScrollTopButton'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <div className={styles.main_container}>{children}</div>
      <Footer />
      <ScrollTopButton />
    </>
  )
}
