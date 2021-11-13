import Email from '../../../public/images/email.svg'
import Check from '../../../public/images/check.svg'
import BtnSpinner from '../Spinner'
import styles from '../../styles/Form.module.css'

const SubmitButton = (props: any) => {
  let svg
  if (props.type == 'email') {
    svg = <Email />
  } else {
    svg = <Check />
  }

  return (
    <>
      <button
        className={props.isSubmit ? styles.btn_submit_active : styles.btn_submit}
        onClick={() => props.onClick()}
      >
        {props.title}
        <span className={styles.btn_svg_container}>{svg}</span>
        <div className={props.isButtonLoading ? styles.btn_spinner_active : styles.btn_spinner}>
          <BtnSpinner />
        </div>
      </button>
      <div className={styles.input_error}>{props.error}</div>
    </>
  )
}

export default SubmitButton
