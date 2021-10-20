import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { useFlip, FlipProvider } from 'react-easy-flip'
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FlipProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </FlipProvider>
  )
}
export default MyApp
