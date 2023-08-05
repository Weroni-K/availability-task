import React, { useState } from 'react';
import { format, addDays, parse } from 'date-fns';
import './App.css';
import Axis from './Axis.js';

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const generateFollowingDates = () => {
    const followingDates = [];
    for (let i = 1; i <= 7; i++) {
      const nextDate = addDays(selectedDate, i);
      const formattedDate = selectedDate ? format(nextDate, 'dd/MM') : null;
      const dayOfWeek = selectedDate ? format(nextDate, 'EEE') : null;
      followingDates.push({ date: formattedDate, day: dayOfWeek });
    }
    return followingDates;
  };

  const followingDates = generateFollowingDates();

  const handleDateChange = (event) => {
    const selectedDateString = event.target.value;
  
    if (!selectedDateString) {
      setSelectedDate(new Date());
      return;
    }
  
    const parsedDate = parse(selectedDateString, 'yyyy-MM-dd', new Date());
    setSelectedDate(parsedDate);
  };

  return (
    <div className="availability-feature">
      <div className='titles'>
        <p>Choose a date to adjust your availability for the next 7 days: <input className="calendar-input"
        type="date"
        value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
        onChange={handleDateChange}
        placeholder="Select a date"/>
        </p>
      </div>
      <ul>
        {followingDates.map((item) => (
          <li key={item.date}>
            <div className='day'>
              {item.day} {item.date}
            </div>
            <Axis />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

