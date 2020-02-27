import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile'

import Index from '../Index'
import HouseList from '../HouseList'
import News from '../News'
import Profile from '../Profile'

const tabList = [
  { title: '首页', path: '/home/index', icon: 'ind'},
  { title: '找房', path: '/home/houselist', icon: 'findHouse'},
  { title: '资讯', path: '/home/news', icon: 'infom'},
  { title: '我的', path: '/home/profile', icon: 'my'}
]

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: this.props.location.pathname,
      hidden: false,
      fullScreen: true,
    }
  }

  renderContent() {
    return (
      <div>
        <Route path='/home/index' component={Index}></Route>
        <Route path='/home/houselist' component={HouseList}></Route>
        <Route path='/home/news' component={News}></Route>
        <Route path='/home/profile' component={Profile}></Route>
      </div>
    )
  }

  render() {
    return (
      <div style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', top: 0 } : { height: 400 }}>
        <TabBar
          unselectedTintColor="#888"
          tintColor="rgb(33, 185, 122)"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          {tabList.map(item=>{
            return <TabBar.Item
            title={item.title}
            key={item.title}
            icon={<i className={`iconfont icon-${item.icon}`}></i>}
            selectedIcon={<i className={`iconfont icon-${item.icon}`}></i>}
            selected={this.state.selectedTab === item.path}
            onPress={() => {
              this.props.history.push(item.path)
              this.setState({
                selectedTab: item.path,
              });
            }}
            data-seed="logId"
          >
            {this.renderContent('home')}
          </TabBar.Item>
          })}
        </TabBar>
      </div>
    );
  }
}
