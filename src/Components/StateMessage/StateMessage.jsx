import PropTypes from "prop-types";
import React from "react";
import { MessageIcons } from "../MessageIcons";
import Typography from "../Typography";
import "./StateMessage.css";

export const StateMessage = ({ withIcon = true, type, className = "" }) => {
  const getMessageText = () => {
    switch (type) {
      case "success":
        return "Success Message";
      case "warning":
        return "Warning Message";
      case "info":
        return "Informational Message";
      case "error":
        return "Error Message";
      default:
        return "Message";
    }
  };

  const getTextClassName = () => {
    switch (type) {
      case "success":
        return "success-text";
      case "warning":
        return "warning-text";
      case "info":
        return "info-text";
      case "error":
        return "error-text";
      default:
        return "";
    }
  };

  const getIconClassName = () => {
    switch (type) {
      case "warning":
        return "warning-icon";
      case "info":
        return "info-icon";
      case "error":
      case "success":
      default:
        return "icon";
    }
  };

  return (
    <div className={`state-message ${className}`}>
      {withIcon && (
        <MessageIcons
          notification={type}
          className={getIconClassName()}
        />
      )}

      <Typography
        variant="labels-extra-small"
        className={`typography-instance ${getTextClassName()}`}
      >
        {getMessageText()}
      </Typography>
    </div>
  );
};

StateMessage.propTypes = {
  withIcon: PropTypes.bool,
  type: PropTypes.oneOf(["warning", "success", "info", "error"]),
  className: PropTypes.string,
};