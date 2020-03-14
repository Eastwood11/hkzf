import React from 'react'

import cls from 'classnames'

import Types from 'prop-types'

import { BASE_URL } from '../../utils'

import styles from './index.module.scss'

function HouseItem({ houseImg, title, desc, tags, price, style, onClick }) {
  return (
    <div className={styles.house} style={style} onClick={onClick}>
      <div className={styles.imgWrap}>
        <img className={styles.img} src={`${BASE_URL}${houseImg}`} alt="" />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.desc}>{desc}</div>
        <div>
          {tags.map((item, index) => {
            const tagClass = index > 2 ? styles.tag3 : styles[`tag${index + 1}`]
            return (
              <span key={index} className={cls(styles.tag, tagClass)}>
                {item}
              </span>
            )
          })}
        </div>
        <div className={styles.price}>
          <span className={styles.priceNum}>{price}</span> 元/月
        </div>
      </div>
    </div>
  )
}

// 添加 props 校验
HouseItem.propTypes = {
  houseImg: Types.string.isRequired,
  title: Types.string.isRequired,
  desc: Types.string.isRequired,
  tags: Types.array,
  price: Types.number.isRequired,
  style: Types.object,
  onClick: Types.func
}

export default HouseItem
