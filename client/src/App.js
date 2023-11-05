import Navbar from './components/index';
import Sidebar from './components/Sidebar';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import "./App.css"
import Home from './pages';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import Login from './pages/Login';
import Register from './pages/Register';
import User from './pages/User';
import History from './pages/History';
import Test from './pages/test';
import IDF from './pages/IDF';
import Network from './pages/Network';
import Licence from './pages/Licence';
import Axios from "axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userDataRole, setUserDataRole] = useState(null);
 


  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/api/check-login", { withCredentials: true });
        if (response.data.loggedIn) {
          setIsLoggedIn(true);
          setUserDataRole(response.data.userRole);          
        } else {
          setIsLoggedIn(false);
          setUserDataRole(0);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  console.log('User role:', userDataRole);
  console.log('User logged:', isLoggedIn);

  if (isLoggedIn === null) {
    // Loading state while waiting for the API response
    return <div>Loading user...</div>;
  }

  if (userDataRole === null) {
    // Loading state while waiting for the API response
    return <div>Loading role...</div>;
  }

  // Private Route component
  const PrivateRoute = ({ Element, includeSidebar }) => {
    if (isLoggedIn){
      return (
        <div className="app-container">
        {includeSidebar && <Sidebar />}
        <Element />
        </div>
      );
    }
    else{ 
      return <Navigate to="/login" />
    }
  };

  // Admin Route component
  const AdminRoute = ({ Element , includeSidebar }) => {
    if (isLoggedIn && userDataRole === 2){
      return (
        <div className="app-container">
        {includeSidebar && <Sidebar />}
        <Element />
        </div>
      )
    }
    else{ 
      return <Navigate to="/dashboard" />
    }
  };

  

  return (
    <Router>
      <Routes> 
        {/* Private Routes */}
        <Route path="/dashboard" element={<PrivateRoute Element={Dashboard} includeSidebar />} />
        <Route path="/devices" element={<PrivateRoute Element={Devices}  includeSidebar/>} />
        <Route path="/idf" element={<PrivateRoute Element={IDF}  includeSidebar/>} />
        <Route path="/network" element={<PrivateRoute Element={Network}  includeSidebar/>} />
        <Route path="/licences" element={<PrivateRoute Element={Licence}  includeSidebar/>} />
        <Route path="/history" element={<PrivateRoute Element={History}  includeSidebar/>} />
        {/* Admin Routes */}
        <Route path="/users" element={<AdminRoute Element={User}  includeSidebar/>} />
        {/* Other Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}


export default App;
