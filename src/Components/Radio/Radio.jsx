// src/components/Radio/Radio.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Radio as MuiRadio } from '@mui/material';
import './Radio.css';

/**
 * Radio component built on Material-UI Radio with design system styling
 * Requires parent container with id="dds" for scoped styling
 * 
 * @example
 * // Wrap your app or design system components
 * <div id="dds">
 *   <Radio 
 *     checked={selectedValue === 'option1'}
 *     onChange={setSelectedValue}
 *     value="option1"
 *     name="radioGroup"
 *     size="standard"
 *   />
 * </div>
 * 
 * // Large size
 * <Radio 
 *   checked={selectedValue === 'option2'}
 *   onChange={setSelectedValue}
 *   value="option2"
 *   name="radioGroup"
 *   size="large"
 * />
 * 
 * // Disabled state
 * <Radio 
 *   checked={true}
 *   disabled
 *   value="disabled"
 *   name="radioGroup"
 *   size="standard"
 * />
 */
const Radio = React.forwardRef(({
  checked = false,
  onChange = () => {},
  disabled = false,
  size = 'standard',
  name,
  value,
  id,
  className = '',
  'aria-label': ariaLabel,
  autoFocus = false,
  ...props
}, ref) => {
  
  // Handle change events - convert MUI's event to our boolean API
  const handleChange = (event) => {
    if (disabled) return;
    
    const isChecked = event.target.checked;
    
    // Call onChange with the value for radio buttons (or boolean for compatibility)
    if (typeof onChange === 'function') {
      onChange(value || isChecked);
    }
  };

  // Build CSS classes including size variant
  const radioClasses = [
    size, // Add size as class: 'standard' or 'large'
    className
  ].filter(Boolean).join(' ');

  return (
    <MuiRadio
      ref={ref}
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      name={name}
      value={value}
      id={id}
      className={radioClasses}
      inputProps={{
        'aria-label': ariaLabel,
        autoFocus: autoFocus,
      }}
      data-size={size}
      // Hide default MUI icons - our CSS will handle the visuals
      sx={{
        '& .MuiSvgIcon-root': {
          display: 'none',
        },
      }}
      disableRipple={true}
      icon={<span />}
      checkedIcon={<span />}
      {...props}
    />
  );
});

Radio.displayName = 'Radio';

Radio.propTypes = {
  /** Whether the radio is checked */
  checked: PropTypes.bool,
  /** Change handler function - receives value or boolean */
  onChange: PropTypes.func,
  /** Whether the radio is disabled */
  disabled: PropTypes.bool,
  /** Size of the radio - affects visual size within min-target area */
  size: PropTypes.oneOf(['standard', 'large']),
  /** Name attribute for form submission and grouping */
  name: PropTypes.string,
  /** Value attribute for form submission */
  value: PropTypes.string,
  /** ID attribute for the radio */
  id: PropTypes.string,
  /** Additional CSS class names */
  className: PropTypes.string,
  /** Accessible label for screen readers */
  'aria-label': PropTypes.string,
  /** Whether the radio should be focused on mount */
  autoFocus: PropTypes.bool,
};

export default Radio;