import styles from '../../styles/components/form.module.css'

const InputLabel = (props: any) => {
  return <label className={styles.input_label}>{props.label}</label>
}

export default InputLabel
