import React from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'

export default function App() {
  return <Router>
    <div className="app">
        <Route path='/' component={Home}></Route>
        <Route path='/citylist' component={CityList}></Route>
    </div>
  </Router>
}