import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import CreateHabit from './components/CreateHabit';
import Journal from './components/Journal';
import Login from './components/Login';
import Signup from './components/Signup';
import Register from './components/Register';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load the logged-in user from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="app-login">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/create-habit"
            element={user ? <CreateHabit /> : <Navigate to="/login" />}
          />
          <Route
            path="/journal"
            element={user ? <Journal /> : <Navigate to="/login" />}
          />

          {/* Redirect any unknown paths to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
