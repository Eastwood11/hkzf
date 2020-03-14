import React from 'react'

import { Flex } from 'antd-mobile'

import Types from 'prop-types'

import { withRouter } from 'react-router-dom'

import classnames from 'classnames'

import styles from './index.module.scss'

function SearchHeader(props) {
  return (
    <Flex
      className={classnames(styles.navHeader, {
        [props.className]: !!props.className
      })}
    >
      {/* 左边 */}
      <Flex className={styles.navHeaderLeft}>
        {/* 左侧的定位 */}
        <div
          className={styles.location}
          onClick={() => props.history.push('/citylist')}
        >
          <span>{props.cityName}</span>
          <i className="iconfont icon-arrow"></i>
        </div>

        {/* 右侧表单 */}
        <div className={styles.form}>
          <i className="iconfont icon-seach"></i>
          <span>请输入小区或地址</span>
        </div>
      </Flex>
      {/* 右边图标 */}
      <i
        className="iconfont icon-map"
        onClick={() => props.history.push('/map')}
      ></i>
    </Flex>
  )
}

// props 校验
SearchHeader.propTypes = {
  cityName: Types.string.isRequired,
  className: Types.string
}

export default withRouter(SearchHeader)
