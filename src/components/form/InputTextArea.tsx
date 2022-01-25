import styles from '../../styles/components/form.module.css'

const InputTextArea = (props: any) => {
  return (
    <textarea
      className={props.valid ? styles.input_TextArea_validated : styles.input_TextArea}
      id={props.id}
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e.target.value)}
    />
  )
}

export default InputTextArea
