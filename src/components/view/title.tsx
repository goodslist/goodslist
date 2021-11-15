import styles from '../../styles/components/view.module.css'

const Title = (props: any) => {
  return (
    <div className={styles.content_title}>
      {props.title}
      <span />
    </div>
  )
}

export default Title
