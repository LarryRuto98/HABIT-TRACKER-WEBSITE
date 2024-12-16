import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Journal.css';

const Journal = () => {
  const [db, setDb] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [habit, setHabit] = useState('');
  const [note, setNote] = useState('');
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitsResponse, journalsResponse] = await Promise.all([
          axios.get('http://localhost:5000/habits'),
          axios.get('http://localhost:5000/journals'),
        ]);

        const user = JSON.parse(localStorage.getItem('user'));
        const userHabits = habitsResponse.data.filter(
          (habit) => habit.user_id === user.id
        );

        setHabits(userHabits);
        setDb({
          habits: userHabits,
          journals: journalsResponse.data,
        });
        setJournalEntries(journalsResponse.data);
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  const handleAddEntry = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('User not found. Please log in.');
        return;
      }

      const selectedHabit = db.habits.find((h) => h.name === habit);

      if (!selectedHabit) {
        alert('Habit not found for this user.');
        return;
      }

      const newEntry = {
        id: db.journals.length + 1,
        user_id: user.id,
        habit_id: selectedHabit.id,
        reflection: note,
        date: new Date().toISOString(),
      };

      const updatedJournals = [...journalEntries, newEntry];
      setJournalEntries(updatedJournals);

      await axios.post('http://localhost:5000/journals', newEntry);

      setHabit('');
      setNote('');
    } catch (error) {
      console.error('Error adding journal entry:', error);
      alert('Failed to add entry. Please try again later.');
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/journals/${entryId}`
      );

      if (response.status === 200) {
        setJournalEntries((prev) => prev.filter((entry) => entry.id !== entryId));
        alert('Entry deleted successfully!');
      } else {
        throw new Error('Failed to delete entry');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again later.');
    }
  };

  const handleLogHabit = async (habitId) => {
    const now = new Date().toISOString().split('T')[0];
    try {
      const response = await axios.get(`http://localhost:5000/habits/${habitId}`);
      const updatedHabit = { ...response.data, lastLoggedDate: now };

      await axios.put(`http://localhost:5000/habits/${habitId}`, updatedHabit);
      alert('Habit logged successfully!');
      setHabits((prev) =>
        prev.map((habit) => (habit.id === habitId ? updatedHabit : habit))
      );
    } catch (error) {
      console.error('Error logging habit:', error);
      alert('Failed to log habit. Please try again later.');
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await axios.delete(`http://localhost:5000/habits/${habitId}`);
      setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
      alert('Habit deleted successfully!');
    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Failed to delete habit. Please try again later.');
    }
  };

  if (!db) {
    return <div>Loading...</div>;
  }

  return (
    <div className="journal-container">
      <h1> <span className='yellow-text'>HABIT</span> <span className='white-text'>BREAKER</span></h1>
      <h2 className="title">Habit Journaling</h2>

      {/* Journal Entry Form */}
      <form onSubmit={handleAddEntry} className="form">
        <label>
          Select Habit:
          <select
            value={habit}
            onChange={(e) => setHabit(e.target.value)}
            required
          >
            <option value="">--Select Habit--</option>
            {habits.map((h) => (
              <option key={h.id} value={h.name}>
                {h.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Reflection/Note:
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add your daily reflection here"
            required
          />
        </label>
        <br />
        <button type="submit" className="btn-submit-btn">
          Add Entry
        </button>
      </form>

      {/* Log Habit Section */}
      <div className="log-habit-section">
        <h3 className="log-habit-title">Log Habits</h3>
        <ul className="habit-list">
          {habits.map((habit) => (
            <li key={habit.id} className="habit-item">
              <span className="habit-name">{habit.name}</span>
              <button
                onClick={() => handleLogHabit(habit.id)}
                className="btn log-btn"
              >
                Log Habit
              </button>
              <button
                onClick={() => handleDeleteHabit(habit.id)}
                className="btn delete-btn"
              >
                Delete Habit
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Display Journal Entries */}
      <div className="journal-entries">
        <h3 className="journal-title">Journal Entries</h3>
        <ul>
          {journalEntries.map((entry) => {
            const habitDetails = habits.find((h) => h.id === entry.habit_id);
            return (
              <li key={entry.id} className="entry-item">
                <div className="entry-header">
                  {habitDetails && (
                    <>
                      <span
                        className="icon-preview"
                        style={{
                          fontSize: '2rem',
                          color: habitDetails.color,
                        }}
                      >
                        {habitDetails.icon}
                      </span>
                      <strong className="habit-name">{habitDetails.name}</strong>
                    </>
                  )}
                </div>
                <div className="entry-content">
                  <strong>Note:</strong> {entry.reflection} <br />
                  <strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="btn delete-btn"
                  >
                    Delete Entry
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Journal;
