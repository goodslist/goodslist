import styles from '../../../styles/Modal.module.css'
import InputText from '../../form/InputText'
import ModalButton from './ModalButton'
import { useState } from 'react'

const Place = (props: any) => {
  // const [place, setPlace] = useState(props.place)

  // //エンターが押下されたら、メモを更新して閉じる。
  // const updatePlace = () => {
  //   props.onChangePlace(place)
  //   props.onClickClose()
  // }

  return (
    <>
      <div className={styles.title}>会場名を入力</div>
      <div className={styles.textCount}>
        <span className={props.place.length < 30 ? styles.nomal : styles.error}>
          {props.place.length}
        </span>{' '}
        / 30
      </div>
      {/* <InputText name='place' type='text' placeholder='会場名' value={place} onChange={setPlace} />
      <ModalButton
        onClickClose={props.onClickClose}
        btn_text={props.btn_text}
        onClickEnter={updatePlace}
      /> */}
    </>
  )
}

export default Place
