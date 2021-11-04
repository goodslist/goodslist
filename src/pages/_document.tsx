import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head></Head>
        <body>
          <Main />
          <div id='modal' />
          <NextScript />
        </body>
      </html>
    )
  }
}
