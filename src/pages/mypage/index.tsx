import type { GetServerSideProps, NextPage } from 'next'
import nookies from 'nookies'
import { useRouter } from 'next/router'
import { logout } from '../../components/firebase'
import { firebaseAdmin } from '../../components/firebaseAdmin'
import { AuthContext } from '../../components/auth/AuthContext'
import { useContext } from 'react'
import Title from '../../components/view/title'
import { supabase } from '../../components/supabase'
import { EventInfo, Group, Item, ItemCount } from '../../components/types/event'
import styles from '../../styles/MyPage.module.css'
import { numberFormat, dateFormat } from '../../components/Utils'
import HaveList from '../../components/mypage/HaveList'
import NolList from '../../components/mypage/NoList'
import { MyList } from '../../components/types/event'

// ページコンポーネントに渡されるデータ
type Props = {
  myLists: MyList[]
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

  const { data, error } = await supabase
    .from('lists')
    .select(
      'list_id, date, place, memo, item_counts, total_price, total_count, updated_at, events(event_id, event_name, contents(content_id, content_name))',
    )
    .eq('user_id', user.uid)
  const myLists: MyList[] = []
  data?.map((doc) => {
    const data: MyList = {
      list_id: doc.list_id,
      content_id: doc.events.contents.content_id,
      content_name: doc.events.contents.content_name,
      event_id: doc.events.event_id,
      event_name: doc.events.event_name,
      date: doc.date,
      place: doc.place,
      memo: doc.memo,
      item_counts: doc.item_counts,
      total_price: doc.total_price,
      total_count: doc.total_count,
      updated_at: doc.updated_at,
    }
    myLists.push(data)
  })

  // const { data, error } = await supabase.from('lists').select('list_id')
  // const { data, error } = await supabase.from('items').select('item_id, item_name')

  // この props プロパティの値がページコンポーネントに渡される
  return { props: { myLists } }
}

// ページコンポーネントの実装
const Home = ({ myLists }: Props) => {
  const { setCurrentUser }: any = useContext(AuthContext)
  const router = useRouter()
  console.log('aaa')

  const onLogout = async () => {
    await logout() // ログアウトさせる
    router.push('/login') // ログインページへ遷移させる
    setCurrentUser(undefined)
  }

  return (
    <>
      <Title title='マイページ' />
      <div>
        <h1>Dashboard Pages</h1>

        <button onClick={onLogout}>Logout</button>
      </div>
      {myLists[0] ? <HaveList myLists={myLists} /> : <NolList />}
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
