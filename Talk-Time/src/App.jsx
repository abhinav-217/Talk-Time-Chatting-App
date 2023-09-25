import React, { createContext, useContext } from 'react'
import Register from './Pages/Register'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Chat from './Pages/Chat'
import './App.css'
import { loginRoute, registerRoute, chatRoute } from './routes/clientRoutes'
const App = () => {
  return (
    <>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path={`${registerRoute}`} element={<Register />} />
            <Route exact path={`${loginRoute}`} element={<Login />} />
            <Route exact path={`${chatRoute}`} element={<Chat />} />
          </Routes>
    </>
  )
}

export default App
