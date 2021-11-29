import styles from '../../../styles/modal.module.css'
import { useRouter } from 'next/router'
import { ModalContext } from '../ModalContext'
import { useContext } from 'react'

const NotLogin = (props: any) => {
  const { setOpenModalFlag, setOpenModalContentFlag }: any = useContext(ModalContext)
  const router = useRouter()

  //ログインが必要な機能の場合、ログインページへ飛ばす
  const login = () => {
    router.push('/login')
    setOpenModalFlag(false)
    setOpenModalContentFlag(false)
  }

  return (
    <>
      <div className={styles.title}>この機能はログインが必要です。</div>
      <div className={styles.text}>ログインすると全ての機能を利用できます。</div>
      <div className={styles.modal_space}></div>
      <button className={styles.link} onClick={() => login()}>
        ログイン / 新規登録
      </button>
    </>
  )
}

export default NotLogin
