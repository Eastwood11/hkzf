import React from 'react'
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'

export default function App() {
  return <Router>
    <div className="app">
        <Route path='/' exact render={()=><Redirect to='/home/index' />}></Route>
        <Route path='/citylist' component={CityList}></Route>
        <Route path='/home' component={Home}></Route>
        <Route path='/map' component={Map}></Route>
    </div>
  </Router>
}