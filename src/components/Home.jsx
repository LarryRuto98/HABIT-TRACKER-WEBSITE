import React from 'react';
import '/home/larry/Development/code/HABIT-TRACKER/src/components/Home.css'


const Home = () => {
  return (
    <>
      <main>
        <h1><span className ="white-text">Welcome to</span><span className="yellow-text"> Habit Tracker</span></h1>
        <p>Your journey to building great habits starts here.</p>
        <a href="/dashboard" className="home-btn">Get Started</a>
      </main>
      <footer>
        <div className="footer-content">
          <div>
            <h3>STREET ADDRESS</h3>
            <p>Waiganjo Street, Eldoret, Kenya</p>
          </div>
          <div>
            <h3>EMAIL ADDRESS</h3>
            <p>habittracker@gmail.com</p>
          </div>
          <div>
            <h3>PHONE NUMBER</h3>
            <p>+25471234567</p>
          </div>
        </div>
        <p>&copy; 2024 Habit Tracker. All Rights Reserved</p>
      </footer>
    </>
  );
};

export default Home;
