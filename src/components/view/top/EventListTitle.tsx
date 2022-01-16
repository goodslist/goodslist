import styles from '../../../styles/Home.module.css'

const EventListTitle = (props: any) => {
  return (
    <p className={styles.label_hot_new}>
      <span>{props.title}</span>
    </p>
  )
}

export default EventListTitle
