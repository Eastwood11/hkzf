import React, { Component } from 'react'

// 导入轮播图组件
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'

// 导入 axios
import axios from 'axios'

// 导入顶部搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'

// 导入 scss 文件
import './index.scss'

// 手动导入4张导航菜单的图片
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'

// 导入获取定位城市的函数
import { getCurrentCity } from '../../utils'

// 将导航菜单抽象成一个数组
const menus = [
  { title: '整租', imgSrc: nav1, path: '/home/houselist' },
  { title: '合租', imgSrc: nav2, path: '/home/houselist' },
  { title: '地图找房', imgSrc: nav3, path: '/map' },
  { title: '去出租', imgSrc: nav4, path: '/rent/add' }
]

// 测试 H5 中的地理位置 API
// navigator.geolocation.getCurrentPosition(function(position) {
//   console.log('H5 获取当前地理位置：', position)
// })

export default class Index extends Component {
  state = {
    // 轮播图数据
    swipers: [],
    // 添加一个轮播图数据是否加载完成的状态
    isLoaded: false,
    // 轮播图图片的默认高度，将默认高度值设置为 212
    imgHeight: 212,

    // 租房小组数据
    groups: [],
    // 最新资讯数据
    news: [],
    // 当前城市名称
    cityName: '上海'
  }

  async componentDidMount() {
    // 获取轮播图数据
    this.getSwipers()
    // 获取租房小组数据
    this.getGroups()
    // 获取最新资讯
    this.getNews()

    // 调用方法，来获取定位城市数据
    const { label } = await getCurrentCity()
    this.setState({
      cityName: label
    })
  }

  // 获取轮播图数据
  async getSwipers() {
    const res = await axios.get('http://localhost:8080/home/swiper')

    this.setState({
      swipers: res.data.body,
      // 渲染轮播图
      isLoaded: true
    })
  }

  // 获取租房小组数据
  async getGroups() {
    // const res = await axios.get(
    //   'http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0'
    // )

    const res = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area: 'AREA|88cff55c-aaa4-e2e0'
      }
    })

    this.setState({
      groups: res.data.body
    })
  }

  // 获取最新资讯
  async getNews() {
    const res = await axios.get(
      'http://localhost:8080/home/news?area=AREA|88cff55c-aaa4-e2e0'
    )

    this.setState({
      news: res.data.body
    })
  }

  // 创建渲染轮播图的方法
  renderSwiper() {
    // 如果轮播图没有加载完成，就渲染 null，表示不渲染轮播图
    if (!this.state.isLoaded) {
      return null
    }

    // 否则，再渲染轮播图组件
    return (
      <Carousel autoplay infinite>
        {this.state.swipers.map(item => (
          <a
            key={item.id}
            href="http://itcast.cn/"
            style={{
              display: 'inline-block',
              width: '100%',
              height: this.state.imgHeight
            }}
          >
            <img
              src={`http://localhost:8080${item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                // window.dispatchEvent(new Event('resize'))
                this.setState({ imgHeight: 'auto' })
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }

  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  render() {
    return (
      <div className="index">
        {/* 轮播图 和 顶部导航菜单 */}
        <div className="swipper-wrap">
          {/* 顶部导航菜单 */}
          <SearchHeader cityName={this.state.cityName}></SearchHeader>

          {/* 轮播图 */}
          {this.renderSwiper()}
        </div>

        {/* 导航菜单 */}
        <Flex className="menus">
          {menus.map(item => (
            <Flex.Item
              key={item.title}
              onClick={() => this.props.history.push(item.path)}
            >
              <img src={item.imgSrc} alt="" />
              <h3>{item.title}</h3>
            </Flex.Item>
          ))}
        </Flex>

        {/* 租房小组 */}
        <div className="groups">
          <Flex className="groups-title" justify="between">
            <h3>租房小组</h3>
            <span>更多</span>
          </Flex>
          {/* 
            data 宫格的数据源（ 数组 ）
            columnNum 列数
            square 宫格的每一项是否为正方形
            activeStyle 点击反馈
            hasLine 是否有边框

            rendeItem 用来 自定义 每一个单元格中的结构
          */}
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            activeStyle
            hasLine={false}
            renderItem={item => (
              <Flex className="grid-item" justify="between">
                <div className="desc">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}
