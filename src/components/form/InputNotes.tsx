import styles from '../../styles/components/form.module.css'

const InputNotes = (props: any) => {
  return <div className={styles.input_notes}>{props.notes}</div>
}

export default InputNotes
