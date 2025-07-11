// src/components/Slider/Slider.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Slider as MuiSlider } from '@mui/material';
import './Slider.css';

/**
 * Slider component built on Material-UI Slider with design system styling
 * Requires parent container with id="dds" for scoped styling
 * 
 * @example
 * // Basic slider
 * <div id="dds">
 *   <Slider 
 *     value={value}
 *     onChange={setValue}
 *   />
 * </div>
 * 
 * // Small size
 * <Slider 
 *   value={value}
 *   onChange={setValue}
 *   size="small"
 * />
 * 
 * // Discrete slider with steps
 * <Slider 
 *   value={value}
 *   onChange={setValue}
 *   step={10}
 *   marks
 *   min={0}
 *   max={100}
 * />
 * 
 * // Range slider
 * <Slider 
 *   value={[20, 80]}
 *   onChange={setValue}
 *   valueLabelDisplay="auto"
 * />
 * 
 * // Vertical slider
 * <Slider 
 *   orientation="vertical"
 *   value={value}
 *   onChange={setValue}
 *   sx={{ height: 200 }}
 * />
 * 
 * // Custom marks
 * <Slider 
 *   value={value}
 *   onChange={setValue}
 *   marks={[
 *     { value: 0, label: '0°C' },
 *     { value: 20, label: '20°C' },
 *     { value: 37, label: '37°C' },
 *     { value: 100, label: '100°C' }
 *   ]}
 * />
 */
const Slider = React.forwardRef(({
  value,
  onChange = () => {},
  disabled = false,
  size = 'default',
  orientation = 'horizontal',
  min = 0,
  max = 100,
  step = 1,
  marks = false,
  track = 'normal',
  valueLabelDisplay = 'off',
  valueLabelFormat,
  name,
  className = '',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-valuetext': ariaValueText,
  getAriaLabel,
  getAriaValueText,
  ...props
}, ref) => {
  
  // Handle change events
  const handleChange = (event, newValue, activeThumb) => {
    if (disabled) return;
    
    if (typeof onChange === 'function') {
      onChange(newValue, event, activeThumb);
    }
  };

  // Build CSS classes including size and disabled state
  const sliderClasses = [
    'MuiSlider-root',
    size !== 'default' && size, // Add size class if not default
    disabled && 'disabled',
    orientation === 'vertical' && 'vertical',
    className
  ].filter(Boolean).join(' ');

  return (
    <MuiSlider
      ref={ref}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      orientation={orientation}
      min={min}
      max={max}
      step={step}
      marks={marks}
      track={track}
      valueLabelDisplay={valueLabelDisplay}
      valueLabelFormat={valueLabelFormat}
      name={name}
      className={sliderClasses}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-valuetext={ariaValueText}
      getAriaLabel={getAriaLabel}
      getAriaValueText={getAriaValueText}
      data-size={size}
      data-orientation={orientation}
      disableSwap={false}
      {...props}
    />
  );
});

Slider.displayName = 'Slider';

Slider.propTypes = {
  /** Current value of the slider (number for single, array for range) */
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  /** Change handler function - receives (value, event, activeThumb) */
  onChange: PropTypes.func,
  /** Whether the slider is disabled */
  disabled: PropTypes.bool,
  /** Size of the slider */
  size: PropTypes.oneOf(['default', 'small']),
  /** Orientation of the slider */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /** Minimum value */
  min: PropTypes.number,
  /** Maximum value */
  max: PropTypes.number,
  /** Step increment */
  step: PropTypes.number,
  /** Whether to show marks (boolean or array of mark objects) */
  marks: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.node
    }))
  ]),
  /** Track display ('normal', 'inverted', or false) */
  track: PropTypes.oneOf(['normal', 'inverted', false]),
  /** When to display value label ('on', 'auto', 'off') */
  valueLabelDisplay: PropTypes.oneOf(['on', 'auto', 'off']),
  /** Format function for value label */
  valueLabelFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /** Name attribute for form submission */
  name: PropTypes.string,
  /** Additional CSS class names */
  className: PropTypes.string,
  /** Accessible label for screen readers */
  'aria-label': PropTypes.string,
  /** ID of element that labels the slider */
  'aria-labelledby': PropTypes.string,
  /** Text alternative for current value */
  'aria-valuetext': PropTypes.string,
  /** Function to generate aria-label for thumb */
  getAriaLabel: PropTypes.func,
  /** Function to generate aria-valuetext for thumb */
  getAriaValueText: PropTypes.func,
};

export default Slider;