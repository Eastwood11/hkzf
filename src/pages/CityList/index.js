/**
 * CityList 页面
 */

import React from 'react'

import { Toast } from 'antd-mobile'

import './index.scss'

import axios from 'axios'

// 导入 List 列表组件
import { List, AutoSizer } from 'react-virtualized'

// 导入顶部导航栏组件
import NavHeader from '../../components/NavHeader'

// 导入获取定位城市的函数
// import { getCurrentCity } from '../../utils'
// import { setCity } from '../../utils/city'

import { getCurrentCity, setCity } from '../../utils'

// 数据格式处理
// 参数： 接口返回的城市列表数据
// 返回值： { cityList }
//  cityList 就是城市分类列表数据 { a: [], b: [], ... }
function fortmatCityList(list) {
  // 城市分类列表数据
  // 2 创建一个对象，用来存储 城市分类列表数据
  const cityList = {}

  list.forEach(item => {
    //  3.1 获取到当前城市的首字母（比如： b / a ...）
    const firstLetter = item.short.slice(0, 1)
    //  3.2 判断 {} 中，是否有当前分类（ 也就是对象中是否存在某个属性 ）
    if (firstLetter in cityList) {
      //  3.4 如果有当前分类，就直接将该城市数据添加到该分类对应的数组中
      cityList[firstLetter].push(item)
    } else {
      //  3.3 如果没有当前分类，就往 {} 中，添加（创建）该分类，并且将当前城市添加到数组中
      cityList[firstLetter] = [item]
    }
  })

  // 根据 城市分类列表数据 获取到 城市索引数组
  const cityIndex = Object.keys(cityList).sort()

  return {
    cityList,
    cityIndex
  }
}

// 数据格式处理 - 城市列表每一行的分类名称
// 用法： 接受原始的城市分类名称，返回处理好的城市分类名称
function formatCategoryName(name) {
  switch (name) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return name.toUpperCase()
  }
}

/**
 * 分类名称高度
 */
const CATE_NAME_HEIGHT = 36

/**
 * 城市名称高度
 */
const CITY_NAME_HEIGHT = 50

export default class CityList extends React.Component {
  state = {
    // 城市分类列表数据
    cityList: {},
    // 城市右侧索引数组
    cityIndex: [],
    // 右侧索引列表高亮的索引号
    activeIndex: 0,

    // 记录是不是用户点击了右侧索引
    isClicked: false
  }

  // 创建 ref 对象， 用来获取 List 组件
  listRef = React.createRef()

  async componentDidMount() {
    this._isMounted = true

    // await this.getCityList()
    // if (this._isMounted) {
    //   this.listRef.current.measureAllRows()
    // }

    try {
      await this.getCityList()
      this.listRef.current.measureAllRows()
    } catch (e) {}

    // this.getCityList()
  }

  cancel = null

  componentWillUnmount() {
    // this._isMounted = false

    // 3
    this.cancel()
  }

  // 获取城市列表数据
  async getCityList() {
    // 1
    const CancelToken = axios.CancelToken

    const res = await axios.get('http://localhost:8080/area/city', {
      params: {
        level: 1
      },
      // 2
      cancelToken: new CancelToken(c => {
        // An executor function receives a cancel function as a parameter
        this.cancel = c
      })
    })

    // console.log('城市列表数据为：', res.data.body)
    // 封装一个函数，来进行数据格式处理
    const { cityList, cityIndex } = fortmatCityList(res.data.body)

    // 获取热门城市列表数据
    const hotRes = await axios.get('http://localhost:8080/area/hot', {
      cancelToken: new CancelToken(c => {
        // An executor function receives a cancel function as a parameter
        this.cancel = c
      })
    })
    // 将热门城市数据，添加到 cityList 和 cityIndex 中
    // 注意：两个数据中的 键（hot） 要相同！
    cityList['hot'] = hotRes.data.body
    cityIndex.unshift('hot')

    // 获取当前定位城市数据
    // 使用 await 来获取结果
    const curCity = await getCurrentCity()
    // 将当前定位城市数据添加到 cityList 和 cityIndex 中
    cityList['#'] = [curCity]
    cityIndex.unshift('#')

    // 将获取到的数据添加到状态中
    // if (this._isMounted) {
    console.log('citylist setState')
    this.setState({
      cityList,
      cityIndex
    })
    // this.listRef.current.measureAllRows()
    // }
  }

