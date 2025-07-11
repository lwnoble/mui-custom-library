import React from "react";
import PropTypes from "prop-types";
import Icon from "../Icon/Icon";
import Typography from "../Typography/Typography";
import "./Button.css";

/**
 * Button component with comprehensive variants, sizes, types, and states
 * Uses Icon and Typography components from the design system
 * 
 * @example
 * // Basic button
 * <Button>Click me</Button>
 * 
 * // With left icon
 * <Button leftIcon="search" variant="solid">Search</Button>
 * 
 * // Icon only button
 * <Button type="icon-only" leftIcon="user" />
 * 
 * // Text button with underline
 * <Button variant="text">Read more</Button>
 */
export const Button = ({
  children,
  variant = "solid",
  size = "standard",
  type = "text-only",
  leftIcon,
  rightIcon,
  disabled = false,
  className = "",
  onClick,
  ...props
}) => {
  
  // Build CSS classes
  const buttonClasses = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    `button--${type}`,
    disabled && "button--disabled",
    className
  ].filter(Boolean).join(" ");

  // Determine typography variant based on size
  const getTypographyVariant = () => {
    return size === "small" ? "button-small" : "button-standard";
  };

  // Determine icon size based on button size
  const getIconSize = () => {
    return size === "small" ? "xs" : "small";
  };

  // Handle button content based on type
  const renderContent = () => {
    switch (type) {
      case "icon-only":
        return (
          <Icon
            name={leftIcon || "user"}
            size={getIconSize()}
            className="button-icon"
          />
        );
        
      case "letter":
        return (
          <Typography
            variant={getTypographyVariant()}
            className="button-text"
          >
            {children?.toString().charAt(0).toUpperCase() || "A"}
          </Typography>
        );
        
      case "number":
        return (
          <Typography
            variant={getTypographyVariant()}
            className="button-text"
          >
            {children || "1"}
          </Typography>
        );
        
      default: // text-only, left-icon, right-icon
        return (
          <>
            {(type === "left-icon" && leftIcon) && (
              <div className="button-icon-left">
                <Icon
                  name={leftIcon}
                  size={getIconSize()}
                  className="button-icon"
                />
              </div>
            )}
            
            {children && (
              <Typography
                variant={getTypographyVariant()}
                className={`button-text ${variant === "text" ? "button-text--underlined" : ""}`}
              >
                {children}
              </Typography>
            )}
            
            {(type === "right-icon" && rightIcon) && (
              <div className="button-icon-right">
                <Icon
                  name={rightIcon}
                  size={getIconSize()}
                  className="button-icon"
                />
              </div>
            )}
          </>
        );
    }
  };

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      data-shadow-level-mode="l-1"
      {...props}
    >
      <div className="button-content">
        {renderContent()}
      </div>
    </button>
  );
};

Button.propTypes = {
  /** Button content/text */
  children: PropTypes.node,
  /** Visual variant */
  variant: PropTypes.oneOf(["solid", "outline", "text", "light"]),
  /** Button size */
  size: PropTypes.oneOf(["standard", "small"]),
  /** Button type/layout */
  type: PropTypes.oneOf(["text-only", "left-icon", "right-icon", "icon-only", "letter", "number"]),
  /** Left icon name (Font Awesome) */
  leftIcon: PropTypes.string,
  /** Right icon name (Font Awesome) */
  rightIcon: PropTypes.string,
  /** Whether button is disabled */
  disabled: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Click handler */
  onClick: PropTypes.func,
};

export default Button;