import Navbar from './Navber'
import Footer from './Footer'
import Button_top from './Button_top'
import { ReactNode } from 'react'
import ScrollButton from './ScrollButton'
import styles from '../styles/Layout.module.css'
import Modal from './Modal'
import { ModalContext } from './modal/ModalContext'
import { useContext } from 'react'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const { modalContent, closeModal }: any = useContext(ModalContext)
  return (
    <>
      <div className={styles.main_container}>{children}</div>
      <Footer />
      <ScrollButton />
      <Modal onClose={closeModal} />
      {/* <Button_top /> */}
    </>
  )
}
