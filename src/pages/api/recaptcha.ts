import type { NextApiRequest as Req, NextApiResponse as Res } from 'next'
import axios from 'axios'

export default async function recaptcha(req: Req, res: Res) {
  //POST以外は404 Not Foundを返す
  if (req.method !== 'POST') return res.status(404).send('Not Found')

  const token = req.body.token

  let params = new URLSearchParams()

  params.append('secret', String(process.env.NEXT_PUBLIC_RECAPTCHA_SECRETKEY))

  params.append('response', token)

  await axios
    .post('https://www.google.com/recaptcha/api/siteverify', params)
    .then(() => {
      res.send(JSON.stringify({ status: 'success' }))
    })
    .catch(() => {
      res.send(JSON.stringify({ status: 'error' }))
    })
}
