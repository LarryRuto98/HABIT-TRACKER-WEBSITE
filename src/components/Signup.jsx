import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/home/larry/Development/code/HABIT-TRACKER/src/components/Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate function

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (response.ok) {
        setMessage('Signup successful!');
        setEmail('');
        setUsername('');
        setPassword('');

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/Login'); // Adjust the route as per your app
        }, 1000);
      } else {
        const errorData = await response.json().catch(() => ({
          message: 'Unknown error occurred',
        }));
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setMessage('An error occurred while signing up. Please try again.');
    }
  };

  return (
    <>
      <div className="signup-container">
        <h1 className="title">
          HABIT <span className="white-text">TRACKER</span>
        </h1>
      </div>
      <h2 className="form-header"><span className='white-text'>Create Your</span> Account</h2>
      <form onSubmit={handleSignup} className="signup-form">
        <label className="form-label">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <br />
        <label className="form-label">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <br />
        <label className="form-label">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <br />
        <button type="submit" className="create-btn">
          Create Account
        </button>
      </form>
      {/* Message display */}
      <div>
        {message && <p className="message">{message}</p>}
      </div>
    </>
  );
};

export default Signup;
