const key = 'itcast_token'
const setToken = (token) => localStorage.setItem(key,token)
const getToken = () => localStorage.getItem(key)
const removeToken = () => localStorage.removeItem(key)
const isAuth = () => !!getToken()
export { setToken, getToken, removeToken, isAuth }

