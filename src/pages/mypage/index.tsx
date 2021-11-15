import type { GetServerSideProps, NextPage } from 'next'
import nookies from 'nookies'
import { useRouter } from 'next/router'
import { logout } from '../../components/firebase' // 上記で実装したファイル
import { firebaseAdmin } from '../../components/firebaseAdmin' // この後に実装するファイル
import { AuthContext } from '../../components/auth/AuthContext'
import { useContext } from 'react'
import Title from '../../components/view/title'

const DashboardPage: NextPage<{ email: string }> = ({ email }) => {
  const { setUser }: any = useContext(AuthContext)
  const router = useRouter()

  const onLogout = async () => {
    await logout() // ログアウトさせる
    router.push('/login') // ログインページへ遷移させる
    setUser(undefined)
  }

  return (
    <>
      <Title title='マイページ' />
      <div>
        <h1>Dashboard Pages</h1>

        <h2>email: {email}</h2>

        <button onClick={onLogout}>Logout</button>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx)
  const session = cookies.session || ''

  // セッションIDを検証して、認証情報を取得する
  const user = await firebaseAdmin
    .auth()
    .verifySessionCookie(session, true)
    .catch(() => null)

  // 認証情報が無い場合は、ログイン画面へ遷移させる
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      email: user.email,
    },
  }
}

export default DashboardPage
