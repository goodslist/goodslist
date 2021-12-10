import styles from '../../styles/MyPage.module.css'
import { dateFormat, numberFormat, timeStampFormat } from '../Utils'
import { MyList } from '../types'
import { useRouter } from 'next/router'
import IconMemo from '../../../public/images/memo.svg'
import IconDelete from '../../../public/images/delete.svg'
import { useState, useContext } from 'react'
import { ModalContext } from '../../components/modal/ModalContext'
import Modal from '../../components/modal/Modal'
import Delete from '../../components/modal/contents/Delete'
import { supabase } from '../../components/supabase'

export default function HaveList(props: any) {
  const router = useRouter()

  const [isOpenDelete, setIsOpenDelete] = useState(false)

  //モーダル関連のコンテキスト
  const { setOpenModalFlag, setModalType, setOpenModalContentFlag, setIsLoading }: any =
    useContext(ModalContext)

  const moveMyList = async (list_id: number, event_id: number) => {
    setLocalStorage(list_id)
    router.push('/event/' + event_id)
  }

  const setLocalStorage = (list_id: number) => {
    props.mylists.map((myList: MyList) => {
      if (myList.list_id == list_id) {
        localStorage.setItem('eventId', String(myList.event_id))
        localStorage.setItem('date', String(myList.date))
        localStorage.setItem('place', String(myList.place))
        localStorage.setItem('memo', String(myList.memo))
        localStorage.setItem('itemCounts', String(myList.item_counts))
      }
    })

    localStorage.setItem('listId', String(list_id))
  }

  //マイリスト上の削除ボタンが押されたら、全てのマイリストの削除ボタンを開閉する。
  const openDeleteBtn = () => {
    if (isOpenDelete) setIsOpenDelete(false)
    else setIsOpenDelete(true)
  }

  //マイリストの削除ボタンが押されたら、モーダルを表示する。
  const openDeleteModal = (list_id: number) => {
    // alert(list_id)
    props.mylists.map((myList: MyList) => {
      if (list_id == myList.list_id) props.setOnDeleteMylist(myList)
    })
    setOpenModalFlag(true)
    setModalType('deleteMylist')
    setOpenModalContentFlag(true)
  }

  //モーダルの削除ボタンが押されたら、そのマイリストを削除する。
  const deleteMylist = async (list_id: number) => {
    console.log('deleteMylist')
    setIsLoading(true)
    await supabase
      .from('lists')
      .delete()
      .match({ list_id: list_id })
      .then((result) => {
        const newMyLists: MyList[] = []
        props.mylists.map((myList: MyList) => {
          if (list_id != myList.list_id) {
            newMyLists.push(myList)
          }
          props.setMylists(newMyLists)
        })
      })
    console.log('deleteMylist2')
  }

  // const deleteMylist = (aaa: number) => {
  //   alert(aaa)
  // }

  return (
    <>
      <div className={styles.wrapper_glay}>
        <main className={styles.main}>
          <div className={styles.sort_arrow_container}>
            <div
              className={isOpenDelete ? styles.btnOpenDeleteActive : styles.btnOpenDelete}
              onClick={() => openDeleteBtn()}
            >
              削除
            </div>
            <div className={styles.sort_container}>
              <button className={styles.sort_nomal_active}>更新順</button>
              <button className={styles.sort_buy}>公演日順</button>
            </div>
          </div>
          <ul className={styles.ul_event}>
            {props.mylists.map((myList: MyList) => (
              <>
                <li className={styles.card2} key={myList.list_id} id={String(myList.list_id)}>
                  <div className={styles.mylistUpdate}>
                    更新：{timeStampFormat(String(myList.updated_at))}
                  </div>
                  <div className={styles.mylistCotentName}>{myList.content_name}</div>
                  <div className={styles.mylistEventName}>{myList.event_name}</div>
                  {/* <div className={styles.mylistDate}>{dateFormat(myList.date)}</div> */}
                  <div className={styles.mylistPlace}>{myList.place}</div>
                  <div className={styles.mylistMemo}>{myList.memo}</div>
                  <hr className={styles.mylistLine} />

                  <div className={styles.mylistBottomContainer}>
                    <p
                      className={styles.mylistEdit}
                      onClick={() => moveMyList(myList.list_id, myList.event_id)}
                    >
                      表示
                      <IconMemo />
                    </p>
                    <div className={styles.totalContainer}>
                      <p className={styles.totalCount}>{myList.total_count}点</p>
                      <div className={styles.totalPrice}>
                        &yen;
                        {numberFormat(myList.total_price)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={isOpenDelete ? styles.deleteContainerActive : styles.deleteContainer}
                  >
                    <p
                      className={styles.btnMylistDelete}
                      onClick={() => openDeleteModal(myList.list_id)}
                    >
                      削除
                    </p>
                  </div>
                </li>
              </>
            ))}
          </ul>
        </main>
      </div>
      <Modal onDeleteMylist={props.onDeleteMylist} deleteMylist={deleteMylist} />
    </>
  )
}
