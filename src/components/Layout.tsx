import Navbar from './Navber'
import Footer from './Footer'
import Button_top from './Button_top'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Button_top />
      <Footer />
    </>
  )
}
