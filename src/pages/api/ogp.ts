import type { NextApiRequest, NextApiResponse } from 'next'
import { createCanvas, registerFont, loadImage } from 'canvas'
import { supabase } from '../../components/supabase'
import * as path from 'path'

const createOgp = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { event_id } = req.query

  const { data, error } = await supabase
    .from('events')
    .select('event_name, contents(content_name)')
    .eq('event_id', event_id)

  const ogp = {
    content_name: data![0].contents.content_name,
    event_name: data![0].event_name,
  }

  //   const WIDTH = 1200 as const
  //   const HEIGHT = 630 as const
  //   const canvas = createCanvas(WIDTH, HEIGHT)
  //   const ctx = canvas.getContext('2d')
  //   // registerFont(path.resolve('./public/fonts/NotoSansJP-Regular.otf'), {
  //   //   family: 'Noto',
  //   // })
  //   registerFont(path.resolve('./public/fonts/KosugiMaru-Regular.ttf'), { family: 'KosugiMaru' })
  //   // ctx.fillStyle = '#FFF'

  //   const test =
  //     'SANKYO presents マクロスF ギャラクシーライブ 2021［リベンジ］〜まだまだふたりはこれから！私たちの歌を聴け！！'
  //   const backgroundImage = await loadImage(path.resolve('./public/images/ogp.png'))
  //   ctx.fillRect(0, 0, WIDTH, HEIGHT)
  //   ctx.font = '40px "KosugiMaru"'
  //   ctx.fillStyle = '#000000'
  //   ctx.textAlign = 'left'
  //   ctx.textBaseline = 'top'
  //   let content_name = ogp.content_name
  //   // const content_name = ogp.content_name
  //   ctx.drawImage(backgroundImage, 0, 0, WIDTH, HEIGHT)

  //   let content_name_len = 0
  //   for (let i = 0; i < content_name.length; i++) {
  //     if (/^[\x20-\x7e]*$/.test(content_name.charAt(i))) {
  //       content_name_len = content_name_len + 1
  //     } else {
  //       content_name_len = content_name_len + 2
  //     }
  //   }
  //   if (content_name_len > 44) {
  //     content_name = content_name.slice(0, -3)
  //     content_name = content_name + '...'
  //   }
  //   ctx.fillText(content_name, 150, 100, 900)
  //   ctx.font = '50px "KosugiMaru"'
  //   // const event_name = ogp.event_name
  //   const event_name = ogp.event_name
  //   const event_names = event_name.split(' ')
  //   for (let i = 0; i < event_names.length; i++) {
  //     if (i < event_names.length - 1) {
  //       event_names[i] = event_names[i] + ' '
  //     }
  //   }

  //   let event_name_list = ['']
  //   let len = 0
  //   for (let i = 0; i < event_names.length; i++) {
  //     if (/^[\x20-\x7e]*$/.test(event_names[i])) {
  //       if (len + event_names[i].length < 37) {
  //         event_name_list[event_name_list.length - 1] =
  //           event_name_list[event_name_list.length - 1] + event_names[i]
  //         len = len + event_names[i].length
  //       } else {
  //         event_name_list.push(event_names[i])
  //         len = 0
  //       }
  //     } else {
  //       for (let x = 0; x < event_names[i].length; x++) {
  //         if (/^[\x20-\x7e]*$/.test(event_names[i].charAt(x))) {
  //           if (len + 1 < 37) {
  //             event_name_list[event_name_list.length - 1] =
  //               event_name_list[event_name_list.length - 1] + event_names[i].charAt(x)
  //             len = len + 1
  //           } else {
  //             event_name_list.push(event_names[i].charAt(x))
  //             len = 0
  //           }
  //         } else {
  //           if (len + 2 < 37) {
  //             event_name_list[event_name_list.length - 1] =
  //               event_name_list[event_name_list.length - 1] + event_names[i].charAt(x)
  //             len = len + 2
  //           } else {
  //             event_name_list.push(event_names[i].charAt(x))
  //             len = 0
  //           }
  //         }
  //       }
  //     }
  //   }

  //   if (event_name_list.length > 3) {
  //     event_name_list = event_name_list.slice(0, 3)
  //     const width = ctx.measureText(event_name_list[2]).width
  //     if (width < 825) {
  //       event_name_list[2] = event_name_list[2] + '...'
  //     } else {
  //       event_name_list[2] = event_name_list[2].slice(0, -3)
  //       event_name_list[2] = event_name_list[2] + '...'
  //     }
  //   }

  //   let event_name_height = 200
  //   for (let i = 0; i < event_name_list.length; i++) {
  //     ctx.fillText(event_name_list[i], 150, event_name_height, 900)
  //     event_name_height = event_name_height + 80
  //   }
  //   ctx.font = '40px "KosugiMaru"'
  //   ctx.fillText('グッズ代を計算できるWEBアプリ　　GOODS LIST', 150, 500, 900)
  //   // var metrics1 = ctx.measureText('あ')
  //   // var metrics2 = ctx.measureText('お')
  //   // var metrics3 = ctx.measureText('1')
  //   // var metrics4 = ctx.measureText('W')
  //   // var metrics5 = ctx.measureText('s')

  //   // // 横幅を取得する.
  //   // var width1 = metrics1.width
  //   // var width2 = metrics2.width
  //   // var width3 = metrics3.width
  //   // var width4 = metrics4.width
  //   // var width5 = metrics5.width
  //   // ctx.fillText(String(width1), 200, 400)
  //   // ctx.fillText(String(width2), 400, 400)
  //   // ctx.fillText(String(width3), 600, 400)
  //   // ctx.fillText(String(width4), 800, 400)
  //   // ctx.fillText(String(width5), 1000, 400)
  //   // if (event_name) {
  //   //   ctx.fillText(event_name, 10, 30)
  //   // }
  //   // ctx.fillText(text, WIDTH / 2, HEIGHT / 2)
  //   const buffer = canvas.toBuffer()
  //   res.writeHead(200, {
  //     'Content-Type': 'image/png',
  //     'Content-Length': buffer.length,
  //   })
  //   res.end(buffer, 'binary')
  // }

  res.status(200).json({ name: 'Next.js' })
}
export default createOgp

