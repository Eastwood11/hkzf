import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  state = {
    // 用来存储 PickerView 组件选中值
    value: this.props.selected
  }

  // constructor(props) {
  //   super(props)
  //   console.log('FilterPicker constructor 挂载了')
  // }

  // 获取选中值
  // 参数： 就是当前选中值，是一个数组
  handleChange = value => {
    this.setState({
      value
    })
  }

  render() {
    // console.log('FilterPicker 组件接收到 data 为：', this.props)
    const { data, rows } = this.props

    return (
      <>
        {/* 选择器组件： */}
        <PickerView
          data={data}
          value={this.state.value}
          onChange={this.handleChange}
          cols={rows}
        />

        {/* 
          底部按钮
          
          this.props.onCancel() 表示调用父组件中的 onCancel

          onCancel 就是 取消 按钮的单击事件
          onOK 就是 确定 按钮的单击事件
        */}
        <FilterFooter
          onCancel={() => this.props.onCancel()}
          onOk={() => this.props.onSave(this.state.value)}
        />
      </>
    )
  }
}
