import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../components/supabase'
import cookie from 'cookie'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  //POST以外は404を返す
  if (req.method !== 'POST') return res.status(404).send('Not Found')

  const validSignedUp = async () => {
    // const email = 'tnvzk679@yahoo.co.jp'
    const { data, error } = await supabase.from('events').select('event_name').eq('event_id', 2)

    res.json({ message: 'something wronga !', data: data })
  }
  validSignedUp()
}