// import type { NextApiRequest, NextApiResponse } from 'next'
// import { createCanvas, registerFont, loadImage } from 'canvas'
// import { supabase } from '../../components/supabase'
// import * as path from 'path'

// const createOgp = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
//   const { event_id } = req.query

//   const { data, error } = await supabase
//     .from('events')
//     .select('event_name, contents(content_name)')
//     .eq('event_id', event_id)

//   const ogp = {
//     content_name: data![0].contents.content_name,
//     event_name: data![0].event_name,
//   }

//   const WIDTH = 1200 as const
//   const HEIGHT = 630 as const
//   const canvas = createCanvas(WIDTH, HEIGHT)
//   const ctx = canvas.getContext('2d')
//   // registerFont(path.resolve('./public/fonts/NotoSansJP-Regular.otf'), {
//   //   family: 'Noto',
//   // })
//   registerFont(path.resolve('./public/fonts/KosugiMaru-Regular.ttf'), { family: 'KosugiMaru' })
//   // ctx.fillStyle = '#FFF'

//   const test =
//     'SANKYO presents マクロスF ギャラクシーライブ 2021［リベンジ］〜まだまだふたりはこれから！私たちの歌を聴け！！'
//   const backgroundImage = await loadImage(path.resolve('./public/images/ogp.png'))
//   ctx.fillRect(0, 0, WIDTH, HEIGHT)
//   ctx.font = '40px "KosugiMaru"'
//   ctx.fillStyle = '#000000'
//   ctx.textAlign = 'left'
//   ctx.textBaseline = 'top'
//   let content_name = ogp.content_name
//   // const content_name = ogp.content_name
//   ctx.drawImage(backgroundImage, 0, 0, WIDTH, HEIGHT)

