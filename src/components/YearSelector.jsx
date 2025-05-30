import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

function YearSelector({ years, selectedYear, onSelectYear }) {
  return (
    <div className="year-selector">
      <FontAwesomeIcon icon={faCalendarDays} className="year-icon" />
      <select value={selectedYear} onChange={(e) => onSelectYear(e.target.value)}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

export default YearSelector;