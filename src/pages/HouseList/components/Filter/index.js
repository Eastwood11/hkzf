import React, { Component } from 'react'

// 导入动画组件 Spring
import { Spring } from 'react-spring/renderprops'

// 导入三个子组件
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

// 导入我们自己封装好的axios
import { API, getCurrentCity } from '../../../../utils'

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
      area: ['area', 'null'],
      mode: ['null'],
      price: ['null'],
      more: []
    }
  }

  async componentDidMount() {
    // 在该钩子函数中，获取到body
    this.htmlBody = document.body

    // 获取到当前定位城市的信息
    const { value } = await getCurrentCity()

    const res = await API.get('/houses/condition', {
      params: {
        // 当前定位城市的id
        id: value
      }
    })

    this.setState({
      filtersData: res.data.body
    })
  }

  // 父组件提供的方法，这个方法是给子组件调用
  // 来实现标题菜单高亮的
  // 参数 type 就是高亮状态对象中的键
  changeTitle = type => {
    // 给body添加一个 overflow: hidden 的样式，让页面超出部分隐藏，从而解决滚动问题
    this.htmlBody.classList.add('fixed')

    // 0 获取到所有菜单的选中状态对象
    const { selectedValues, titleSelectedStatus } = this.state

    // 创建标题高亮的新状态对象
    const newTitleSelectedStatus = {
      ...titleSelectedStatus
    }

    // 步骤：
    // 1 遍历所有菜单数据
    // for (let key in selectedValues)
    Object.keys(selectedValues).forEach(key => {
      // key 就是 selectedValues 对象中的键
      // selectedValues[key] 就是 键对应的值
      // console.log('key', key, 'value', selectedValues[key])

      // 每个菜单的选中值
      const curSelected = selectedValues[key]

      // 2 先判断是否为当前菜单，如果是当前菜单，直接高亮
      if (key === type) {
        // console.log('当前菜单', type)
        newTitleSelectedStatus[type] = true
      } else {
        // 3 再判断每一个菜单，分别来决定每一个菜单是否高亮
        newTitleSelectedStatus[key] = this.getTitleStatus(key, curSelected)
      }
    })

    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,

      // 通过菜单的类型，来控制 FilterPicker 以及 FilterMore 组件的展示和隐藏
      openType: type
    })
  }

  // 隐藏 FilterPicker 以及 FilerMore 组件
  onCancel = () => {
    // 去掉 body 的 fixed 样式
    this.htmlBody.classList.remove('fixed')
    // openType 就表示当前正打开的菜单类型，这个类型正好也是 selectedValues 的键
    const { openType, selectedValues } = this.state

    // 步骤：
    // 1 获取到当前选中值
    const curSelected = selectedValues[openType]

    // 菜单是否高亮
    let isSelected = this.getTitleStatus(openType, curSelected)

    this.setState({
      // 更新当前菜单的高亮状态
      titleSelectedStatus: {
        ...this.state.titleSelectedStatus,
        [openType]: isSelected
      },

      // 关闭 FilterPicker 组件
      openType: ''
    })
  }

  // 点击确定按钮，获取到选中值
  onSave = value => {
    // 去掉 body 的 fixed 样式
    this.htmlBody.classList.remove('fixed')
    // openType 就表示当前正打开的菜单类型，这个类型正好也是 selectedValues 的键
    const { openType, selectedValues } = this.state

    // 步骤：
    // 获取到当前选中值
    const curSelected = value
    // 菜单是否高亮
    let isSelected = this.getTitleStatus(openType, curSelected)

    // 因为需要在点击确定按钮时，来进行房源列表的筛选，所以，就在当前的事件处理程序中
    // 进行筛选条件的组件即可。
    // 1 获取到当前最新的选中值
    const newSelectedValues = {
      ...selectedValues,
      [openType]: value
    }
    // console.log('最新的选中数据：', newSelectedValues)

    // 2 创建接口需要的数据对应的对象
    const filters = {}

    // 3 将最新的选中值格式转化为接口需要的格式
    //  3.1 将选中值中的键名称，修改为接口需要的键名称
    //  3.2 将选中值中的值修改为接口需要的值的格式
    //  3.3 将修改后的内容，添加到接口对应的对象中

    // 租赁方式（ 整租、合租 ）
    filters.rentType = newSelectedValues.mode[0]
    // 租金
    filters.price = newSelectedValues.price[0]
    // 更多筛选条件
    filters.more = newSelectedValues.more.join(',')
    // 区域 或 地铁
    // 注意： 如果选中的是区域，那么，键名为： area
    //       如果选中的是地铁，那么，键名为： subway
    const key = newSelectedValues.area[0]
    // 选中值的三种情况：
    // 1 ["subway", "null"]
    // 2 ["area", "AREA|67fad918-f2f8-59df", "null"]
    // 3 ["area", "AREA|67fad918-f2f8-59df", "AREA|7c0c4ebb-3bb9-1eb0"]
    let areaValue
    if (newSelectedValues.area.length === 2) {
      areaValue = 'null'
    } else {
      // 选中值长度为 3
      // 判断数组最后一项值，是否为 'null'
      if (newSelectedValues.area[2] === 'null') {
        // 如果是，就获取到数第二项的值
        areaValue = newSelectedValues.area[1]
      } else {
        // 如果不是，就获取最后一项的值
        areaValue = newSelectedValues.area[2]
      }
    }
    filters[key] = areaValue

    // 4 传递给 HouseList 页面
    this.props.onFilter(filters)

    this.setState({
      selectedValues: newSelectedValues,

      // 更新当前菜单的高亮状态
      titleSelectedStatus: {
        ...this.state.titleSelectedStatus,
        [openType]: isSelected
      },

      // 关闭 FilterPicker 组件
      openType: ''
    })
  }

  // 封装一个方法，获取某个菜单是否高亮
  //
  // 1 创建一个方法，给方法起一个名称
  // 2 把要封装的代码，拷贝到该方法中
  // 3 分析这些代码，发现： openType / curSelected / isSelected 这三个变量缺失
  // 4 因为这个方法是获取某个菜单是否高亮的，所以，我们把可以把判断条件中的 openType / curSelected
  //   作为参数传入.
  //   而 isSelected 就是我们需要的菜单是否高亮的数据，所以，这个数据就作为该方法的返回值即可
  // 5 将来再调用该方法时，只需要传入 openType（当前菜单的类型）以及 curSelected（当前菜单的选中值）
  //   就可以通过 返回值 得到该菜单是否高亮了
  // 封装一个方法，就考虑两个点： 1 参数 2 返回值。 也就是根据不同的参数，返回不同的结果
  getTitleStatus(openType, curSelected) {
    let isSelected

    if (
      openType === 'area' &&
      (curSelected.length === 3 || curSelected[0] !== 'area')
    ) {
      // 区域菜单
      // 当前默认值为： ['area', 'null']
      isSelected = true
    } else if (openType === 'mode' && curSelected[0] !== 'null') {
      // 方式菜单
      // 当前默认值为： ['null']
      isSelected = true
    } else if (openType === 'price' && curSelected[0] !== 'null') {
      // 租金菜单
      // 当前默认值为： ['null']
      isSelected = true
    } else if (openType === 'more' && curSelected.length > 0) {
      // 第 4 个菜单
      isSelected = true
    } else {
      isSelected = false
    }

    return isSelected
  }

  // 渲染 FilterPicker 组件（ 前三个菜单对应的组件 ）
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state

    // 根据当前菜单的类型，来获取到该菜单对应的筛选数据
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
          key={openType}
        />
      )
    }

    // 否则，返回 null，表示不渲染该组件
    return null
  }

  // 渲染 FilterMore 组件（ 第4个菜单对应的组件 ）
  renderFilterMore() {
    const {
      openType,
      filtersData: { roomType, oriented, floor, characteristic },
      selectedValues
    } = this.state

    if (openType !== 'more') return null

    // 组装该组件需要的数据源
    const data = {
      roomType,
      oriented,
      floor,
      characteristic
    }

    // 选中值
    const selected = selectedValues.more

    return (
      <FilterMore
        selected={selected}
        data={data}
        onSave={this.onSave}
        onCancel={this.onCancel}
      />
    )
  }

  // 渲染 遮罩层
  renderMask() {
    const { openType } = this.state
    // 注意： from 只在第一次渲染 Spring 组件时生效，也就是页面一进来就生效了。
    //       而我们需要在点击 标题栏 打开对话框时，给 遮罩层 组件添加样式
    //       所以，这就相当于第二次渲染 Spring 组件了
    //       而第二次及其以后的每次渲染 Spring 组件，都是从 旧to -> 新to 值。
    //       所以，需要让 to 的值变为动态的，而不是写死的。
    // 打开遮罩层：opacity 需要从 0（不展示） -> 1（展示）
    // 所以，旧to => 0，新to => 1
    // 因为遮罩层打开时，有一个 if 判断，所以，我们可以根据这个 if 判断，来决定 to 的值就可以了
    // 不展示遮罩层时，to 为 0
    // 展示遮罩层时，to 为 1
    const isShow =
      openType === 'area' || openType === 'mode' || openType === 'price'

    return (
      <Spring to={{ opacity: isShow ? 1 : 0 }}>
        {props => {
          // 移除遮罩层，防止顶部导航菜单的单击事件失效
          if (props.opacity === 0) return null

          return (
            <div
              style={props}
              className={styles.mask}
              onClick={this.onCancel}
            />
          )
        }}
      </Spring>
    )

    // if (openType === 'area' || openType === 'mode' || openType === 'price') {
    //   return (
    //     // from 就是默认值
    //     // to 就是动画的目标值
    //     // 也就是这个动画效果会从 from -> to，也就是让 opacity 的值从 0 -> 1
    //     <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
    //       {props => {
    //         // props 就是样式对象
    //         // 此处，就是 opacity 从 0 -> 1 的中间过程
    //         console.log('Spring props:', props)
    //         return (
    //           <div
    //             style={props}
    //             className={styles.mask}
    //             onClick={this.onCancel}
    //           />
    //         )
    //       }}
    //     </Spring>
    //   )
    // }
    // return null
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {this.renderMask()}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            selected={this.state.titleSelectedStatus}
            onClick={this.changeTitle}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
