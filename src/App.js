/**
 * 根组件 - 用来处理路由
 */
import React from 'react'

// 导入路由文件
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

// 导入页面组件
// import Home from './pages/Home/index.js'
// 注意： index.js 都可以省略掉
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import Details from './pages/Details'
import Login from './pages/Login'

export default function App() {
  // 使用 Router 作为项目的根节点
  return (
    <Router>
      <div className="app">
        {/* 默认路由时，进行重定向 */}
        {/* <Route exact path="/" render={() => <Redirect to="/home" />} /> */}
        <Route
          exact
          path="/"
          render={data => {
            console.log('参数：', data)
            return <Redirect to="/home" />
          }}
        />

        {/* 配置路由规则 */}
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
        <Route path="/map" component={Map}></Route>
        {/* 
          路由的匹配模式，默认是 模糊匹配 的
          也就是说： 只要 pathname 是以 path 开头，那么，该路由就会匹配成功
          pathname:  /detail/5cc450a81439630e5b3dcbff
          path: /detail

          为了能够拿到房源的id，我们需要使用 路由参数 来进行匹配
          path="/detail" ===> path="/detail/:id" :id 就是路由参数
        */}
        <Route path="/detail/:id" component={Details}></Route>
        <Route path="/login" component={Login}></Route>
      </div>
    </Router>
  )
}
