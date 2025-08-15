import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon'; // Adjust path as needed
import './Checkbox.css';

export const Checkbox = ({
  checked = false,
  size = 'medium',
  disabled = false,
  onChange,
  className = '',
  id,
  name,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy
}) => {
  const handleChange = (event) => {
    if (!disabled && onChange) {
      onChange(event.target.checked, event);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!disabled && onChange) {
        onChange(!checked, event);
      }
    }
  };

  return (
    <label
      className={`checkbox checkbox--${size} ${checked ? 'checkbox--checked' : ''} ${disabled ? 'checkbox--disabled' : ''} ${className}`}
      htmlFor={id}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="checkbox__input"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      />
      
      <div className="checkbox__box">
        <div className="checkbox__inner">
          <Icon 
            name="check" 
            size={size === 'large' ? 'medium' : size === 'medium' ? 'small' : 'xs'}
            variant="on-button"
            style="solid"
            className={`checkbox__icon ${checked ? 'checkbox__icon--visible' : ''}`}
          />
        </div>
        <div className="checkbox__focus-ring" />
      </div>
    </label>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  'aria-label': PropTypes.string,
  'aria-labelledby': PropTypes.string,
  'aria-describedby': PropTypes.string
};

export default Checkbox;