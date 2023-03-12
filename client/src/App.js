// import './App.css';
import { useContext } from "react";
import { Route, Routes, redirect, Navigate } from "react-router-dom";
import AuthForm from "./components/Auth/AuthForm";
// const axios = require('axios')
import MainNavigation from "./components/Layout/MainNavigation";
import Me from './components/Profil/Me'
import AuthContext from "./store/auth-context";
import NewReq from './components/newReq/NewReq'
import Admin from "./components/admin/Admin";
import AdminOpen from "./components/admin/AdminOpen";
import ChangeDetails from './components/ChangeDetails/ChangeDetails'

const App = () => {
  const authCtx = useContext(AuthContext)

  return (
    <div className='App'>
      <MainNavigation />
      <Routes>
        <Route path='/' element={<AuthForm />} />
        {/* {authCtx.isLoggedIn && <Route path='/signup' element={<Signup />} />} */}
        {authCtx.isLoggedIn &&<Route path='/changeDetails' element={<ChangeDetails />} /> }
        {authCtx.isLoggedIn &&<Route path='/me' element={<Me />} />}
        {authCtx.isLoggedIn &&<Route path='/admin' element={<Admin />} />}
        {authCtx.isLoggedIn &&<Route path='/admin/open' element={<AdminOpen />} />}
        {authCtx.isLoggedIn &&<Route path='/req/req1' element={<NewReq reqName="בקשת השחרה" />} />}
        {authCtx.isLoggedIn &&<Route path='/req/req2' element={<NewReq reqName="בקשת אישור כניסה רגלי/ רכוב לבה''ד"/>} />}
        {authCtx.isLoggedIn &&<Route path='/req/req3' element={<NewReq reqName="בקשת קידוד חוגר" />} />}
        {authCtx.isLoggedIn &&<Route path='/req/req4' element={<NewReq reqName="בקשת טופס חתימה על שו''ס" />} />}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </div>
  )
}

export default App;
