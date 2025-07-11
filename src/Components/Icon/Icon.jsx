// src/design-system/components/Icon/Icon.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Icon.css';

/**
 * Icon component that renders Font Awesome icons with design system styling
 * Uses a wrapper div structure for consistent sizing and background
 * 
 * @example
 * // Basic usage
 * <Icon name="star" />
 * 
 * // Different sizes
 * <Icon name="heart" size="xs" />
 * <Icon name="user" size="large" />
 * 
 * // Different Font Awesome styles
 * <Icon name="star" style="solid" />    // fas fa-star (default)
 * <Icon name="star" style="regular" />  // far fa-star
 * <Icon name="star" style="light" />    // fal fa-star (Pro only)
 * <Icon name="github" style="brands" /> // fab fa-github
 */
const Icon = ({ 
  name = 'star',
  size = 'medium',
  style = 'solid',
  variant = 'default',
  className = '',
  ...props 
}) => {
  // Font Awesome style prefixes
  const styleMap = {
    solid: 'fas',      // Font Awesome Solid (free)
    regular: 'far',    // Font Awesome Regular (free)
    light: 'fal',      // Font Awesome Light (pro)
    thin: 'fat',       // Font Awesome Thin (pro)
    duotone: 'fad',    // Font Awesome Duotone (pro)
    brands: 'fab'      // Font Awesome Brands (free)
  };

  // Build the icon wrapper classes
  const wrapperClasses = [
    'icon',
    `icon--${size}`,
    className
  ].filter(Boolean).join(' ');

  // Build the Font Awesome icon classes
  const iconClasses = [
    styleMap[style] || 'fas',
    `fa-${name}`
  ].join(' ');

  return (
    <div 
      className={wrapperClasses} 
      data-icon={variant !== 'default' ? variant : undefined}
      {...props}
    >
      <i className={iconClasses}></i>
    </div>
  );
};

Icon.propTypes = {
  /** Name of the Font Awesome icon (without fa- prefix) */
  name: PropTypes.string.isRequired,
  /** Size of the icon wrapper */
  size: PropTypes.oneOf(['xs', 'small', 'medium', 'large', 'xl', 'xxl']),
  /** Font Awesome icon style */
  style: PropTypes.oneOf(['solid', 'regular', 'light', 'thin', 'duotone', 'brands']),
  /** Visual variant of the icon */
  variant: PropTypes.oneOf([
    'default',
    'quiet', 
    'error',
    'warning',
    'success',
    'info',
    'primary',
    'secondary',
    'tertiary',
    'on-button'
  ]),
  /** Additional CSS class names */
  className: PropTypes.string,
};

export default Icon;