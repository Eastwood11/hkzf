import React, { Component } from 'react'

// import axios from 'axios'

import cls from 'classnames'

import { Toast } from 'antd-mobile'

// 导入顶部导航栏组件
import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'

// 导入 css modules 文件
import styles from './index.module.scss'

import { getCurrentCity, API } from '../../utils'

const BMap = window.BMap
// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

export default class Map extends Component {
  state = {
    // 控制房源列表的展示和隐藏
    isShowList: false,
    // 房源列表数据
    list: []
  }

  async componentDidMount() {
    // 获取当前定位城市
    // label 表示：当前城市名称
    // value 表示：当前城市的id
    const { label, value } = await getCurrentCity()

    // 创建百度地图的实例对象
    const map = new BMap.Map('container')
    this.map = map
    // 使用 地址解析 功能，将 城市名称 转化为 坐标
    const myGeo = new BMap.Geocoder()
    // 第一个参数： 表示详细地址，如果不知道一个明确的地址，传入 null 即可
    // 第二个参数： 是一个回调函数，用来获取解析后的 坐标
    // 第三个参数： 表示城市名称
    myGeo.getPoint(
      null,
      point => {
        // point 就是 地址解析 后的坐标
        if (point) {
          map.centerAndZoom(point, 11)

          // 渲染覆盖物
          this.renderOverlays(value)

          // 添加两个控件
          map.addControl(new BMap.NavigationControl())
          map.addControl(new BMap.ScaleControl())
        }
      },
      label
    )

    // 给地图绑定移动事件，在移动地图时，隐藏房源列表
    map.addEventListener('movestart', () => {
      // console.log('地图移动了 move')
      if (this.state.isShowList) {
        this.setState({
          isShowList: false
        })
      }
    })
    // map.addEventListener('touchstart', () => {
    //   console.log('地图移动了 touchstart')
    // })
  }

  // 1
  // 作用： 1 发送请求，获取房源数据  2 获取覆盖物类型以及下一级缩放级别
  // 注意： 这个方法会被调用多次，我们根据传入的 id 来区分获取哪个区域的数据
  async renderOverlays(id) {
    // 开启loading效果
    // 注意： 第二个参数传入 0 表示，该 loading 不会自动关闭，需要手动关闭
    Toast.loading('加载中...', 0)

    // 发送请求，获取数据，渲染覆盖物
    const res = await API.get('/area/map', {
      params: {
        id
      }
    })

    // 关闭loading效果
    Toast.hide()

    // 获取覆盖物类型以及下一级缩放级别
    const { nextLevel, type } = this.getTypeAndZoom()

    // 注意：因为每一个区都有覆盖物，所以，需要遍历所有区的数据，来渲染覆盖物
    res.data.body.forEach(item => {
      // 调用该方法，将渲染房源所需的所有数据，传递给该方法
      // 由这个方法，继续完成渲染房源的后续工作
      this.createOverlays(item, nextLevel, type)
    })
  }

  // 2
  // 作用： 获取当前覆盖物类型 以及 下一级缩放级别
  getTypeAndZoom() {
    // 当前缩放级别
    const level = this.map.getZoom()
    let nextLevel
    // 当前要渲染的覆盖物类型
    let type

    // 如果当前展示的是区，那么，下一级展示的是：镇
    if (level === 11) {
      nextLevel = 13
      type = 'circle'
    } else if (level === 13) {
      // 如果当前展示的是镇，那么，下一级展示的是：小区
      nextLevel = 15
      type = 'circle'
    } else {
      // 如果是小区，就展示 矩形覆盖物
      type = 'rect'
    }

    return {
      // 下一级的缩放级别
      nextLevel,
      // 当前要渲染的覆盖物类型
      type
    }
  }

  // 3
  // 作用： 根据传入的 type ，来决定调用哪个方法渲染覆盖物
  createOverlays(data, nextLevel, type) {
    const {
      label,
      value,
      count,
      coord: { latitude, longitude }
    } = data

    // 根据返回数据的坐标，来创建一个百度地图的坐标对象
    const point = new BMap.Point(longitude, latitude)

    if (type === 'circle') {
      // 区、镇的覆盖物
      // label: 区域名称
      // value：区域的id
      // count：房源数量
      // point：表示该覆盖物的坐标
      // nextLevel：表示下一级缩放级别
      this.createCircle(label, value, count, point, nextLevel)
    } else {
      // 小区的覆盖物
      this.createRect(label, value, count, point)
    }
  }

