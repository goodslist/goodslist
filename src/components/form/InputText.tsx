import styles from '../../styles/components/form.module.css'

const InputText = (props: any) => {
  return (
    <>
      <input
        className={props.valid ? styles.input_text_validated : styles.input_text}
        type={props.type}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
      <div className={styles.input_error}>{props.error}</div>
    </>
  )
}

export default InputText
