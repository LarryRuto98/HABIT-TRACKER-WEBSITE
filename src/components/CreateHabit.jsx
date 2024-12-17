import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateHabit.css';

const CreateHabit = () => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

 
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user) {
        alert('User not found. Please log in.');
        return;
      }

      const imageUrl = image ? URL.createObjectURL(image) : '';

      const newHabit = {
        user_id: user.id,
        name,
        goal,
        startDate,
        endDate,
        reminder: reminderTime !== '',
        reminderTime,
        lastLoggedDate: null,
        imageUrl,
      };

      await axios.post('http://localhost:5000/habits', newHabit);
      alert('Habit created successfully!');

      setName('');
      setIcon('');
      setGoal('');
      setStartDate('');
      setEndDate('');
      setReminderTime('');
      setImage(null);
      setPreviewImage(null);

      navigate('/journal');
    } catch (error) {
      console.error('Error creating habit:', error);
      alert('An error occurred while creating the habit. Please try again later.');
    }
  };

  return (
    <div className="create-habit-container">
    <h1> <span className='yellow-text'>HABIT</span> <span className='white-text'>BREAKER</span></h1>
      <h2 className="create-habit-title">Create Habit</h2>
      <form onSubmit={handleSubmit} className="create-habit-form">
        {/* Habit Name */}
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />

        

        {/* Other fields */}
        <label>
          Goal:
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          >
            <option value="">--Select Goal--</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label>
          Reminder Time:
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </label>
        <label>
          Upload Image:
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        {previewImage && (
          <div>
            <img src={previewImage} alt="Preview" className="image-preview" />
          </div>
        )}
        <div className="button-group">
          <button type="submit" className="create-habit-btn">Create Habit</button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/Journal')}
          >
            Go to Habit Journaling
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateHabit;
