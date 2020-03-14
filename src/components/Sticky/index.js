import React, { Component } from 'react'

import Types from 'prop-types'

import styles from './index.module.scss'

class Sticky extends Component {
  // 创建 占位元素 的ref
  placeholderRef = React.createRef()
  // 创建 内容 的ref
  contentRef = React.createRef()

  handleScroll = () => {
    // 占位元素的DOM对象
    const placeholderDOM = this.placeholderRef.current
    // 内容的DOM对象
    const contentDOM = this.contentRef.current
    const { height } = this.props

    const { top } = placeholderDOM.getBoundingClientRect()
    // console.log('占位元素DOM对象的距离视口顶部的高度', top)
    if (top <= 0) {
      // 吸顶
      contentDOM.classList.add(styles.fixed)
      // 占位元素撑起高度
      placeholderDOM.style.height = `${height}px`
    } else {
      // 取消吸顶，恢复默认情况
      contentDOM.classList.remove(styles.fixed)
      // 占位元素高度重置为0
      placeholderDOM.style.height = '0px'
    }
  }

  componentDidMount() {
    // 监听浏览器滚动事件
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    // 取消监听
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return (
      <>
        {/* 占位元素 */}
        <div ref={this.placeholderRef} />

        {/* 内容 */}
        <div ref={this.contentRef}>{this.props.children}</div>
      </>
    )
  }
}

// 添加属性校验
Sticky.propTypes = {
  height: Types.number.isRequired
}

export default Sticky
