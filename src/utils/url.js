/**
 * 读取 环境变量配置文件 中的 接口地址
 */

// console.log('在 URL 中读取到接口地址为：', process.env.REACT_APP_URL)

// 在 JS 代码中，获取到 环境变量 中配置的接口地址
// process 是 NodeJS 提供的一个全局对象
// process.env 专门用来获取跟 环境变量 相关内容的一个对象
// 文档： http://nodejs.cn/api/process.html#process_process_env
// console.log('process.env:', process.env)

// 该对象中有一个 NODE_ENV: "development" ，通过这个属性，就可以知道当前是什么环境了

// 使用这样的代码，就可以在 项目代码 中 根据不同的 环境，来执行不同的操作了
// if (process.env.NODE_ENV === 'development') {
//   // 开发环境
// } else if (process.env.NODE_ENV === 'production') {
//   // 生产环境
// }

const BASE_URL = process.env.REACT_APP_URL

export { BASE_URL }
