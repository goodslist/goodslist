import styles from '../../../styles/Modal.module.css'
import InputText from '../../form/InputText'
import ModalButton from './ModalButton'
import { useState, useContext } from 'react'
import { ModalContext } from '../ModalContext'

const Place = (props: any) => {
  const [place, setPlace] = useState<string>(props.place)

  const { setModalType }: any = useContext(ModalContext)

  //エンターが押下されたら、メモを更新して閉じる。
  const updatePlace = () => {
    props.onChangePlace(place)
    props.onClickClose()
    setModalType('blank')
  }

  return (
    <>
      <div className={styles.title}>会場名を入力</div>
      {props.text}
      <div className={styles.textCount}>
        <span className={place.length < 30 ? styles.nomal : styles.error}>{place.length}</span> / 30
      </div>
      <InputText name='place' type='text' placeholder='会場名' value={place} onChange={setPlace} />
      <ModalButton
        onClickClose={props.onClickClose}
        btn_text={props.btn_text}
        onClickEnter={updatePlace}
      />
    </>
  )
}

export default Place
