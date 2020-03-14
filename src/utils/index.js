import axios from 'axios'

// 导入当前定位城市代码
import { getCity, setCity } from './city'
import { API } from './http'
import { BASE_URL } from './url'

/**
 * 封装获取当前定位城市的函数
 */
const getCurrentCity = () => {
  // const curCity = JSON.parse(localStorage.getItem('itcast_city'))
  const curCity = getCity()

  if (!curCity) {
    return new Promise(resolve => {
      const myCity = new window.BMap.LocalCity()
      myCity.get(async result => {
        const cityName = result.name

        // 调用接口，获取有房源的城市信息（ 如果当前定位城市没有房源信息，则，默认返回上海 ）
        const res = await axios.get('http://localhost:8080/area/info', {
          params: {
            name: cityName
          }
        })

        // 存储到本地缓存中
        // res.data.body => { label, value }
        // localStorage.setItem('itcast_city', JSON.stringify(res.data.body))
        setCity(res.data.body)

        // 将获取到的定位城市“返回”
        resolve(res.data.body)
      })
    })
  } else {
    return Promise.resolve(curCity)
  }
}

export { getCurrentCity, getCity, setCity, API, BASE_URL }
export * from './token'
