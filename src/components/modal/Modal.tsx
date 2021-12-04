import { useEffect, useState, useContext } from 'react'
import ClientOnlyPortal from './ClientOnlyPortal'
import styles from '../../styles/Modal.module.css'
import { ModalContext } from './ModalContext'
import Place from './contents/Place'
import Memo from './contents/Memo'
import Reset from './contents/Reset'
import Delete from './contents/Delete'
import NotLogin from './contents/NotLogin'
import Message from './contents/Message'

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
        return <Place place={props.place} onChange={props.onChangePlace} close={onClickClose} />
      case 'memo':
        return <Memo memo={props.memo} onChange={props.onChangeMemo} close={onClickClose} />
      case 'reset':
        return <Reset reset={props.reset} />
      case 'deleteMylist':
        return <Delete onDeleteMylist={props.onDeleteMylist} deleteMylist={props.deleteMylist} />

      case 'notLogin':
        return <NotLogin />
      case 'save':
        return <Message message='セーブしました' />
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
