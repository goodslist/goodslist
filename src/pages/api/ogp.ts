import type { NextApiRequest, NextApiResponse } from 'next'
import { createCanvas, registerFont } from 'canvas'
import * as path from 'path'
const createOgp = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { id } = req.query
  const WIDTH = 1200 as const
  const HEIGHT = 630 as const
  const DX = 0 as const
  const DY = 0 as const
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')

  registerFont(path.resolve('./public/fonts/kosugi.ttf'), {
    family: 'Noto',
  })

  ctx.fillStyle = '#FFF'
  ctx.fillRect(DX, DY, WIDTH, HEIGHT)
  ctx.font = '40px ipagp'
  ctx.fillStyle = '#000000'
  // ctx.textAlign = 'center'
  // ctx.textBaseline = 'middle'
  const text = String(id)
  ctx.fillText(text, 150, 150)
  ctx.font = '100px ipagp'
  const text2 = String('1st TOUR 2021 aaa')
  ctx.fillText(text2, 300, 300)
  // ctx.fillText(text2, 150, 250)
  // const text3 = String('COLORFUL LIVE 1st - Link -')
  // ctx.fillText(text3, 150, 330)
  // const text4 = String('Love the Life We Live～')
  // ctx.fillText(text4, 150, 410)
  ctx.font = '30px ipagp'
  const text5 = String('イベントのグッズ代が計算できるWEBアプリ')
  ctx.fillText(text5, 150, 520)
  ctx.font = '60px ipagp'
  const text6 = String('GOODSist')
  ctx.fillText(text6, 800, 530)

  const buffer = canvas.toBuffer()

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': buffer.length,
  })
  res.end(buffer, 'binary')
}

export default createOgp