  // List 组件渲染每一行的函数
  // 将该函数修改为 箭头函数 形式，已解决函数中 this 指向的问题。
  rowRenderer = ({ key, index, style }) => {
    const { cityList, cityIndex } = this.state
    // 获取当前分类对应的城市列表
    const curCityList = cityList[cityIndex[index]]

    const handleClick = item => {
      // - 1 给每个城市名称绑定单击事件
      // - 2 判断当前被点击的城市名称是否为 北上广深 中的一个
      // console.log(item.label)
      if (['北京', '上海', '广州', '深圳'].indexOf(item.label) > -1) {
        // - 4 如果是，1 先修改本地缓存中的当前定位城市 2 返回到上一页
        // console.log('是')
        const curCity = {
          label: item.label,
          value: item.value
        }
        // localStorage.setItem('itcast_city', JSON.stringify(curCity))
        setCity(curCity)
        // 返回到上一页
        this.props.history.go(-1)
      } else {
        // - 3 如果不是，就弹出提示： `该城市暂无房源数据`
        Toast.info('该城市暂无房源数据', 1)
        // console.log('不是')
      }
    }

    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCategoryName(cityIndex[index])}</div>
        {curCityList.map(item => (
          <div
            className="name"
            key={item.value}
            onClick={() => handleClick(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }

  // 根据索引号动态计算每一行的高度
  // 参数解构出来的就是每一行的索引号
  calcRowHeight = ({ index }) => {
    // 公式： 分类名称的高度 + 城市名称的高度 * 城市数量
    // 代入： 36 + 50 * 城市数量（ curCityList.length ）
    const { cityList, cityIndex } = this.state
    const curCityList = cityList[cityIndex[index]]

    // return 36 + 50 * curCityList.length
    return CATE_NAME_HEIGHT + CITY_NAME_HEIGHT * curCityList.length
  }

  // 渲染右侧索引列表
  renderCityIndex() {
    const { cityIndex, activeIndex } = this.state

    const handleClick = index => {
      // 说明是用户点击了右侧索引
      this.setState({
        isClicked: true,
        // 此时，就让 高亮索引 为当前用户点击的项的索引
        activeIndex: index
      })

      // 注意：
      //  在点击索引让城市列表跳转时，会触发 List 列表的滚动
      //  而我们已经在 滚动 的代码中，处理过索引高亮问题了，所以，此处的代码就可以省略了。
      // this.setState({
      //   activeIndex: index
      // })
      // 通过 ref 获取 List 组件实例对象
      // console.log('city index：', this.listRef.current)
      this.listRef.current.scrollToRow(index)
    }

    return cityIndex.map((item, index) => (
      <li
        key={item}
        className="city-index-item"
        onClick={() => handleClick(index)}
      >
        {/* 高亮类名： index-active */}
        <span className={activeIndex === index ? 'index-active' : ''}>
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    ))
  }

  // List 列表滚动时触发

  // 注意：
  //  该方法会在两种情况下执行
  //  1 用户滚动了 List 列表
  //  2 点击右侧城市索引
  //  因为我们发现，在点击右侧城市索引时，如果点了 Z 高亮的是 Y，造成了高亮不准确的问题。
  //  解决方式： 在用户点击 右侧城市索引 时，不通过该方法来更新 activeIndex 高亮状态即可
  onRowsRendered = ({ startIndex }) => {
    // 先判断是否是用户点击了右侧索引
    if (!this.state.isClicked) {
      // 说明是不是用户点击了右侧索引，而是用户滚动了 List 列表来触发的滚动行为

      // 只需要使用 startIndex （ List 列表项 可视区 最顶部的一项的索引号 ）来作为 activeIndex
      if (this.state.activeIndex !== startIndex) {
        this.setState({
          activeIndex: startIndex
        })
      }
    } else {
      // 重置 isClicked 值，保证在用户点击右侧索引后，还能够在 滚动 List 列表时，让右侧索引高亮
      this.setState({
        isClicked: false
      })
    }
  }

  render() {
    return (
      <div className="citylist">
        {/* 
          顶部导航栏
        */}
        <NavHeader>城市选择</NavHeader>

        {/* 右侧城市索引列表： */}
        <ul className="city-index">{this.renderCityIndex()}</ul>

        {/* 城市列表 */}
        {/* 
          width 表示 List 组件可视区域的宽度
          height 表示 List 组件可视区域的高度
          rowCount 表示列表的行数，就是 数据源数组的长度
          rowHeight 表示 List 列表中每一行的高度（ 非常重要，虚拟列表根据该属性，来知道每一行元素应该出现在页面中的什么位置 ）
          rowRenderer 渲染列表中每一行的函数
        */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.listRef}
              width={width}
              height={height - 45}
              // 注意： 我们将每一组分类，来设置为一行，所以，行数就是分类长度
              rowCount={this.state.cityIndex.length}
              // 动态计算每一行的高度
              rowHeight={this.calcRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              // 让 List 滚动时，被滚动到的那一行，出现在 List 的最顶部
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
      </div>
    )
  }
}
