import { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  res.json({ message: 'something wrong !' })
}
