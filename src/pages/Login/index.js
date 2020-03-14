import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { withFormik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import NavHeader from '../../components/NavHeader'
import styles from './index.module.css'
import { API, setToken } from '../../utils'
// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            <ErrorMessage
              className={styles.error}
              component="div"
              name="username"
            />
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <ErrorMessage
              className={styles.error}
              component="div"
              name="password"
            />
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}
Login = withFormik({
  // 该配置项，用来为表单组件提供状态，也就是指定表单中每个表单项对应的状态值
  mapPropsToValues: () => ({ username: '', password: '' }),

  // 添加表单校验的配置项：
  // Yup.object() 表示要校验的是一个对象
  // .shape() 表示用来指定该对象的结构（ 有什么属性，以及属性的校验规则 ）
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required('账号为必填项')
      .matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),

    password: Yup.string()
      .required('密码为必填项')
      .matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线')
  }),

  // 表单提交事件
  // 注意： 添加表单校验后，只有在表单校验成功时，才会触发表单提交
  handleSubmit: async (values, { props }) => {
    // 参数 values 就是： 当前表单 用户名 和 密码 的状态对象
    // 第二个参数： 是一个对象，该组件中有一个 props 属性，可以获取到传递给 Login 组件的属性（ 比如： 路由信息 ）
    const { username, password } = values
    const res = await API.post('/user/login', {
      username,
      password
    })

    const { status, description, body } = res.data
     console.log(res)
    if (status === 200) {
      // 登录成功
      // 1 保存token到本地缓存中
      // localStorage.setItem('itcast_token', body.token)
      setToken(body.token)
      // 2 返回到上一个页面
      // 注意： 这是 withFormik 组件的配置项，不是 Login 组件内部，所以，无法通过 this 来获取到路由信息
      // 问题： 那应该如何获取路由信息呢？
      props.history.go(-1)
      // this.props.history.go(-1)
    } else if (status === 400) {
      // 登录失败
      Toast.info(description, 1)
    }
    // else if (status == xxx) {} ...
  }
})(Login)
export default Login
