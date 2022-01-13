import Head from 'next/head'
import { Meta } from './types'

const Meta = (props: Meta) => {
  return (
    <Head>
      <title>{props.title}</title>
      <meta property='og:site_name' content='Goodsist' />
      <meta property='og:title' content={props.title} />
      <meta name='description' content='グッズ代が計算できるWEBアプリ' />
      <link rel='canonical' href={props.url} />
      <meta property='og:url' content={props.url} />
      <meta property='og:image' content={props.image} />
      <meta property='og:type' content='article' />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0' />
      <link rel='icon' href='/favicon.ico' />
      <link
        href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap&text=Goodsist'
        rel='stylesheet'
      />
    </Head>
  )
}

export default Meta
