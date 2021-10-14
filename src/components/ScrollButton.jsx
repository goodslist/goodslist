import React from 'react'
import { animateScroll as scroll } from 'react-scroll' //import

class ScrollButton extends React.Component {
  // scrollToTopの実装
  scrollToTop = () => {
    scroll.scrollToTop()
  }

  render() {
    return <button onClick={this.scrollToTop}>Click</button>
  }
}
export default ScrollButton
