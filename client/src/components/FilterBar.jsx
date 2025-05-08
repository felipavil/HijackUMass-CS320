import React from 'react';

function FilterBar({ from, to, date, seats, setFrom, setTo, setDate, setSeats, onApply }) {
  return (
    <div className="flex-container-column">
      <input className="input-box" placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} />
      <input className="input-box" placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
      <input className="input-box" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input className="input-box" type="number" min="1" placeholder="Min Seats" value={seats} onChange={(e) => setSeats(e.target.value)} />
      <button className="red-button" onClick={onApply}>Apply Filters</button>
    </div>
  );
}

export default FilterBar;