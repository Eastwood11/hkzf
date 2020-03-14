/**
 * Home 页面
 *
 * 分为两块内容：
 * 1 变化的： 4 个 Route
 * 2 不变的:  底部TabBar
 */

import React from 'react'

import { Route } from 'react-router-dom'

// 导入 TabBar 组件
import { TabBar } from 'antd-mobile'

// 导入首页的4个嵌套路由对应的页面
import Index from '../Index'
import HouseList from '../HouseList'
import News from '../News'
import Profile from '../Profile'

// 导入样式文件
import './index.css'

// 抽离 TabBar.Item 列表的数据
// 说明： 因为底部的 TabBar 菜单数据是固定的，不会发生变化的，所以，直接将 数据 抽离到组件外部来作为一个单独的数组数据存在即可。
const tabbars = [
  { title: '首页', icon: 'icon-ind', path: '/home' },
  { title: '找房', icon: 'icon-findHouse', path: '/home/houselist' },
  { title: '资讯', icon: 'icon-infom', path: '/home/news' },
  { title: '我的', icon: 'icon-my', path: '/home/profile' }
]

export default class Home extends React.Component {
  state = {
    // 获取到当前路由地址
    selectedTab: this.props.location.pathname
  }

  // 注意： 该钩子函数的两个参数分别是
  //  1 prevProps 表示更新前的 props
  //  2 prevState 表示更新前的 state
  // 如何获取到当前最新的 props 和 state？ 通过 this 获取
  componentDidUpdate(prevProps) {
    // 更新前的路由地址：prevProps.location.pathname
    // 更新后的路由地址：this.props.location.pathname
    const newPathname = this.props.location.pathname
    if (prevProps.location.pathname !== newPathname) {
      // console.log('2 componentDidUpdate')
      // 更新状态即可
      this.setState({
        selectedTab: newPathname
      })
    }
  }

  render() {
    return (
      <div className="home">
        {/* 变化的 Route */}
        {/* 
          注意： 如果首页的 path="/home"，那么当 浏览器地址为 /home/profile 的时候
                由于模糊匹配的匹配方式，导致，该 首页 组件的路由也被匹配成功了。
                而此时，只想在浏览器地址为 /home 的时候，才应该匹配，
                所以，此处，将 匹配模式 修改为 精确匹配 即可。
        */}
        <Route path="/home" exact component={Index}></Route>
        <Route path="/home/houselist" component={HouseList}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/profile" component={Profile}></Route>

        {/* 不变的 TabBar */}
        <div className="tabbar-wrap">
          <TabBar noRenderContent tintColor="#21B97A">
            {tabbars.map(item => (
              <TabBar.Item
                title={item.title}
                key={item.title}
                icon={<i className={`iconfont ${item.icon}`} />}
                selectedIcon={<i className={`iconfont ${item.icon}`} />}
                selected={this.state.selectedTab === item.path}
                onPress={() => {
                  // 切换路由
                  this.props.history.push(item.path)

                  // 添加了 componentDidUpdate 钩子函数以后，这句代码省略即可
                  // 原因：
                  //  在触发该事件的时候，通过 history.push() 方法切换了路由
                  //  切换路由后，相当于修改了组件的 props
                  //  然后，组件的 componentDidUpdate 钩子函数就会执行
                  //  而 componentDidUpdate 钩子函数中，已经有更新 selectedTab 的代码了
                  // 所以，这边可以省略。
                  //
                  // 实现点击菜单时，当前菜单高亮
                  // this.setState({
                  //   selectedTab: item.path
                  // })
                }}
              />
            ))}
          </TabBar>
        </div>
      </div>
    )
  }
}
