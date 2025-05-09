import './App.css'
import {
  Home,
  Dashboard,
  AllForms,
  FormBuilder,
} from './pages'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/forms' element={<AllForms/>} />
          <Route path='/form/edit' element={<FormBuilder/>}></Route>
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App
