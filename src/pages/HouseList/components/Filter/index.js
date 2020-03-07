import React, { Component } from 'react'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import { API, getCurCity } from '../../../../utils/index.js'
import styles from './index.module.css'

export default class Filter extends Component {
  state = {
    // 标题高亮状态对象
    titleSelectedStatus: {
      area: false,
      mode: false,
      price: false,
      more: false
    },

    // 展示和隐藏 FilterPicker 以及 FilerMore 组件
    openType: '',

    // 4个菜单对应的筛选条件数据
    filtersData: {},

    // 4个菜单的选中值
    selectedValues: {
      // 因为 PickerView 组件的选中值是一个数组，所以，状态对象中的值，要给一个数组即可
      area: [],
      mode: [],
      price: [],
      more: []
    }
  }

  async componentDidMount() {
    // 获取到当前定位城市的信息
    const { value } = await getCurCity()

    const res = await API.get('/houses/condition', {
      params: {
        // 当前定位城市的id
        id: value
      }
    })

    // console.log('筛选条件数据：', res)
    this.setState({
      filtersData: res.data.body
    })
  }

  // 父组件提供的方法，这个方法是给子组件调用
  // 来实现标题菜单高亮的
  // 参数 type 就是高亮状态对象中的键
  changeTitle = type => {
    // console.log('Filter 父组件：', type)
    // 注意： 状态更新的原则是不要修改当前对象，而是创建新对象（ state 不可变 ）
    this.setState({
      titleSelectedStatus: {
        ...this.state.titleSelectedStatus,
        [type]: true
      },
      // 通过菜单的类型，来控制 FilterPicker 以及 FilterMore 组件的展示和隐藏
      openType: type
    })
  }

  // 隐藏 FilterPicker 以及 FilerMore 组件
  // 不管是点击 遮罩层 还是 点击 取消 按钮，都会触发这个方法，来隐藏 FilterPicker
  onCancel = () => {
    this.setState({
      openType: ''
    })
  }

  // 点击确定按钮，获取到选中值
  onSave = value => {
    // openType 就表示当前正打开的菜单类型，这个类型正好也是 selectedValues 的键
    const { openType } = this.state
    // console.log('父组件获取到选中值为：', openType, value)
    this.setState({
      selectedValues: {
        ...this.state.selectedValues,
        [openType]: value
      },

      // 关闭 FilterPicker 组件
      openType: ''
    })
  }

  // 渲染 FilterPicker 组件（ 前三个菜单对应的组件 ）
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state

    // 根据当前菜单的类型，来获取到该菜单对应的筛选数据
    // 然后，传递给 FilterPicker 组件
    // 注意： data 的数据类型，是由使用该数据的地方（ 也就是 PickerView 组件 ）来决定的
    //       也就是说 PickerView 组件需要什么数据，就传递什么数据即可
    //       根据查看文档，PickerView 组件需要 数组 格式的数据，所以，接下来我们就需要准备一个数组格式的数据
    let data, rows

    switch (openType) {
      case 'area':
        // 区域菜单
        data = [area, subway]
        rows = 3
        break
      case 'mode':
        // 方式菜单
        data = rentType
        rows = 1
        break
      case 'price':
        // 租金菜单
        data = price
        rows = 1
        break
    }

    // 获取到当前菜单的选中值
    const selected = selectedValues[openType]

    // 如果 openType 的值为前 3 个菜单类型中的任何一个，就展示该组件
    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      return (
        <FilterPicker
          onSave={this.onSave}
          onCancel={this.onCancel}
          data={data}
          rows={rows}
          selected={selected}
        />
      )
    }

    // 否则，返回 null，表示不渲染该组件
    return null
  }

  render() {
    const { openType } = this.state

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {openType === 'area' || openType === 'mode' || openType === 'price' ? (
          <div className={styles.mask} onClick={this.onCancel} />
        ) : null}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            selected={this.state.titleSelectedStatus}
            onClick={this.changeTitle}
          />
          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          <FilterMore />
        </div>
      </div>
    )
  }
}
