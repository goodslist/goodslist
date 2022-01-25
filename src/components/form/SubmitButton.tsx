import styles from '../../styles/components/form.module.css'
import Email from '../../../public/images/email.svg'
import Check from '../../../public/images/check.svg'

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
        {props.btn_name}
        {svg}
      </button>
      <div className={styles.input_error}>{props.error}</div>
    </>
  )
}

export default SubmitButton

// import styles from '../../styles/components/form.module.css'
// import Email from '../../../public/images/email.svg'
// import Check from '../../../public/images/check.svg'

// const SubmitButton = (props: any) => {
//   let svg
//   if (props.type == 'email') {
//     svg = <Email />
//   } else {
//     svg = <Check />
//   }

//   return (
//     <>
//       <button
//         className={props.isSubmit ? styles.btn_submit_active : styles.btn_submit}
//         onClick={() => props.onClick()}
//       >
//         {props.btn_name}
//         {svg}
//       </button>
//       <div className={styles.input_error}>{props.error}</div>
//     </>
//   )
// }

// export default SubmitButton
