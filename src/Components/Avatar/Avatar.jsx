import React from "react";
import { Avatar as MuiAvatar, Box } from "@mui/material";
import Icon from '../Icon/Icon.jsx';
import { Badge } from '../Badge/Badge';  // ✅ Correct - named import

import "./Avatar.css";

/**
 * Avatar component with predefined size variants and badge support
 * 
 * @param {Object} props
 * @param {string} props.size - Size variant: 'xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - Additional CSS class
 * @param {React.ReactNode} props.children - Children elements (like initials)
 * @param {boolean} props.clickable - Whether the avatar is clickable
 * @param {boolean} props.disabled - Whether the avatar is disabled
 * @param {function} props.onClick - Click handler function
 * @param {Object} props.sx - Additional MUI styling
 * @param {boolean} props.showBadge - Whether to show a badge
 * @param {string} props.badgeType - Badge type: 'counter' or 'status'
 * @param {string} props.badgeState - Badge state: 'info', 'success', 'warning', 'error'
 * @param {string} props.badgeText - Text to display in counter badge
 * @param {string} props.badgePosition - Badge position: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
 */
const Avatar = ({ 
  size = 'm', 
  src, 
  alt = 'User avatar', 
  className = '',
  children,
  clickable = false,
  disabled = false,
  onClick,
  sx = {},
  showBadge = false,
  badgeType = 'counter',
  badgeState = 'info',
  badgeText = '1',
  badgePosition = 'top-right',
  ...props 
}) => {
  // Map size variants to CSS class names
  const sizeClass = `avatar-size-${size}`;
  const clickableClass = clickable ? 'avatar-clickable' : '';
  const disabledClass = disabled ? 'avatar-disabled' : '';
  
  // Combine all classes
  const combinedClassName = `custom-avatar ${sizeClass} ${clickableClass} ${disabledClass} ${className}`;
  
  // Handle click event only if clickable and not disabled
  const handleClick = (event) => {
    if (clickable && !disabled && onClick) {
      onClick(event);
    }
  };
  
  // Render the avatar with or without the clickable wrapper
  const avatarElement = (
    <MuiAvatar 
      src={src}
      alt={alt}
      className={combinedClassName}
      onClick={clickable ? handleClick : undefined}
      tabIndex={clickable && !disabled ? 0 : undefined}
      role={clickable ? "button" : undefined}
      aria-disabled={disabled}
      sx={sx}
      {...props}
    >
      {children || (src ? null : <Icon name="user" className="avatar-default-icon" />)}
    </MuiAvatar>
  );

  // Wrap with badge if needed
  const avatarWithBadge = showBadge ? (
    <div className={`avatar-with-badge badge-position-${badgePosition}`}>
      {avatarElement}
      <div className="badge-container">
        <Badge
          type={badgeType}
          state={badgeState}
          text={badgeType === 'counter' ? badgeText : undefined}
        />
      </div>
    </div>
  ) : avatarElement;
  
  // If clickable, wrap in a Box with minimum target area
  if (clickable) {
    return (
      <Box 
        className="avatar-clickable-wrapper"
        onClick={!disabled ? handleClick : undefined}
        role="button"
        tabIndex={!disabled ? 0 : undefined}
        aria-disabled={disabled}
      >
        {avatarWithBadge}
      </Box>
    );
  }
  
  // Otherwise, return the avatar (with or without badge)
  return avatarWithBadge;
};

export default Avatar;