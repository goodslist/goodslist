import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { AuthProvider } from '../components/auth/AuthContext'
import { ListProvider } from '../components/list/ListContext'
import { ModalProvider } from '../components/modal/ModalContext'
import { SignUpProvider } from '../components/signup/SignUpContext'
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div id='modal' />
      <ModalProvider>
        <SignUpProvider>
          <ListProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ListProvider>
        </SignUpProvider>
      </ModalProvider>
    </AuthProvider>
  )
}
export default MyApp
