import React, { Component } from 'react'
import axios from 'axios'
import { Carousel, Flex } from 'antd-mobile'
import './index.scss'
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
const menus = [
  { title: '整租', imgSrc: nav1, path: '/home/houselist' },
  { title: '合租', imgSrc: nav2, path: '/home/houselist' },
  { title: '地图找房', imgSrc: nav3, path: '/map' },
  { title: '去出租', imgSrc: nav4, path: '/rent/add' }
]

export default class Index extends Component {
   state = {
    swipers: [],
    isLoaded: false,
    imgHeight: 212,
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
  componentDidMount() {
    this.getCarousel()
  }
  renderSwipers(){
    if (!this.state.isLoaded) {
      return null
    }
    return <Carousel
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
  }
  render() {
    return <div>
      {this.renderSwipers()}
      <Flex>
        {menus.map(item=> {
          return <Flex.Item className='content' key={item.id} >
            <img src={item.imgSrc} alt=""/>
            <h2>{item.title}</h2>
          </Flex.Item>
        })}
      </Flex>
    </div>
  }
}
