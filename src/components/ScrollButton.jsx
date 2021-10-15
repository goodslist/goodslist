import React from 'react'
import { animateScroll as scroll } from 'react-scroll'
import styles from '../styles/ScrollButton.module.css'

class ScrollButton extends React.Component {
  // scrollToTopの実装
  scrollToTop = () => {
    scroll.scrollToTop()
  }

  render() {
    return <div className={styles.button_scroll_active} onClick={this.scrollToTop}></div>
  }
}
export default ScrollButton
