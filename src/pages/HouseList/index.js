import React, { Component } from 'react'

import { Flex, Toast } from 'antd-mobile'

// 导入 List 列表组件
import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader
} from 'react-virtualized'

import SearchHeader from '../../components/SearchHeader'
import HouseItem from '../../components/HouseItem'
import Sticky from '../../components/Sticky'
import NoHouse from '../../components/NoHouse'

// 导入条件筛选栏父组件
import Filter from './components/Filter'

import styles from './index.module.scss'

import { API, getCurrentCity } from '../../utils'

export default class HouseList extends Component {
  state = {
    // 列表数据
    list: [],
    // 总数
    count: 0,
    // 数据是否加载完成
    isLoaded: false,
    // 当前定位城市名称
    cityName: '上海'
  }

  // 初始化 filters 属性的值
  filters = {}

  async componentDidMount() {
    // 获取当前定位城市数据
    const { label, value } = await getCurrentCity()
    this.setState({
      cityName: label
    })
    // 因为 cityId 不需要在页面中展示，所以，不需要将值放在 state 中
    this.cityId = value

    // 进入页面时，获取房源数据
    this.searchHouseList()
  }

  // 获取 Filter 组件中组装好的筛选条件数据
  onFilter = filters => {
    // 每次根据筛选条件获取数据时，都让页面回到最顶部
    window.scrollTo(0, 0)

    this.filters = filters

    // 调用获取列表数据的方法
    this.searchHouseList()
  }

  // 根据筛选条件获取房源列表数据
  async searchHouseList() {
    // 获取当前定位城市
    // const { value } = await getCurrentCity()

    // 开启loading
    Toast.loading('加载中...', 0)
    this.setState({
      isLoaded: false
    })

    const res = await API.get('/houses', {
      params: {
        ...this.filters,
        cityId: this.cityId,
        start: 1,
        end: 20
      }
    })

    // 关闭loading
    Toast.hide()

    const { list, count } = res.data.body

    // 提示房源数量
    if (count !== 0) {
      Toast.info(`共找到 ${count} 套房源`, 1)
    }

    // console.log('获取到房源列表数据为：', res)
    this.setState({
      list,
      count,
      isLoaded: true
    })
  }

  // 渲染房源列表的每一行数据
  rowRenderer = ({ key, index, style }) => {
    const { list } = this.state
    // console.log('List:', list, ' index', index)
    const data = list[index]

    // 注意：在 列表 快速滚动时，可能会导致 index 超过了 list 数据的最大索引
    //      而导致 list[index] 数据不存在，再传递给 HouseItem 组件时，会导致该组件中的
    //      必填项报 props 校验失败的错误。

    // 解决方式：
    // 1 判断 data 是否存在
    if (data) {
      // 2 如果存在，直接渲染 HouseItem 组件
      return (
        <HouseItem
          onClick={() => this.props.history.push(`/detail/${data.houseCode}`)}
          {...data}
          key={key}
          style={style}
        />
      )
    } else {
      // 3 如果不存在，就渲染一个 占位元素 即可
      //   当该数据加载完成后，会自动替换掉 占位元素
      return (
        <div key={key} style={style}>
          <div className={styles.loading} />
        </div>
      )
    }
  }

  // 确定列表中的行是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  // 加载更多数据
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(async resolve => {
      // 发送请求，获取数据
      // 获取当前定位城市
      // const { value } = await getCurrentCity()

      const res = await API.get('/houses', {
        params: {
          ...this.filters,
          cityId: this.cityId,
          start: startIndex,
          end: stopIndex
        }
      })
      const { list, count } = res.data.body

      // 将获取到的数据，存储到 list 中
      this.setState({
        // 注意： 是追加数据，而不是覆盖数据！！！
        list: [...this.state.list, ...list],
        count
      })

      // 数据加载完成时：
      resolve()
    })
  }

  // 渲染房源列表
  renderHouseList() {
    const { count, isLoaded } = this.state

    // 如果没有房源数据，就渲染 NoHouse 组件
    // 数据加载完成后，并且没有获取到房源数据，此时，再渲染 NoHouse 组件
    if (isLoaded && count === 0)
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>

    // 否则，渲染房源列表
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={this.state.count}
        minimumBatchSize={15}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    autoHeight
                    scrollTop={scrollTop}
                    isScrolling={isScrolling}
                    ref={registerChild}
                    width={width}
                    height={height - 45}
                    rowCount={this.state.count}
                    rowHeight={120}
                    rowRenderer={this.rowRenderer}
                    onRowsRendered={onRowsRendered}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 顶部搜索导航栏 */}
        <Flex className={styles.headerWrap}>
          <i className="iconfont icon-back"></i>
          <SearchHeader
            className={styles.header}
            cityName={this.state.cityName}
          />
        </Flex>

        {/* 条件筛选栏组件 */}
        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        {/* 
          房源列表
          
          minimumBatchSize 修改每次加载的条数
        */}
        {this.renderHouseList()}
      </div>
    )
  }
}
