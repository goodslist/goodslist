import type { NextApiRequest as Req, NextApiResponse as Res } from 'next'
import axios from 'axios'

export default async function recaptcha(req: Req, res: Res) {
  // "POST"以外は、"404 Not Found"を返す
  if (req.method !== 'POST') return res.status(404).send('Not Found')

  const token = req.body.token

  // await axios
  //   .get(
  //     `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PUBLIC_RECAPTCHA_SECRETKEY}&response=${token}`,
  //   )
  //   .then((result) => {
  //     console.log(result.data)
  //     res.send(JSON.stringify({ status: result }))
  //   })
  //   .catch(() => {
  //     res.send(JSON.stringify({ status: 'エラー' }))
  //   })

  await axios({
    method: 'post',
    url: 'https://www.google.com/recaptcha/api/siteverify',
    params: {
      secret: '6LdOJjQeAAAAABN76BZSuFRuYNA-jdL7TBkHJChO',
      response: token,
    },
  })
    .then((result) => {
      res.send(JSON.stringify({ status: '成功', data: result.data }))
    })
    .catch(() => {
      res.send(JSON.stringify({ status: 'エラー' }))
    })

  res.send(JSON.stringify({ status: '終わり' }))
}

// const photo = (JSON.parse(req.body).photo || '').toString()
// セッションIDをCookieに設定する
// setCookie({ res }, 'session', sessionCookie, options)
// setCookie({ res }, 'photo', photo, options)
