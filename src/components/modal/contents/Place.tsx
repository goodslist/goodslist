import styles from '../../../styles/Modal.module.css'
import InputText from '../../form/InputText'

const Place = (props: any) => {
  return (
    <>
      <div className={styles.title}>会場名を入力</div>
      <div className={styles.textCount}>
        <span className={props.place.length < 30 ? styles.nomal : styles.error}>
          {props.place.length}
        </span>{' '}
        / 30
      </div>
      <InputText
        name='place'
        type='text'
        placeholder='会場名'
        value={props.place}
        onChange={props.onChange}
      />
      <button className={styles.button} onClick={props.close}>
        決定
      </button>
    </>
  )
}

export default Place
