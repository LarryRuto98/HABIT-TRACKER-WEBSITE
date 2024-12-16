import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate that passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // Fetch current database
      const response = await axios.get('/db.json');
      const db = response.data;

      // Check if username already exists
      if (db.users.some(user => user.username === username)) {
        alert('Username already exists. Please choose another.');
        return;
      }

      // Create a new user object
      const newUser = {
        id: db.users.length + 1, // Auto-increment ID
        username,
        password
      };

      // Update the database
      db.users.push(newUser);
      localStorage.setItem('db', JSON.stringify(db)); // Save updated db to localStorage

      alert('Registration successful! Redirecting to login...');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred while registering. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit" className="btn">Register</button>
      </form>
    </div>
  );
};

export default Register;



// const Signup = () => {
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState(''); // State for feedback message

  // //const handleSignup = async (e) => {
  //   e.preventDefault();
  //   try {
      
  //     const response = await fetch('http://localhost:3000/api/signup', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, username, password }),
  //     });

  //     if (response.ok) {
  //       setMessage('Signup successful!');
  //       setEmail('');
  //       setUsername('');
  //       setPassword('');
  //     } else {
  //       const errorData = await response.json();
  //       setMessage(`Error: ${errorData.message}`);
  //     }
  //   } catch (error) {
  //     console.error('Error during signup:', error);
  //     setMessage('An unexpected error occurred. Please try again.');
  //   }
  // };
  // 