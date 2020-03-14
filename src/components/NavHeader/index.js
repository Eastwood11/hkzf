import React from 'react'

import { NavBar } from 'antd-mobile'

// 导入路由的高阶组件
import { withRouter } from 'react-router-dom'

// 导入属性校验的包
import Types from 'prop-types'

// 导入处理类名的包
import cls from 'classnames'

import styles from './index.module.scss'

function NavHeader(props) {
  // 组装类名
  const classes = cls(styles.navHeader, {
    [props.className]: !!props.className
  })

  return (
    <NavBar
      className={classes}
      mode="light"
      icon={<i className="iconfont icon-back" />}
      onLeftClick={() => props.history.go(-1)}
    >
      {props.children}
    </NavBar>
  )
}

// 添加属性校验
NavHeader.propTypes = {
  // 约定 children ： 字符串类型，并且是必填项
  children: Types.string.isRequired
}

// 注意： 此处导出的应该是高阶组件包装后的组件
export default withRouter(NavHeader)
