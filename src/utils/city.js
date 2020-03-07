const city_key = 'hkzf_city'

const getCity = () => JSON.parse(localStorage.getItem(city_key))
const setCity = (city) => localStorage.setItem(city_key,JSON.stringify(city))

export { getCity, setCity}
