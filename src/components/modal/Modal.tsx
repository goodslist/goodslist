import { useEffect, useState, useContext } from 'react'
import ClientOnlyPortal from './ClientOnlyPortal'
import styles from '../../styles/Modal.module.css'
import { ModalContext } from './ModalContext'
import Place from './contents/Place'
import Memo from './contents/Memo'
import Reset from './contents/Reset'
import Date from './contents/Date'
import Message from './contents/Message'
import Confirmation from './contents/Confirmation'

export default function Modal(props: any) {
  const [open, setOpen] = useState(true)
  const [content, setContent] = useState<JSX.Element>(<></>)
  const {
    openModalFlag,
    setOpenModalFlag,
    modalType,
    openModalContentFlag,
    setOpenModalContentFlag,
    showLogin,
    setShowLogin,
  }: any = useContext(ModalContext)

  //CLOSEボタン、overrayをクリックするとモーダルを閉じる
  const onClickClose = () => {
    setOpenModalFlag(false)
    setOpenModalContentFlag(false)
  }

  //モーダルウインドウの領域をクリックした時にオーバーレイの閉じるが発火しないための処理
  const clickModalContent = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
  }
  const renderModalContent = () => {
    switch (modalType) {
      case 'place':
        return (
          <Place
          // place={props.place}
          // btn_text='決定'
          // onChangePlace={props.onChangePlace}
          // onClickClose={onClickClose}
          />
        )
      // case 'memo':
      //   return (
      //     <Memo
      //       memo={props.memo}
      //       btn_text='決定'
      //       onChangeMemo={props.onChangeMemo}
      //       onClickClose={onClickClose}
      //     />
      //   )
      // case 'reset':
      //   return (
      //     <Confirmation
      //       title='リセットしますか？'
      //       text='購入数、並び順、入力欄の開閉'
      //       btn_text='リセット'
      //       onClickClose={onClickClose}
      //       onClickEnter={props.onClick}
      //     />
      //   )
      // case 'date':
      //   return (
      //     <Date
      //       date={props.date}
      //       setDate={props.setDate}
      //       btn_text='決定'
      //       onClickClose={onClickClose}
      //     />
      //   )
      case 'save':
        return <Message message='セーブしました' />
      case 'copy':
        return <Message message='コピーしました' />
    }
  }
  return (
    <>
      {open && (
        <ClientOnlyPortal selector='#modal'>
          <div
            className={openModalFlag ? styles.overlay_active : styles.overlay}
            onClick={() => onClickClose()}
          >
            <div
              className={
                openModalContentFlag ? styles.modal_container_active : styles.modal_container
              }
              onClick={clickModalContent}
            >
              {/* <div className={styles.close_button_container}> */}
              <span className={styles.close_button} onClick={() => onClickClose()}></span>
              {/* </div> */}
              <div className={styles.modal_content}>{renderModalContent()}</div>
            </div>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  )
}
