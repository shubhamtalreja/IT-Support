import './App.css';
import { Login } from './Components/Login/Login';
import ITDashboard from './Components/ITDashboard/ITDashboard';
import React, { useState, createContext,useEffect } from 'react';
import UserDashboard from './Components/UserDashboard/UserDashboard';
import { Routes ,Route} from 'react-router-dom';
import ChangePassword from './Components/Login/ChangePassword';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard'
import PageNotFound from './Components/PageNotFound';
import ForgotPassword from './Components/Login/ForgotPassword';
import ResetPassword from './Components/Login/ResetPassword';
export const CustomContext = createContext();

function App() {
  const [imageURL, setImageURL] = useState('')

  useEffect(() => {
    const storedImageURL = localStorage.getItem("imageURL");
    if (storedImageURL) {
      setImageURL(storedImageURL);
    }
  }, []);
  return (
    <CustomContext.Provider value={{imageURL, setImageURL}} >
    <div className="App">
      <Routes>
        <Route>
          <Route path="/" element={<Login/>}/>
          <Route path="/user/dashboard/*" element={<UserDashboard/>}/>
          <Route path="/it/dashboard/*" element={<ITDashboard/>}/>
          <Route path="/admin/dashboard/*" element={<AdminDashboard/>}/>
          <Route path="/changepassword" element={<ChangePassword/>}/>
          <Route path="/forgotpassword/:id/:token" element={<ForgotPassword/>}/>
          <Route path="/resetpassword" element={<ResetPassword/>}/>
        </Route>
        
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </div>
    </CustomContext.Provider>
  );
}

export default App;
