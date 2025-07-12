// src/design-system/components/Icon/Icon.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Icon.css';

/**
 * Icon component that renders Font Awesome icons with design system styling
 * Supports all design system color variants and sizes
 * 
 * @example
 * // Basic usage
 * <Icon name="star" />
 * 
 * // Different sizes
 * <Icon name="heart" size="xs" />
 * <Icon name="user" size="large" />
 * 
 * // Different colors/variants
 * <Icon name="check" variant="success" />
 * <Icon name="warning" variant="warning" />
 * <Icon name="info" variant="info" />
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
  onClick,
  disabled = false,
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
    variant !== 'default' && `icon--${variant}`,
    disabled && 'icon--disabled',
    onClick && 'icon--interactive',
    className
  ].filter(Boolean).join(' ');

  // Build the Font Awesome icon classes
  const iconClasses = [
    styleMap[style] || 'fas',
    `fa-${name}`
  ].join(' ');

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <div 
      className={wrapperClasses} 
      data-icon={variant}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      {...props}
    >
      <i className={iconClasses} aria-hidden="true"></i>
    </div>
  );
};

Icon.propTypes = {
  /** Name of the Font Awesome icon (without fa- prefix) */
  name: PropTypes.string.isRequired,
  /** Size of the icon wrapper */
  size: PropTypes.oneOf([
    'extra-small', 
    'xs', 
    'small', 
    'medium', 
    'large', 
    'extra-large', 
    'xl', 
    'extra-extra-large', 
    'xxl'
  ]),
  /** Font Awesome icon style */
  style: PropTypes.oneOf(['solid', 'regular', 'light', 'thin', 'duotone', 'brands']),
  /** Visual variant/color of the icon */
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
  /** Click handler - makes icon interactive */
  onClick: PropTypes.func,
  /** Disabled state */
  disabled: PropTypes.bool,
};

export default Icon;