/**
 * 创建自己的 axios 实例
 */

import axios from 'axios'
import { BASE_URL } from './url'
// console.log('在 URL 中读取到接口地址为：', process.env.REACT_APP_URL)

// 创建 axios 实例
const API = axios.create({
  // 配置接口的公共路径
  baseURL: BASE_URL
  // baseURL: 'http://api.itcast.cn/'
})

// 进行 axios 拦截器的处理
// API.interceptors.request.use()
// API.interceptors.response.use()

// 导入实例
export { API }
