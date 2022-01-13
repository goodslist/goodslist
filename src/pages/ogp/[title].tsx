import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import puppeteer from 'puppeteer-core'
import chromium from 'chrome-aws-lambda'
import { supabase } from '../../components/supabase'

const Image: React.FC = () => {
  return <></>
}

type PathParams = {
  title: string
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<any> => {
  // const title = params
  const { title } = context.params as PathParams

  if (!title) {
    context.res.statusCode = 400
    context.res.end('Bad Request')
    return { props: {} }
  }

  const { data, error } = await supabase
    .from('events')
    .select('event_name, contents(content_name)')
    .eq('event_id', Number(title))

  const ogp = {
    content_name: data![0].contents.content_name,
    event_name: data![0].event_name,
  }

  await chromium.font('https://goodslist-pearl.vercel.app/fonts/KosugiMaru-Regular.ttf')
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1200, height: 630 },
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  })

  const html = `<html lang="ja">
      <head>
        <style>

        body {
          width: 1200px;
          height: 630px;
          background-color: #f9fafb;
          background: url('https://goodslist-pearl.vercel.app/images/ogp.png');
          background-position: 0% 0%;
          background-size: 1200px 630px;
        }

        div {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 60%;
          height: 40%;
          margin: auto;
          color: #374151;
          font-size: 2rem;
          font-weight: bold;
          line-height: 1.5;
        }

        </style>
      </head>
      <body>
        <div>${ogp.content_name}</div>
        <div>${ogp.event_name}</div>
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
