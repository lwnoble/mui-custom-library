import React from "react";
import { Divider } from "../Divider";
import Expand from "../Expand";
import Icon from "../Icon";
import Typography from "../Typography";
import Avatar from "../Avatar";
import Checkbox from "../Checkbox";
import "./MenuItem.css";

export const MenuItem = ({
  icon = true,
  checkbox = false,
  divider = true,
  avatar = false,
  expandible = true,
  state = "default",
  level = "one",
  alignment = "left",
  className = "",
  children,
  iconName = "home",
  expandibleState = "close",
  avatarSrc = "",
  avatarSize = "xs",
  checkboxChecked = false,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  "aria-current": ariaCurrent,
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
  ...props
}) => {
  // Determine if this MenuItem is interactive
  const isClickable = !!onClick;
  const isDisabled = state === "disabled";
  
  // Determine if icon should be decorative (when there's text content)
  const hasTextContent = !!children;
  const iconShouldBeDecorative = hasTextContent;

  // Handle keyboard events for accessibility
  const handleKeyDown = (event) => {
    if (isDisabled) return;

    // Handle custom onKeyDown first
    if (onKeyDown) {
      onKeyDown(event);
    }

    // Default keyboard handling for button-like behavior
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(event);
    }
  };

  // Handle click events
  const handleClick = (event) => {
    if (isDisabled) return;
    if (onClick) {
      onClick(event);
    }
  };

  // Build accessibility attributes
  const accessibilityProps = {
    // Only add button semantics if clickable and no custom role provided
    role: role || (isClickable ? "button" : undefined),
    
    // Make focusable if clickable and not disabled
    tabIndex: tabIndex !== undefined ? tabIndex : 
              (isClickable && !isDisabled ? 0 : undefined),
    
    // Event handlers
    onClick: isClickable ? handleClick : undefined,
    onKeyDown: (isClickable || onKeyDown) ? handleKeyDown : undefined,
    
    // ARIA attributes
    "aria-current": ariaCurrent,
    "aria-label": ariaLabel,
    "aria-expanded": ariaExpanded,
    "aria-disabled": isDisabled || undefined,
    
    // Cursor styling
    style: {
      cursor: isClickable && !isDisabled ? 'pointer' : 'default',
      ...props.style
    }
  };

  return (
    <div
      className={`menu-item ${state} ${level} ${alignment} ${isClickable ? 'menu-item--clickable' : ''} ${className}`}
      data-surface={
        level === "one" && state === "active" && alignment === "left"
          ? "surface"
          : state === "disabled" && alignment === "left"
            ? "surface-dim"
            : undefined
      }
      {...accessibilityProps}
      {...props}
    >
      <div className="list-holder">
        <div className="nav-content">
          {/* Expandible controls */}
          {expandible && (
            <>
              {((level === "one" && state === "default") ||
                (level === "one" && state === "focus") ||
                (level === "one" && state === "hover") ||
                level === "two" ||
                state === "focus-visible") && (
                <Expand
                  className="expand-instance"
                  muiIconIconFreeIconClassName={`${state === "disabled" ? "class" : "instance-node"}`}
                  state={expandibleState}
                  aria-hidden="true"
                />
              )}

              {level === "one" &&
                ["active", "disabled"].includes(state) && (
                  <Icon
                    className="mui-icon-instance"
                    color="default"
                    iconFreeIconClassName="instance-node"
                    iconFreeIconName="chevron-right"
                    size="small"
                    aria-hidden="true"
                  />
                )}
            </>
          )}
            
          {/* Checkbox */}
          {checkbox && (
            <Checkbox
              className="checkbox-instance"
              checked={checkboxChecked}
              size="standard"
              disabled={state === "disabled"}
            />
          )}

          {/* Avatar */}
          {avatar && (
            <Avatar
              className="avatar-instance"
              src={avatarSrc}
              size={avatarSize}
              alt="Menu avatar"
            />
          )}

        {/* Main icon - decorative when text is present, accessible when icon-only */}
        {icon && (
        <Icon
            className="mui-icon-instance"
            variant={["hover", "focus", "focus-visible", "active", "disabled"].includes(state) ? "default" : "quiet"}
            name={iconName}
            size="small"
            aria-hidden={iconShouldBeDecorative}
        />
        )}
          {/* Text content */}
          <div className="typography-wrapper">
            <Typography
              className={`${state === "default" ? "class-2" : "class-3"}`}
              variant="body-medium"
              element="span"
            >
              {children}
            </Typography>
          </div>
        </div>
      </div>

      {/* Divider */}
      {divider && (
        <Divider
          className="divider-instance"
          size="small"
          type="horizontal"
        />
      )}
    </div>
  );
};