import styles from '../../styles/components/form.module.css'

const InputError = (props: any) => {
  return (
    <p className={String(props.error).length > 0 ? styles.input_error_active : styles.input_error}>
      {props.error}
    </p>
  )
}

export default InputError
