// src/components/CustomSelect.jsx
import React from 'react';
import "../App.css"

function CustomSelect({
  options = [],
  handleChange,
  value = '',
  placeholder = 'Select...',
  className = '',
  name,
  id,
}) {
  const onChange = (e) => {
    if (handleChange) {
      handleChange(e.target.value, e); // pass value + event
    }
  };

  return (
    <div className={`custom-select-wrapper ${className}`}>
      <select
        className="custom-select"
        onChange={onChange}
        value={value}
        name={name}
        id={id}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CustomSelect;
