import styles from '../../styles/components/form.module.css'

const InputError = (props: any) => {
  return <div className={styles.input_error}>{props.error}</div>
}

export default InputError
