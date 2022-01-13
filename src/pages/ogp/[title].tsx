import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import puppeteer from 'puppeteer-core'
import chromium from 'chrome-aws-lambda'

const Image: React.FC = () => {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<any> => {
  // const title = params
  const title = context.params

  if (!title) {
    context.res.statusCode = 400
    context.res.end('Bad Request')
    return { props: {} }
  }
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1200, height: 675 },
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  })

  const html = `<html>
      <head>
        <style>

        body {
          width: 1200px;
          height: 675px;
          background-color: #f9fafb;
        }

        div {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 60%;
          height: 100%;
          margin: auto;
          color: #374151;
          font-size: 3rem;
          font-weight: bold;
          line-height: 1.5;
        }

        </style>
      </head>
      <body>
        <div>${title}</div>
      </body>
    </html>`

  const page = await browser.newPage()
  await page.setContent(html)
  const buffer = await page.screenshot()

  context.res.setHeader('Content-Type', 'image/png')
  context.res.setHeader(
    'Cache-Control',
    'public, immutable, no-transform, s-maxage=31536000, max-age=31536000',
  )
  context.res.end(buffer, 'binary')

  return { props: {} }
}

export default Image
