import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../components/supabase'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  //POST以外は404を返す
  // if (req.method !== 'POST') return res.status(404).send('Not Found')

  // const email = 'tnvzk679@yahoo.co.jp'
  // const { data, error } = await supabase.from('events').select('event_name').eq('event_id', 2)

  const email = req.body.email
  const password = req.body.password
  const { error, data } = await supabase.auth.signIn({ email, password })

  let errorMessage = ''
  if (data) {
  } else if (error) {
    if (error.message == 'Invalid login credentials') {
      errorMessage = 'メールアドレスまたはパスワードが間違っています。'
    } else {
      errorMessage = 'エラーが発生しました。しばらく経ってからもう一度お試しください。'
    }
  } else {
    res.json({ error: 'エラーが発生しました。しばらく経ってからもう一度お試しください。' })
  }

  // if (data) setUser(data.user)
  // res.json({ error: errorMessage, data: data })
}
