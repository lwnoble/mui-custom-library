import PropTypes from "prop-types";
import React from "react";
import "./IconFree.css";

export const IconFree = ({ 
  className = "", 
  iconClassName = "", 
  iconName, 
  padding = "none", 
  scale = "one-x", 
  style = "solid" 
}) => {
  // Font Awesome style prefixes
  const styleMap = {
    solid: 'fas',
    regular: 'far', 
    light: 'fal',
    thin: 'fat',
    duotone: 'fad',
    brands: 'fab'
  };

  // Build the Font Awesome classes
  const iconClasses = [
    styleMap[style] || 'fas',
    `fa-${iconName}`,
    iconClassName
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'icon-free',
    `icon-free--padding-${padding}`,
    `icon-free--scale-${scale}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <i className={iconClasses}></i>
    </div>
  );
};

IconFree.propTypes = {
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  iconName: PropTypes.string.isRequired,
  padding: PropTypes.oneOf(["none", "small", "medium", "large"]),
  scale: PropTypes.oneOf(["one-x", "two-x", "three-x", "four-x", "five-x"]),
  style: PropTypes.oneOf(["solid", "regular", "light", "thin", "duotone", "brands"]),
};