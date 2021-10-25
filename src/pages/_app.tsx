import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { LoginProvider } from '../components/auth/LoginContext'
import { ModalProvider } from '../components/modal/ModalContext'
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LoginProvider>
      <ModalProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ModalProvider>
    </LoginProvider>
  )
}
export default MyApp
