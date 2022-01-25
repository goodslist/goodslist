import type { NextApiRequest as Req, NextApiResponse as Res } from 'next'
import axios from 'axios'

export default async function recaptcha(req: Req, res: Res) {
  // "POST"以外は、"404 Not Found"を返す
  if (req.method !== 'POST') return res.status(404).send('Not Found')

  const token = req.body.token

  let params = new URLSearchParams()

  params.append('secret', String(process.env.NEXT_PUBLIC_RECAPTCHA_SECRETKEY))

  params.append('response', token)

  await axios
    .post('https://www.google.com/recaptcha/api/siteverify', params)
    .then((result) => {
      res.send(JSON.stringify({ status: 'success', data: result.data }))
    })
    .catch(() => {
      res.send(JSON.stringify({ status: 'error' }))
    })
}

// await axios
//   .post(
//     `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PUBLIC_RECAPTCHA_SECRETKEY}&response=${token}`,
//   )
//   .then((result) => {
//     console.log(result.data)
//     res.send(JSON.stringify({ status: '成功', data: result.data }))
//   })
//   .catch(() => {
//     res.send(JSON.stringify({ status: 'エラー' }))
//   })

// await axios({
//   method: 'post',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//   },
//   url: 'https://www.google.com/recaptcha/api/siteverify',
//   params: {
//     secret: process.env.NEXT_PUBLIC_RECAPTCHA_SECRETKEY,
//     response: token,
//   },
// })
//   .then((result) => {
//     res.send(JSON.stringify({ status: '成功', data: result.data }))
//   })
//   .catch(() => {
//     res.send(JSON.stringify({ status: 'エラー2' }))
//   })

//   await fetch('https://www.google.com/recaptcha/api/siteverify', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: new URLSearchParams({
//       secret: '6LccjjUeAAAAAO1GxRTUqPM9WB9TeYYoWIQJzkNQ', // シークレット
//       response: token, // トークン
//     }),
//   })
//     .then((result) => {
//       res.send(JSON.stringify({ status: '成功', data: result }))
//     })
//     .catch(() => {
//       res.send(JSON.stringify({ status: 'エラーなのだ' }))
//     })
//   res.send(JSON.stringify({ status: '終わり' }))
// }

// const photo = (JSON.parse(req.body).photo || '').toString()
// セッションIDをCookieに設定する
// setCookie({ res }, 'session', sessionCookie, options)
// setCookie({ res }, 'photo', photo, options)
