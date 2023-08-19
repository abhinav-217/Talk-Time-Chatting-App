import React from 'react'
import Register from './Pages/Register'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
const App = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/auth/register" element={<Register/>}/>
        <Route exact path="/auth/login" element={<Login/>}/>
      </Routes>
    </>
  )
}

export default App
