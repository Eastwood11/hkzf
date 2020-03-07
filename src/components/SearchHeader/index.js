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
      <Flex className={styles.navHeaderLeft}>
        <div
          className={styles.location}
          onClick={() => props.history.push('/citylist')}
        >
          <span>{props.cityName}</span>
          <i className="iconfont icon-arrow"></i>
        </div>
        <div className={styles.form}>
          <i className="iconfont icon-seach"></i>
          <span>请输入小区或地址</span>
        </div>
      </Flex>
      <i
        className="iconfont icon-map"
        onClick={() => props.history.push('/map')}
      ></i>
    </Flex>
  )
}
SearchHeader.propTypes = {
  cityName: Types.string.isRequired,
  className: Types.string
}
export default withRouter(SearchHeader)