//   let content_name_len = 0
//   for (let i = 0; i < content_name.length; i++) {
//     if (/^[\x20-\x7e]*$/.test(content_name.charAt(i))) {
//       content_name_len = content_name_len + 1
//     } else {
//       content_name_len = content_name_len + 2
//     }
//   }
//   if (content_name_len > 44) {
//     content_name = content_name.slice(0, -3)
//     content_name = content_name + '...'
//   }
//   ctx.fillText(content_name, 150, 100, 900)
//   ctx.font = '50px "KosugiMaru"'
//   // const event_name = ogp.event_name
//   const event_name = ogp.event_name
//   const event_names = event_name.split(' ')
//   for (let i = 0; i < event_names.length; i++) {
//     if (i < event_names.length - 1) {
//       event_names[i] = event_names[i] + ' '
//     }
//   }

//   let event_name_list = ['']
//   let len = 0
//   for (let i = 0; i < event_names.length; i++) {
//     if (/^[\x20-\x7e]*$/.test(event_names[i])) {
//       if (len + event_names[i].length < 37) {
//         event_name_list[event_name_list.length - 1] =
//           event_name_list[event_name_list.length - 1] + event_names[i]
//         len = len + event_names[i].length
//       } else {
//         event_name_list.push(event_names[i])
//         len = 0
//       }
//     } else {
//       for (let x = 0; x < event_names[i].length; x++) {
//         if (/^[\x20-\x7e]*$/.test(event_names[i].charAt(x))) {
//           if (len + 1 < 37) {
//             event_name_list[event_name_list.length - 1] =
//               event_name_list[event_name_list.length - 1] + event_names[i].charAt(x)
//             len = len + 1
//           } else {
//             event_name_list.push(event_names[i].charAt(x))
//             len = 0
//           }
//         } else {
//           if (len + 2 < 37) {
//             event_name_list[event_name_list.length - 1] =
//               event_name_list[event_name_list.length - 1] + event_names[i].charAt(x)
//             len = len + 2
//           } else {
//             event_name_list.push(event_names[i].charAt(x))
//             len = 0
//           }
//         }
//       }
//     }
//   }

//   if (event_name_list.length > 3) {
//     event_name_list = event_name_list.slice(0, 3)
//     const width = ctx.measureText(event_name_list[2]).width
//     if (width < 825) {
//       event_name_list[2] = event_name_list[2] + '...'
//     } else {
//       event_name_list[2] = event_name_list[2].slice(0, -3)
//       event_name_list[2] = event_name_list[2] + '...'
//     }
//   }

//   let event_name_height = 200
//   for (let i = 0; i < event_name_list.length; i++) {
//     ctx.fillText(event_name_list[i], 150, event_name_height, 900)
//     event_name_height = event_name_height + 80
//   }
//   ctx.font = '40px "KosugiMaru"'
//   ctx.fillText('グッズ代を計算できるWEBアプリ　　GOODS LIST', 150, 500, 900)
//   // var metrics1 = ctx.measureText('あ')
//   // var metrics2 = ctx.measureText('お')
//   // var metrics3 = ctx.measureText('1')
//   // var metrics4 = ctx.measureText('W')
//   // var metrics5 = ctx.measureText('s')

//   // // 横幅を取得する.
//   // var width1 = metrics1.width
//   // var width2 = metrics2.width
//   // var width3 = metrics3.width
//   // var width4 = metrics4.width
//   // var width5 = metrics5.width
//   // ctx.fillText(String(width1), 200, 400)
//   // ctx.fillText(String(width2), 400, 400)
//   // ctx.fillText(String(width3), 600, 400)
//   // ctx.fillText(String(width4), 800, 400)
//   // ctx.fillText(String(width5), 1000, 400)
//   // if (event_name) {
//   //   ctx.fillText(event_name, 10, 30)
//   // }
//   // ctx.fillText(text, WIDTH / 2, HEIGHT / 2)
//   const buffer = canvas.toBuffer()
//   res.writeHead(200, {
//     'Content-Type': 'image/png',
//     'Content-Length': buffer.length,
//   })
//   res.end(buffer, 'binary')
// }

// export default createOgp
