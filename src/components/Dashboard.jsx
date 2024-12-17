import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'

const Dashboard = () => {
  useEffect(() => {
    const setupReminders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/habits'); // Fetch habits from the database
        const habits = response.data;
        const user = JSON.parse(localStorage.getItem('user')); // Get the logged-in user
        const now = new Date();

        // Filter habits that belong to the logged-in user
        const userHabits = habits.filter(habit => habit.user_id === user.id);

        userHabits.forEach(habit => {
          if (habit.reminder && habit.reminderTime) {
            const [hours, minutes] = habit.reminderTime.split(':');
            const reminderTime = new Date();
            reminderTime.setHours(hours, minutes, 0, 0);

            const lastLogged = habit.lastLoggedDate ? new Date(habit.lastLoggedDate) : null;
            const isTodayMissed =
              now > reminderTime &&
              (!lastLogged || now.toDateString() !== lastLogged.toDateString());

            if (isTodayMissed) {
              alert(`Reminder: Don’t forget to log your habit "${habit.name}" today!`);
            } else if (reminderTime > now) {
              const timeout = reminderTime - now; // Calculate delay in ms
              setTimeout(() => {
                alert(`Reminder: Don’t forget to log your habit "${habit.name}"!`);
              }, timeout);
            }
          }
        });
      } catch (error) {
        console.error('Error fetching habits:', error);
      }
    };

    // Initial setup and periodic rechecks every 15 minutes
    const interval = setInterval(setupReminders, 15 * 60 * 1000);
    setupReminders();

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="dashboard-page">
        <header className="dashboard-header">
            <h1 className="dashboard-title"> <span className="yellow-text">HABIT</span> <span className='white-text'>TRACKER</span></h1>
        </header>
     <main className="dashboard-content">
      <h2>Welcome to your Dashboard</h2>
      <p>Manage your habits, track progress, and stay motivated.</p>
      <nav className='dashboard-nav'>
        <ul>
          <li><Link to="/create-habit" className="dashboard-btn">Create Habit</Link></li>
          <li><Link to="/journal" className="dashboard-btn">Habit Journaling</Link></li>
          <li><Link to="/" className="dashboard-btn">Back to Home</Link></li>
        </ul>
      </nav>
      </main>
    </div>
  );
};

export default Dashboard;