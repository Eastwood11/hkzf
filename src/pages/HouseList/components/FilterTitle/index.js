import React from 'react'

import { Flex } from 'antd-mobile'

import classnames from 'classnames'

import styles from './index.module.css'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

export default function FilterTitle(props) {
  return (
    <Flex align="center" className={styles.root}>
      {titleList.map(item => {
        // console.log('每一个菜单的type：', item.type, props.selected[item.type])
        // 每个菜单是否选中的状态，是一个布尔值
        const isSelected = props.selected[item.type]

        // props.onClick 就是父组件中传递给该子组件的回调函数
        return (
          <Flex.Item key={item.type} onClick={() => props.onClick(item.type)}>
            {/* 选中类名： selected */}
            <span
              className={classnames(styles.dropdown, {
                [styles.selected]: isSelected
              })}
            >
              <span>{item.title}</span>
              <i className="iconfont icon-arrow" />
            </span>
          </Flex.Item>
        )
      })}
    </Flex>
  )
}
