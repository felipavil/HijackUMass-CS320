import React from 'react';


const TimeDropdown = () => {
  const generateTimeOptions = () => {
    const options = [];
    const intervals = [0, 30];

    for (let hour = 0; hour < 24; hour++) {
      intervals.forEach((minute) => {
        const period = hour < 12 ? 'AM' : 'PM';
        let displayHour = hour % 12;
        displayHour = displayHour === 0 ? 12 : displayHour;
        const displayMinute = minute.toString().padStart(2, '0');
        const timeLabel = `${displayHour}:${displayMinute} ${period}`;
        options.push(
          <option key={`${hour}-${minute}`} value={timeLabel}>
            {timeLabel}
          </option>
        );
      });
    }
    return options;
  };

  return (
    <>
      
      <select id="time" name="time" className='small-font'>
        {generateTimeOptions()}
      </select>
      
    </ >
  );
};

export default TimeDropdown;
