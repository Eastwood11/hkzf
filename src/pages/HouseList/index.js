import React, { Component } from 'react'
import { Flex } from 'antd-mobile'
import SearchHeader from '../../components/SearchHeader'
import { getCurCity } from '../../utils'
import Filter from './components/Filter'
import styles from './index.module.scss'
export default class HouseList extends Component {
 state = {
   label: ''
 }
 async componentDidMount() {
    const { label } = await getCurCity()
    this.setState({
      label
    })
  }
  render() {
    return (
      <div className={styles.root}>
        <Flex className={styles.headerWrap}>
          <i className="iconfont icon-back"></i>
          <SearchHeader className={styles.header} 
          cityName={ this.state.label } />
        </Flex>
        <Filter />
      </div>
    )
  }
}
