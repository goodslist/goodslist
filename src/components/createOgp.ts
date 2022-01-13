import fs from 'fs'
import * as path from 'path'

import puppeteer from 'puppeteer-core'
import chromium from 'chrome-aws-lambda'

const createOgp = async (
  content_name: string,
  event_id: string,
  event_name: string,
): Promise<void> => {
  const ogp = {
    content_name: content_name,
    event_name: event_name,
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

        .content_name {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80%;
          height: 30%;
          margin: auto;
          color: #374151;
          font-size: 4rem;
          font-weight: bold;
          line-height: 1.5;
        }

        .event_name {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80%;
          height: 60%;
          margin: auto;
          color: #374151;
          font-size: 4rem;
          font-weight: bold;
          line-height: 1.5;
        }

        </style>
      </head>
      <body>
        <div class='content_name'>${ogp.content_name}</div>
        <div class='event_name'>${ogp.event_name}</div>
      </body>
    </html>`

  const page = await browser.newPage()
  await page.setContent(html)
  const buffer: any = await page.screenshot()

  fs.writeFileSync(path.resolve(`./public/ogp/${event_id}.png`), buffer)
}

export default createOgp
