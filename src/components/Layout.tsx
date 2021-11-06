import Footer from './Footer'
import Header from './Header'
import { ReactNode } from 'react'
import ScrollButton from './ScrollButton'
import styles from '../styles/Layout.module.css'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <div className={styles.main_container}>{children}</div>
      <Footer />
      <ScrollButton />
    </>
  )
}
