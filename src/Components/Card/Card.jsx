// src/design-system/components/Card/Card.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

/**
 * Card component for the design system
 * Supports both static cards and clickable cards with proper states
 * Uses CSS custom properties for theming
 * 
 * @example
 * // Basic card
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 * 
 * // Clickable card
 * <Card clickable onClick={() => console.log('Card clicked')}>
 *   <h3>Clickable Card</h3>
 *   <p>This card is interactive</p>
 * </Card>
 * 
 * // Different variants
 * <Card variant="elevated">Elevated Card</Card>
 * <Card variant="outlined">Outlined Card</Card>
 * <Card variant="filled">Filled Card</Card>
 */
const Card = React.forwardRef(({
  children,
  variant = 'elevated',
  clickable = false,
  disabled = false,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  className = '',
  style = {},
  href,
  target,
  rel,
  role,
  tabIndex,
  ...props
}, ref) => {
  // Build class names
  const classNames = [
    'card',
    `card--${variant}`,
    clickable && 'card--clickable',
    disabled && 'card--disabled',
    className
  ].filter(Boolean).join(' ');

  // Handle click events
  const handleClick = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    if (onClick) {
      onClick(event);
    }
  };

  // Handle keyboard navigation for clickable cards
  const handleKeyDown = (event) => {
    if (disabled) {
      return;
    }
    
    // Handle Enter and Space keys for clickable cards
    if (clickable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      if (onClick) {
        onClick(event);
      }
    }
    
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  // Determine the appropriate element type
  const ElementType = href ? 'a' : clickable ? 'div' : 'div';

  // Set up props based on element type and clickable state
  const elementProps = {
    ref,
    className: classNames,
    style,
    'data-surface': 'container',
    ...props
  };

  // Add data-background attribute based on variant
  if (variant === 'elevated') {
    elementProps['data-background'] = 'container-high';
  }

  // Add interaction props for clickable cards
  if (clickable || href) {
    elementProps.onClick = handleClick;
    elementProps.onFocus = onFocus;
    elementProps.onBlur = onBlur;
    elementProps.onKeyDown = handleKeyDown;
    
    // Set appropriate ARIA attributes
    elementProps.role = role || (href ? undefined : 'button');
    elementProps.tabIndex = disabled ? -1 : (tabIndex !== undefined ? tabIndex : 0);
    elementProps['aria-disabled'] = disabled;
    
    // Add cursor pointer for non-disabled clickable cards
    if (!disabled) {
      elementProps.style = {
        cursor: 'pointer',
        ...elementProps.style
      };
    }
  }

  // Add link-specific props
  if (href) {
    elementProps.href = disabled ? undefined : href;
    elementProps.target = target;
    elementProps.rel = rel || (target === '_blank' ? 'noopener noreferrer' : undefined);
  }

  return (
    <ElementType {...elementProps} data-surface="container">
      <div className="card__content">
        {children}
      </div>
    </ElementType>
  );
});

Card.displayName = 'Card';

Card.propTypes = {
  /** Card content */
  children: PropTypes.node.isRequired,
  /** Visual variant of the card */
  variant: PropTypes.oneOf(['elevated', 'outlined', 'filled']),
  /** Whether the card is clickable/interactive */
  clickable: PropTypes.bool,
  /** Whether the card is disabled */
  disabled: PropTypes.bool,
  /** Click handler function */
  onClick: PropTypes.func,
  /** Focus handler function */
  onFocus: PropTypes.func,
  /** Blur handler function */
  onBlur: PropTypes.func,
  /** KeyDown handler function */
  onKeyDown: PropTypes.func,
  /** Additional CSS class names */
  className: PropTypes.string,
  /** Inline styles */
  style: PropTypes.object,
  /** URL for link cards */
  href: PropTypes.string,
  /** Link target */
  target: PropTypes.string,
  /** Link rel attribute */
  rel: PropTypes.string,
  /** ARIA role override */
  role: PropTypes.string,
  /** Tab index override */
  tabIndex: PropTypes.number,
};

export default Card;