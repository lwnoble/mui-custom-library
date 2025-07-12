import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Radio.css';

const Radio = ({
  selected = false,
  disabled = false,
  size = 'medium',
  label,
  name,
  value,
  onChange,
  className = '',
  style = {},
  animated = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e);
    }
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    // Check if focus is visible (keyboard navigation)
    if (e.target.matches(':focus-visible')) {
      setIsFocusVisible(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsFocusVisible(false);
  };

  const handleKeyDown = (e) => {
    // Show focus-visible on keyboard interaction
    if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
      setIsFocusVisible(true);
    }
  };

  const handleMouseDown = () => {
    // Hide focus-visible on mouse interaction
    setIsFocusVisible(false);
  };

  const getStateClasses = () => {
    const classes = ['radio'];
    
    if (disabled) classes.push('disabled');
    if (isHovered && !disabled) classes.push('hover');
    if (isFocused && !disabled) classes.push('focus');
    if (isFocusVisible && !disabled) classes.push('focus-visible');
    if (selected) classes.push('selected');
    
    classes.push(`size-${size}`);
    if (animated) classes.push('animated');
    
    return classes.join(' ');
  };

  return (
    <label 
      className={`radio-wrapper ${getStateClasses()} ${className}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="radio-input"
      />
      <div className="radio-control">
        <div className="radio-indicator">
          {selected && <div className="radio-dot" />}
        </div>
      </div>
      {label && <span className="radio-label">{label}</span>}
    </label>
  );
};

Radio.propTypes = {
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  animated: PropTypes.bool
};

export default Radio;