import styles from '../../styles/components/form.module.css'

const InputLabel = (props: any) => {
  return <div className={styles.input_label}>{props.label}</div>
}

export default InputLabel
