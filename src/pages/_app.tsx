import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { AuthProvider } from '../components/auth/AuthContext'
import { ModalProvider } from '../components/modal/ModalContext'
import Loading from '../components/modal/Loading'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div id='modal' />
      <ModalProvider>
        <Layout>
          <Loading />
          <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
            language='ja'
          >
            <Component {...pageProps} />
          </GoogleReCaptchaProvider>
        </Layout>
      </ModalProvider>
    </AuthProvider>
  )
}
export default MyApp
