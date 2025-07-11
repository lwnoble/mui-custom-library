// src/design-system/components/Input/Input.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Input/Input.css';

/**
 * Input component for the design system
 * Supports both standard and floating label variants with various input types
 * Uses CSS custom properties for theming and provides comprehensive form functionality
 * 
 * @example
 * // Basic text input
 * <Input 
 *   type="text" 
 *   label="Full Name" 
 *   placeholder="Enter your name..." 
 * />
 * 
 * // Floating label variant
 * <Input 
 *   type="email" 
 *   variant="floating"
 *   label="Email Address" 
 *   required
 * />
 * 
 * // Currency input with helper text
 * <Input 
 *   type="currency" 
 *   label="Price" 
 *   placeholder="0.00"
 *   helperText="Enter amount in USD"
 * />
 * 
 * // Error state
 * <Input 
 *   type="email" 
 *   label="Email" 
 *   error
 *   helperText="Please enter a valid email address"
 * />
 * 
 * // Different sizes
 * <Input type="text" label="Small" size="small" />
 * <Input type="text" label="Medium" size="medium" />
 * <Input type="text" label="Large" size="large" />
 */
const Input = React.forwardRef(({
    type = 'text',
    variant = 'standard',
    value = '',
    onChange = () => {},
    onFocus,
    onBlur,
    placeholder = '',
    label,
    helperText,
    error = false,
    required = false,
    disabled = false,
    className = '',
    style = {},
    name,
    id,
    autoComplete,
    autoFocus = false,
    ...props
  }, ref) => {
  // Internal state management
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const inputRef = useRef(null);
  
  // Use forwarded ref or internal ref
  const actualRef = ref || inputRef;

  // Update hasValue when value prop changes
  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  // Handle focus events
  const handleFocus = (event) => {
    setFocused(true);
    if (onFocus) {
      onFocus(event);
    }
  };

  // Handle blur events
  const handleBlur = (event) => {
    setFocused(false);
    if (onBlur) {
      onBlur(event);
    }
  };

  // Handle input changes with type-specific formatting
  const handleChange = (event) => {
    let newValue = event.target.value;
    
    // Apply type-specific formatting
    switch (type) {
      case 'currency':
        // Remove $ prefix, USD suffix, and keep only numbers, dots, and commas
        newValue = newValue.replace(/^\$/, '').replace(/\s*USD\s*$/, '').replace(/[^\d.,]/g, '');
        break;
      case 'percentage':
        // Remove % suffix and keep only numbers and dots
        newValue = newValue.replace(/%$/, '').replace(/[^\d.]/g, '');
        break;
      case 'pixels':
        // Remove px suffix and keep only numbers
        newValue = newValue.replace(/px$/, '').replace(/[^\d]/g, '');
        break;
      case 'number':
        newValue = newValue.replace(/[^\d.-]/g, '');
        break;
      default:
        // No formatting for other types
        break;
    }
    
    setHasValue(!!newValue);
    
    // Create modified event object with formatted value
    const modifiedEvent = {
      ...event,
      target: {
        ...event.target,
        value: newValue
      }
    };
    
    onChange(modifiedEvent);
  };

  // Get the appropriate HTML input type
  const getInputType = () => {
    switch (type) {
      case 'email': 
        return 'email';
      case 'number':
      case 'currency':
      case 'percentage':
      case 'pixels':
        return 'text'; // Use text to allow custom formatting
      case 'color': 
        return 'color';
      default: 
        return 'text';
    }
  };

  // Format display value based on input type
  const getDisplayValue = () => {
    if (!value) return '';
    
    switch (type) {
      case 'currency':
        // Add $ prefix and USD suffix
        let currencyValue = value.replace(/[^\d.,]/g, ''); // Remove any existing formatting
        if (currencyValue) {
          return `$${currencyValue} USD`;
        }
        return '';
      case 'percentage':
        // Add % suffix
        let percentValue = value.replace(/[^\d.]/g, '');
        if (percentValue) {
          return `${percentValue}%`;
        }
        return '';
      case 'pixels':
        // Add px suffix
        let pixelValue = value.replace(/[^\d]/g, '');
        if (pixelValue) {
          return `${pixelValue}px`;
        }
        return '';
      default:
        return value;
    }
  };

  // Build CSS class names
  const inputClasses = [
    'input',
    focused && 'input--focused',
    hasValue && 'input--has-value',
    disabled && 'input--disabled',
    className
  ].filter(Boolean).join(' ');

  const wrapperClasses = [
    'input-wrapper',
    `input-wrapper--${variant}`,
    focused && 'input-wrapper--focused',
    hasValue && 'input-wrapper--has-value',
    disabled && 'input-wrapper--disabled',
    error && 'input-wrapper--error'
  ].filter(Boolean).join(' ');

  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Build input props
  const inputProps = {
    ref: actualRef,
    id: inputId,
    name: name || inputId,
    type: getInputType(),
    value: type === 'color' ? value : getDisplayValue(),
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    disabled,
    placeholder: variant === 'floating' ? ' ' : placeholder,
    className: inputClasses,
    required,
    autoComplete,
    autoFocus,
    style,
    'aria-invalid': error,
    'aria-describedby': helperText ? `${inputId}-helper` : undefined,
    ...props
  };

  return (
    <div data-surface="surface" className={wrapperClasses}>
      {/* Standard variant label */}
      {variant === 'standard' && label && (
        <label htmlFor={inputId} className="Small">
          {label}
          {required && <span className="input-required" aria-label="required">*</span>}
        </label>
      )}
      
      {/* Input field container */}
      <div className="input-field">
        <input {...inputProps} />
        
        {/* Floating variant label */}
        {variant === 'floating' && label && (
          <label htmlFor={inputId} className="Small input-label--floating">
            {label}
            {required && <span className="input-required" aria-label="required">*</span>}
          </label>
        )}
      </div>
      
      {/* Helper text */}
      {helperText && (
        <div 
          id={`${inputId}-helper`}
          className={`input-helper ${error ? 'input-helper--error' : ''}`}
          role={error ? 'alert' : 'note'}
        >
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  /** Type of input field */
  type: PropTypes.oneOf([
    'text', 
    'number', 
    'currency', 
    'percentage', 
    'pixels', 
    'email', 
    'color'
  ]),
  /** Input variant - standard or floating label */
  variant: PropTypes.oneOf(['standard', 'floating']),
  /** Current value of the input */
  value: PropTypes.string,
  /** Change handler function */
  onChange: PropTypes.func,
  /** Focus handler function */
  onFocus: PropTypes.func,
  /** Blur handler function */
  onBlur: PropTypes.func,
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Label text */
  label: PropTypes.string,
  /** Helper text shown below input */
  helperText: PropTypes.string,
  /** Whether the input is in error state */
  error: PropTypes.bool,
  /** Whether the input is required */
  required: PropTypes.bool,
  /** Whether the input is disabled */
  disabled: PropTypes.bool,
  /** Additional CSS class names */
  className: PropTypes.string,
  /** Inline styles */
  style: PropTypes.object,
  /** Name attribute for the input */
  name: PropTypes.string,
  /** ID attribute for the input */
  id: PropTypes.string,
  /** Autocomplete attribute */
  autoComplete: PropTypes.string,
  /** Whether the input should be focused on mount */
  autoFocus: PropTypes.bool,
};

export default Input;