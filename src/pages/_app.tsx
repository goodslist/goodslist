import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { AuthProvider } from '../components/auth/AuthContext'
import { ModalProvider } from '../components/modal/ModalContext'
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div id='modal' />
      <ModalProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ModalProvider>
    </AuthProvider>
  )
}
export default MyApp
