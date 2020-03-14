/**
 * 整个项目的入口文件
 *
 * 负责导入 App 根组件，渲染根组件
 */

import React from 'react'
import ReactDOM from 'react-dom'

// 导入 antd-mobile 的样式文件
import 'antd-mobile/dist/antd-mobile.css'

// 导入 react-virtualized 的样式文件
import 'react-virtualized/styles.css'

// 导入字体图标文件
import './assets/fonts/iconfont.css'

// 导入我们自己写的全局样式文件
import './index.css'

// 导入根组件
// 相当于导入了 页面 的所有样式
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))
