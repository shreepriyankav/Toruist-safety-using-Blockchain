import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TouristDashboard from './components/TouristDashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('userType');
    if (token) {
      setIsAuthenticated(true);
      setUserType(type);
    }
  }, []);

  const handleLogin = (type) => {
    setIsAuthenticated(true);
    setUserType(type);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUserType(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? 
            (userType === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) 
            : <Login onLogin={handleLogin} />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
        } />
        <Route path="/admin/login" element={
          isAuthenticated && userType === 'admin' ? 
            <Navigate to="/admin" /> 
            : <AdminLogin onLogin={handleLogin} />
        } />
        <Route path="/dashboard" element={
          isAuthenticated && userType === 'tourist' ? 
            <TouristDashboard onLogout={handleLogout} /> 
            : <Navigate to="/login" />
        } />
        <Route path="/admin" element={
          isAuthenticated && userType === 'admin' ? 
            <AdminDashboard onLogout={handleLogout} /> 
            : <Navigate to="/admin/login" />
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
