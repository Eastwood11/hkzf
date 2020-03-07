import React, { Component } from 'react'
import axios from 'axios'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
import { getCurCity } from '../../utils'
import './index.scss'
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
const menus = [
  { id: 1,title: '整租', imgSrc: nav1, path: '/home/houselist' },
  { id: 2,title: '合租', imgSrc: nav2, path: '/home/houselist' },
  { id: 3,title: '地图找房', imgSrc: nav3, path: '/map' },
  { id: 4,title: '去出租', imgSrc: nav4, path: '/rent/add' }
]

export default class Index extends Component {
   state = {
    swipers: [],
    groups: [],
    news: [],
    isLoaded: false,
    imgHeight: 212,
    cityName: '加载中'
  }
  async getCarousel() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    if (res.data.status === 200) {
      this.setState({
        swipers: res.data.body,
        isLoaded: true
      })
    }
  }
  async getGroups() {
    const res = await axios.get('http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
    if (res.data.status === 200) {
      this.setState({
        groups: res.data.body,
        isLoaded: true
      })
    }
  }
  async getNews() {
    const res = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
     
    if (res.data.status === 200) {
      this.setState({
        news: res.data.body,
        isLoaded: true
      })
    }
  }
 
 async componentDidMount() {
    this.getCarousel()
    this.getGroups()
    this.getNews()
    const { label } = await getCurCity()
    this.setState({
      cityName: label
    })
  }
  renderSwipers(){
    return <div className='Carousel'>
            <Flex className='topSearch'>
                    <Flex className='left'>
                        <div className="area" onClick={()=>{this.props.history.push('/citylist')}}>
                          <span>{this.state.cityName}</span>
                          <i className='iconfont icon-arrow'></i>
                        </div>
                        <div className="search">
                            <i className='iconfont icon-seach'></i>
                            <span>请输入小区或地址</span>
                        </div>
                    </Flex>
                    <i className='iconfont icon-map' onClick={()=>{this.props.history.push('/map')}}/>
                  </Flex>
                  <Carousel
                  autoplay
                  infinite
                >
                  {this.state.swipers.map(item => (
                    <a
                      key={item.id}
                      href="http://www.alipay.com"
                      style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                    >
                      <img
                        src={`http://localhost:8080${item.imgSrc}`}
                        alt=""
                        style={{ width: '100%', verticalAlign: 'top' }}
                        onLoad={() => {
                          // fire window resize event to change height
                          window.dispatchEvent(new Event('resize'));
                          this.setState({ imgHeight: 'auto' });
                        }}
                      />
                    </a>
                  ))}
                </Carousel>
          </div>
    
  }
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
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position)
    })
    return <div>
      {this.renderSwipers()}
      <Flex className='menus'>
        {menus.map(item=> {
          return <Flex.Item className='content' key={item.id} onClick={()=>this.props.history.push(item.path)}>
            <img src={item.imgSrc} alt=""/>
            <h2>{item.title}</h2>
          </Flex.Item>
        })}
      </Flex>
      <div className="groups">
        <Flex className="groups-title" justify="between">
          <h3>租房小组</h3>
          <span>更多</span>
        </Flex>
        {/* rendeItem 属性：用来 自定义 每一个单元格中的结构 */}
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
      <div className="news">
        <h3 className="group-title">最新资讯</h3>
        <WingBlank size="md">{this.renderNews()}</WingBlank>
      </div>
    </div>
  }
}
