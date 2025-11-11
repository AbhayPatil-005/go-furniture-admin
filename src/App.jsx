import { useState } from 'react'
import AdminLogin from './pages/AdminLogin'
import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import HomePage from './pages/HomePage'

function App() {
  const isLoggedIn = useSelector((state)=>state.auth.isLoggedIn);
  return (
    <>
    <Routes>
      <Route path="/admin-login" element={<AdminLogin/>}/>
      <Route path="/home" element={isLoggedIn ? <HomePage/> : <Navigate to="/admin-login" replace/>}>

      
      </Route>
      <Route path='*' element={isLoggedIn ? <HomePage/> : <Navigate to="/admin-login" replace/>}/>
    </Routes>
      
    </>
  )
}

export default App
