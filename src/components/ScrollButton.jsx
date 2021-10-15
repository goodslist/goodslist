import React from 'react'
import { animateScroll as scroll } from 'react-scroll'
import styles from '../styles/ScrollButton.module.css'

class ScrollButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scroll_css: styles.button_scroll_active,
    }
  }
  // scrollToTopの実装
  scrollToTop = () => {
    scroll.scrollToTop()
  }

  render() {
    return <div className={this.state.scroll_css} onClick={this.scrollToTop}></div>
  }
}
export default ScrollButton
