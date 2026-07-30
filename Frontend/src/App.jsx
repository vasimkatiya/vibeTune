import React from 'react'
import { Toaster } from 'react-hot-toast'
import Signup from './auth/SIgnup.jsx'
import { Navigate, Route, Router, Routes } from 'react-router-dom'
import Login from './auth/Login.jsx'
import Home from './Home/Home.jsx'
import { useState } from 'react'
import RefreshHandler from './config/RefreshHandler.jsx'

const App = () => {

  const [IsAuth, setIsAuth] = useState(false)

  const protectRoutes = (element)=>{
    return IsAuth ? element : <Navigate to="/login" />
  }

  return (
    <>
      <Toaster position='top' />
      <RefreshHandler setisAuth={setIsAuth} />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={protectRoutes(<Home />)} />
      </Routes>
    </>
  )
}

export default App