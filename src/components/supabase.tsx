import { createClient } from '@supabase/supabase-js'

// 環境変数のロード
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY

// // URLの環境変数が設定されていなかったらエラー
// if (!SUPABASE_URL) {
//   throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
// }
// // KEYの環境変数が設定されていなかったらエラー

// if (!SUPABASE_KEY) {
//   throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_KEY')
// }

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
