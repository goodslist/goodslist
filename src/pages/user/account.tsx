import type { GetServerSideProps, NextPage } from 'next'
import nookies from 'nookies'
import { useRouter } from 'next/router'
import { logout } from '../../components/firebase'
import { firebaseAdmin } from '../../components/firebaseAdmin'
import { AuthContext } from '../../components/auth/AuthContext'
import { useState, useContext, useEffect } from 'react'
import Title from '../../components/view/title'
import { supabase } from '../../components/supabase'
import { User } from '../../components/types'
import styles from '../../styles/MyPage.module.css'
import { numberFormat, dateFormat } from '../../components/Utils'
import HaveList from '../../components/mypage/HaveList'
import NolList from '../../components/mypage/NoList'
import { ModalContext } from '../../components/modal/ModalContext'
import Modal from '../../components/modal/Modal'
import { useStaticState } from '@material-ui/pickers'
import Link from 'next/link'

// ページコンポーネントに渡されるデータ
type Props = {
  user: User
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx)
  const session = cookies.session || ''

  // セッションIDを検証して、認証情報を取得する
  const firebaseAuthUser = await firebaseAdmin
    .auth()
    .verifySessionCookie(session, true)
    .catch(() => null)

  // 認証情報が無い場合は、ログイン画面へ遷移させる
  if (!firebaseAuthUser) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const { data, error } = await supabase
    .from('users')
    .select('user_id, user_name, provider, provider_id, photo, signedup')
    .eq('user_id', firebaseAuthUser.uid)
  const user: User = {
    user_id: data![0].user_id,
    user_name: data![0].user_name,
    provider: data![0].provider,
    provider_id: data![0].provider_id,
    photo: data![0].photo,
    signedup: data![0].signedup,
  }
  // const { data, error } = await supabase.from('lists').select('list_id')
  // const { data, error } = await supabase.from('items').select('item_id, item_name')

  // この props プロパティの値がページコンポーネントに渡される
  return { props: { user } }
}

// ページコンポーネントの実装
const Home = ({ user }: Props) => {
  const { currentUser, setCurrentUser }: any = useContext(AuthContext)
  const [user_name, setUser_name] = useState(user.user_name)

  const router = useRouter()

  //モーダル関連のコンテキスト
  const { setOpenModalFlag, setModalType, setOpenModalContentFlag, setIsLoading }: any =
    useContext(ModalContext)

  console.log('aaa')

  const onLogout = async () => {
    await logout() // ログアウトさせる
    setCurrentUser(undefined)
    router.push('/login') // ログインページへ遷移させる
  }

  useEffect(() => {}, [])

  return (
    <>
      <div className={styles.wrapper_white}>
        <main className={styles.main}>
          <Title title='マイページアカウント' />
          <div className={styles.mypageBtnContainer}>
            <Link href={'/user/mylist'}>
              <a>
                <button className={styles.btnMylist}>マイリスト</button>
              </a>
            </Link>
            <button className={styles.btnAccount}>アカウント</button>
          </div>
          <div></div>
        </main>
      </div>
      <>
        <div className={styles.wrapper_glay}>
          <main className={styles.main}>
            <div className={styles.grid}>
              <div className={styles.card2}>
                ユーザー名：{user_name}
                <br />
                SNSアカウント種別：{user.provider}
                <br />
                SNSアカウントID：{user.provider_id}
                <br />
                <button onClick={onLogout}>Logout</button>
              </div>
            </div>
          </main>
        </div>
        <Modal />
      </>
      {/* <div className={styles.wrapper_glay}>
        <main className={styles.main}>
          <div className={styles.grid}>
            <ul className={styles.ul_event}>
              {myLists.map((myList: MyList) => (
                <>
                  <li
                    className={styles.card2}
                    key={myList.list_id}
                    id={String(myList.list_id)}
                    onClick={() => moveMyList(myList.list_id, myList.event_id)}
                  >
                    <div className={styles.goods_name}>{myList.updated_at}</div>
                    <div className={styles.goods_name}>{myList.content_name}</div>
                    <div className={styles.goods_name}>{myList.event_name}</div>
                    <div className={styles.goods_name}>{dateFormat(myList.date)}</div>
                    <div className={styles.goods_name}>{myList.place}</div>
                    <div className={styles.goods_name}>{myList.memo}</div>
                    <div className={styles.subtotalcontainer}>
                      <div className={styles.subtotalwrap}>
                        <div className={styles.subtotalCount}>{myList.total_count}点</div>
                        <div className={styles.subtotal}>
                          &yen;
                          {numberFormat(myList.total_price)}
                        </div>
                      </div>
                    </div>
                  </li>
                </>
              ))}
            </ul>
          </div>
        </main>
      </div> */}
    </>
  )
}

export default Home
