import React from 'react';
import './SortToggle.css';
import calendarIcon from '../assets/calendar.png';
import energyIcon from '../assets/energy.png';

// this toggle lets us switch between sorting by date and energy
const SortToggle = ({ isEnergySort, onToggle }) => {
  return (
    <div className="sort-toggle-container">
      {/* icons and toggle switch in the middle */}
      <div className="sort-icons">
        {/* calendar icon - brighter when we're sorting by date */}
        <img 
          src={calendarIcon} 
          alt="Sort by date"
          className={`sort-icon ${!isEnergySort ? 'active' : ''}`}
        />
        {/* the actual toggle switch in the middle */}
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={isEnergySort}
            onChange={onToggle}
          />
          <span className="toggle-slider"></span>
        </label>
        {/* energy icon - brighter when we're sorting by energy */}
        <img 
          src={energyIcon}
          alt="Sort by energy"
          className={`sort-icon ${isEnergySort ? 'active' : ''}`}
        />
      </div>
    </div>
  );
};

export default SortToggle; 