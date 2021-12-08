import React from 'react'
import styles from '../styles/ScrollButton.module.css'
import 'scroll-behavior-polyfill'
import { useState, useEffect } from 'react'

class ScrollButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scroll_css: styles.button_scroll_active,
    }
  }

  // scrollToTopの実装
  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  render() {
    return (
      <div className={styles.scrollContainer}>
        ああ
        <div className={this.state.scroll_css} onClick={this.scrollToTop}></div>
      </div>
    )
  }
}
export default ScrollButton
