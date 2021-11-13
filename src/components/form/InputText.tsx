import styles from '../../styles/Form.module.css'

const InputText = (props: any) => {
  return (
    <>
      <input
        className={props.valid ? styles.input_text_validated : styles.input_text}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
      <div className={styles.input_error}>{props.error}</div>
    </>
  )
}

export default InputText
