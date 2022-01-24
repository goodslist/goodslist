import styles from '../../styles/components/form.module.css'

const InputText = (props: any) => {
  return (
    <>
      <input
        className={props.valid ? styles.input_text_validated : styles.input_text}
        type={props.type}
        id={props.id}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
      <div
        className={String(props.error).length > 0 ? styles.input_error_active : styles.input_error}
      >
        {props.error}
      </div>
    </>
  )
}

export default InputText
