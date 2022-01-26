import styles from '../styles/ScrollButton.module.css'
import { Link as Scroll } from 'react-scroll'

const ScrollTopButton = (props: any) => {
  return (
    <div className={styles.scrollContainer}>
      <Scroll
        to='top'
        smooth={true}
        duration={400}
        className={styles.button_scroll_active}
      ></Scroll>
    </div>
  )
}

export default ScrollTopButton
