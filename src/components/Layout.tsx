import Navbar from './Navber'
import Footer from './Footer'
import Button_top from './Button_top'
import { ReactNode } from 'react'
import ScrollButton from './ScrollButton'
import styles from '../styles/Layout.module.css'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <div className={styles.main_container}>
        <main className={styles.main}>{children}</main>
      </div>
      <Footer />
      <ScrollButton />
      {/* <Button_top /> */}
    </>
  )
}