  // 4
  // 渲染区镇的覆盖物（ 圆形覆盖物 ）
  createCircle(areaName, id, count, point, nextLevel) {
    // 给地图添加覆盖物
    const opts = {
      // 指定文本标注所在的地理位置坐标
      position: point,
      // 设置文本偏移量
      // 注意 Size 中的两个参数单位是 px
      offset: new BMap.Size(-35, -35)
    }

    // 第一个参数：表示要渲染的文本信息
    // 第二个参数：表示当前标注的配置对象
    const label = new BMap.Label('', opts) // 创建文本标注对象

    // 给 label 设置 HTML 内容
    // 注意： 因为这段内容为纯 HTML ，所以，类名是 class 而不是 className
    // 注意： 使用了该方法后，上面 Label('', opts) 中的第一个参数，就无效了
    label.setContent(`
      <div class="${styles.bubble}">
        <p class="${styles.name}">${areaName}</p>
        <p>${count}套</p>
      </div>
    `)

    // 给 label 设置样式
    label.setStyle(labelStyle)

    // 给 label 添加单击事件
    // 注意： 这个 addEventListener 是 百度地图 自己提供的注册事件方法
    label.addEventListener('click', () => {
      // console.log('覆盖物被点击了', id, nextLevel)

      // 1 放大地图
      // 点击哪个覆盖物，就以哪个覆盖物为中心进行放大地图
      // 所以，只要把当前被点击的覆盖物的 坐标 传进来，就可以以当前点为中心放大地图了
      this.map.centerAndZoom(point, nextLevel)

      // 2 清除地图中当前的覆盖物，然后，调用 renderOverlays 渲染新的覆盖物
      // 因为在单击当前覆盖物的时候，会触发该覆盖物的单击事件，然后，在当前覆盖物的单击事件中清除了地图中的所有覆盖物
      // 但是，有些事情是没有执行完成，但是，覆盖物被删除了。导致，再触发这些没有执行完的事件时，找不到触发事件的对象
      // 因此，就报错了。（ Uncaught TypeError: Cannot read property 'R' of null ）
      // this.map.clearOverlays()
      //
      // 问题： 如何解决报错的问题呢？？？
      // 解决方式： 只需要延迟调用 clearOverlays() 即可，因为延迟执行的时候，会等待所有的事情都执行完成。
      //          所有的事件都执行完成了，再清除覆盖物就不会有问题了。
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)

      // 根据 id 继续获取下一级房源数据
      this.renderOverlays(id)
    })

    // 将创建好的覆盖物，添加到地图中
    this.map.addOverlay(label)
  }

  // 5
  // 作用： 渲染小区覆盖物信息
  createRect(name, id, count, point) {
    // 给地图添加覆盖物
    const opts = {
      // 指定文本标注所在的地理位置坐标
      position: point,
      // 设置文本偏移量
      // 注意 Size 中的两个参数单位是 px
      offset: new BMap.Size(-50, -28)
    }
    const label = new BMap.Label('', opts) // 创建文本标注对象

    // 给 label 设置 HTML 内容
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)

    // 给 label 设置样式
    label.setStyle(labelStyle)

    // 注意： 这个代码会在该方法执行的时候，也就是渲染小区的时候，才会执行。
    // 通过 JS 代码打断点，当浏览器执行代码到这一行的时候，代码就会暂停住
    // debugger

    // 给 label 添加单击事件
    // 注意： 这个 addEventListener 是 百度地图 自己提供的注册事件方法
    label.addEventListener('click', e => {
      // 1 移动地图，将当前小区移动到地图中心
      // 1.1 获取到中心点坐标（x1, y1）
      const x1 = window.innerWidth / 2
      const y1 = (window.innerHeight - 330) / 2
      // 1.2 获取到当前被点击小区的坐标（x2, y2）
      const { clientX, clientY } = e.changedTouches[0]
      // 1.3 计算偏移值
      const x = x1 - clientX
      const y = y1 - clientY
      // 1.4 调用地图API，来移动地图
      this.map.panBy(x, y)

      // 2 发送请求，获取该小区的房源列表数据
      // 3 展示房源列表
      this.getHouseList(id)
    })

    // 将创建好的覆盖物，添加到地图中
    this.map.addOverlay(label)
  }

  // 封装获取小区房源列表的方法
  async getHouseList(id) {
    const res = await API.get('/houses', {
      params: {
        cityId: id
      }
    })
    this.setState({
      list: res.data.body.list,
      isShowList: true
    })
  }

  // 渲染房源列表
  renderHouseList() {
    // 注意： 列表渲染时，遍历谁，就把key加给谁，而不要放在组件内部结构中
    return this.state.list.map(item => (
      <HouseItem key={item.houseCode} {...item}></HouseItem>
    ))
  }

  render() {
    return (
      <div className={styles.map}>
        {/* 顶部导航栏 */}
        <NavHeader className={styles.mapHeader}>地图找房</NavHeader>
        {/* 地图容器 */}
        <div id="container" className={styles.container} />

        {/* 房屋列表结构 */}
        <div
          className={cls(styles.houseList, {
            [styles.show]: this.state.isShowList
          })}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>{this.renderHouseList()}</div>
        </div>
      </div>
    )
  }
}
