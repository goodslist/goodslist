import styles from '../../../styles/modal.module.css'
import InputText from '../../form/InputText'

const Place = (props: any) => {
  return (
    <>
      <div className={styles.title}>会場名を入力</div>
      <div className={styles.modal_space}></div>
      <InputText
        // valid={validName}
        name='place'
        type='text'
        placeholder='会場名'
        value={props.place}
        onChange={props.onChange}
        error={props.errorPlace}
      />
      <button className={styles.button} onClick={props.close}>
        決定
      </button>
    </>
  )
}

export default Place
