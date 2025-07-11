// src/components/Switch/Switch.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Switch as MuiSwitch } from '@mui/material';
import Icon from '../Icon/Icon'; // Import your Icon component
import './Switch.css';

/**
 * Switch component built on Material-UI Switch with design system styling
 * Requires parent container with id="dds" for scoped styling
 * 
 * @example
 * // Wrap your app or design system components
 * <div id="dds">
 *   <Switch 
 *     checked={isOn}
 *     onChange={setIsOn}
 *     variant="small"
 *   />
 * </div>
 * 
 * // Large variant
 * <Switch 
 *   checked={isOn}
 *   onChange={setIsOn}
 *   variant="large"
 * />
 * 
 * // iOS style
 * <Switch 
 *   checked={isOn}
 *   onChange={setIsOn}
 *   variant="ios"
 * />
 * 
 * // Android style
 * <Switch 
 *   checked={isOn}
 *   onChange={setIsOn}
 *   variant="android"
 * />
 * 
 * // Icon variant with Font Awesome icons
 * <Switch 
 *   checked={isOn}
 *   onChange={setIsOn}
 *   variant="icon"
 * />
 * 
 * // Disabled state
 * <Switch 
 *   checked={true}
 *   disabled
 *   variant="large"
 * />
 */
const Switch = React.forwardRef(({
  checked = false,
  onChange = () => {},
  disabled = false,
  variant = 'small',
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
    
    // Call onChange with just the boolean value for consistency
    if (typeof onChange === 'function') {
      onChange(isChecked);
    }
  };

  // Build CSS classes including variant and disabled state
  const switchClasses = [
    variant, // Add variant as class: 'small', 'large', 'icon', 'ios', 'android'
    disabled && 'disabled', // Add 'disabled' class when disabled
    className
  ].filter(Boolean).join(' ');

  return (
    <MuiSwitch
      ref={ref}
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      name={name}
      value={value}
      id={id}
      className={switchClasses}
      inputProps={{
        'aria-label': ariaLabel,
        autoFocus: autoFocus,
      }}
      data-variant={variant}
      disableRipple={true}
      // For icon variant, customize the thumb to include Icon component
      slots={variant === 'icon' ? {
        thumb: (props) => (
          <span {...props} className={`${props.className} MuiSwitch-thumb`}>
            {checked ? (
              <Icon 
                name="check" 
                style="solid" 
                variant="on-button" 
                size="small"
                className="switch-thumb-icon switch-thumb-icon--check"
              />
            ) : (
              <Icon 
                name="times" 
                style="solid" 
                variant="on-button" 
                size="small"
                className="switch-thumb-icon switch-thumb-icon--times"
              />
            )}
          </span>
        )
      } : undefined}
      {...props}
    />
  );
});

Switch.displayName = 'Switch';

Switch.propTypes = {
  /** Whether the switch is checked (on) */
  checked: PropTypes.bool,
  /** Change handler function - receives boolean value */
  onChange: PropTypes.func,
  /** Whether the switch is disabled */
  disabled: PropTypes.bool,
  /** Variant of the switch - affects style and size */
  variant: PropTypes.oneOf(['small', 'large', 'icon', 'ios', 'android']),
  /** Name attribute for form submission */
  name: PropTypes.string,
  /** Value attribute for form submission */
  value: PropTypes.string,
  /** ID attribute for the switch */
  id: PropTypes.string,
  /** Additional CSS class names */
  className: PropTypes.string,
  /** Accessible label for screen readers */
  'aria-label': PropTypes.string,
  /** Whether the switch should be focused on mount */
  autoFocus: PropTypes.bool,
};

export default Switch;