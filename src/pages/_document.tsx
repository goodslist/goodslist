import Document, { Html, Head, Main, NextScript } from 'next/document'
class MyDocument extends Document {
  render() {
    return (
      <Html lang='ja'>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
          {/* 空のscriptタグを入れることにより、styleが当たらないバグを解消 */}
          <script> </script>
        </body>
      </Html>
    )
  }
}

export default MyDocument
