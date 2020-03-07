import React from 'react'
import { Toast } from 'antd-mobile'
import './index.scss'
import axios from 'axios'
import { List, AutoSizer } from 'react-virtualized'
import NavHeader from '../../components/NavHeader'
import { getCurCity, setCity } from '../../utils'

function fortmatCityList(list) {
  const cityList = {}
  list.forEach(item => {
    const firstLetter = item.short.slice(0, 1)
    if (firstLetter in cityList) {
      cityList[firstLetter].push(item)
    } else {
      cityList[firstLetter] = [item]
    }
  })
  const cityIndex = Object.keys(cityList).sort()
  return {
    cityList,
    cityIndex
  }
}

function formatCategoryName(name) {
  switch (name) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return name.toUpperCase()
  }
}

const CATE_NAME_HEIGHT = 36
const CITY_NAME_HEIGHT = 50

export default class CityList extends React.Component {
  state = {
    cityList: {},
    cityIndex: [],
    activeIndex: 0,
    isClicked: false
  }
  listRef = React.createRef()

  async componentDidMount() {
    await this.getCityList()
    this.listRef.current.measureAllRows()
  }

  async getCityList() {
    const res = await axios.get('http://localhost:8080/area/city', {
      params: {
        level: 1
      }
    })

    const { cityList, cityIndex } = fortmatCityList(res.data.body)

    const hotRes = await axios.get('http://localhost:8080/area/hot')
    cityList['hot'] = hotRes.data.body
    cityIndex.unshift('hot')

    const curCity = await getCurCity()
    cityList['#'] = [curCity]
    cityIndex.unshift('#')
    this.setState(
      {
        cityList,
        cityIndex
      }
    )
  }

  rowRenderer = ({ key, index, style }) => {
    const { cityList, cityIndex } = this.state
    const curCityList = cityList[cityIndex[index]]
    const handleClick = item => {
      if (['北京', '上海', '广州', '深圳'].indexOf(item.label) > -1) {
        const curCity = {
          label: item.label,
          value: item.value
        }
        setCity(curCity)
        this.props.history.go(-1)
      } else {
        Toast.info('该城市暂无房源数据', 1)
      }
    }

    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCategoryName(cityIndex[index])}</div>
        {curCityList.map(item => (
          <div
            className="name"
            key={item.value}
            onClick={() => handleClick(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }

  calcRowHeight = ({ index }) => {
    const { cityList, cityIndex } = this.state
    const curCityList = cityList[cityIndex[index]]
    return CATE_NAME_HEIGHT + CITY_NAME_HEIGHT * curCityList.length
  }

  renderCityIndex() {
    const { cityIndex, activeIndex } = this.state
    const handleClick = index => {
      this.setState({
        isClicked: true,
        activeIndex: index
      })
      this.listRef.current.scrollToRow(index)
    }

    return cityIndex.map((item, index) => (
      <li
        key={item}
        className="city-index-item"
        onClick={() => handleClick(index)}
      >
        <span className={activeIndex === index ? 'index-active' : ''}>
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    ))
  }
  onRowsRendered = ({ startIndex }) => {
    if (!this.state.isClicked) {
      if (this.state.activeIndex !== startIndex) {
        this.setState({
          activeIndex: startIndex
        })
      }
    } else {
      this.setState({
        isClicked: false
      })
    }
  }

  render() {
    return (
      <div className="citylist">
        <NavHeader>城市选择</NavHeader>
        <ul className="city-index">{this.renderCityIndex()}</ul>
        <AutoSizer>
          {({ height, width }) => (
            <List
              className='list'
              ref={this.listRef}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.calcRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
      </div>
    )
  }
}
