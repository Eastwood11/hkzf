import axios from 'axios'
import { getCity,setCity } from './city'
import { BASE_URL } from './url'
import { API } from './http'
const getCurCity = () => {
const curCity = JSON.parse(localStorage.getItem('hkzf_city'))
if (!curCity) {
   return new Promise(resolve => {
     const myCity = new window.BMap.LocalCity() 
     myCity.get(async result => {
      const cityName = result.name
      const res = await axios.get('http://localhost:8080/area/info', {
        params: {
          name: cityName
        }
          })
        localStorage.setItem('hkzf_city',JSON.stringify(res.data.body))
         resolve(res.data.body) 
        })  
   }) 
}else {
  return Promise.resolve(curCity)
}
}
export { getCurCity, getCity, setCity, API, BASE_URL }
