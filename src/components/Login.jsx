import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file for login-specific styles

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Fetch the entire database
      const response = await axios.get('/db.json'); // Fetch the whole file
      const db = response.data;

      // Access the users array
      const users = db.users;

      // Validate credentials
      const user = users.find((u) => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
        onLogin(user); // Pass user data to parent component
        alert('Login successful!');
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        alert('Invalid username or password!');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred while logging in. Please try again later.');
    }
  };

  const handleCreateAccount = () => {
    navigate('/signup'); // Redirect to the signup page
  };

  return (
    <div className="login-page">
      <header className="login-page-header">
         <h1><span className="yellow-text">HABIT</span> <span className="white-text">TRACKER</span></h1>
        </header>
      <h2><span className='yellow-text'>Login To</span> <span className='white-text'>Your Account</span></h2>
      <form onSubmit={handleLogin} className='login-form'>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
      <p className="create-account-text">
        Don't have an account?{' '}
        <button onClick={handleCreateAccount} className="create-account-btn">
          Create Account
        </button>
      </p>
    </div>
  );
};

export default Login;
