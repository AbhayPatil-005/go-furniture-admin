
import AdminLogin from './pages/AdminLogin';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from './components/layouts/HomePage';
import OrdersPage from './pages/OrdersPage';
import ProductForm from './components/products/ProductForm';
import ProductList from './components/products/ProductList';

function App() {
  const isLoggedIn = useSelector((state)=>state.auth.isLoggedIn);
  return (
    <>
    <Routes>
      <Route path="/admin-login" element={<AdminLogin/>}/>
      <Route path="/home" element={isLoggedIn ? <HomePage/> : <Navigate to="/admin-login" replace/>}>
        <Route path='products' element={<ProductList/>}/>
        <Route path='add-product' element={<ProductForm/>}/>
        <Route path='orders' element={<OrdersPage/>}/>
        <Route path=''/>
      </Route>
      <Route path='*' element={isLoggedIn ? <HomePage/> : <Navigate to="/admin-login" replace/>}/>
    </Routes>
      
    </>
  )
}

export default App
