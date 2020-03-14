import React, { Component } from 'react'

import classnames from 'classnames'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    // 选中值数组
    selectedValues: this.props.selected
  }

  // 处理标签单击事件
  handleClick = id => {
    // console.log('id', id)
    const { selectedValues } = this.state

    let newSelectedValues
    if (selectedValues.indexOf(id) > -1) {
      // 包含
      // console.log('包含')
      // selectedValues 数组中存储的是 id，所以，item 就是 选中项的id
      newSelectedValues = selectedValues.filter(item => item !== id)
    } else {
      // 不包含
      // console.log('不包含')
      newSelectedValues = [...selectedValues, id]
    }

    this.setState({
      selectedValues: newSelectedValues
    })
  }

  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    // console.log('标签数据：', data)
    return data.map(item => {
      // 如果该项被选中，那么，当前菜单就高亮
      const isSelected = this.state.selectedValues.indexOf(item.value) > -1
      return (
        <span
          key={item.value}
          className={classnames(styles.tag, {
            [styles.tagActive]: isSelected
          })}
          onClick={() => this.handleClick(item.value)}
        >
          {item.label}
        </span>
      )
    })
  }

  render() {
    // console.log('FilterMore 接收到数据为：', this.props)
    const {
      data: { roomType, oriented, floor, characteristic },
      onCancel
    } = this.props

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        {/* <div className={styles.mask} onClick={() => onCancel()} /> */}
        <div className={styles.mask} onClick={onCancel} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText="清除"
          onCancel={() =>
            this.setState({
              selectedValues: []
            })
          }
          onOk={() => this.props.onSave(this.state.selectedValues)}
        />
      </div>
    )
  }
}
