import styles from '../../styles/components/form.module.css'

const InputNotes = (props: any) => {
  return (
    <p className={styles.input_notes}>
      {props.legnth > props.limit ? (
        <span className={styles.input_notes_over}>{props.legnth}</span>
      ) : (
        <span>{props.legnth}</span>
      )}{' '}
      / {props.limit}
    </p>
  )
}

export default InputNotes
