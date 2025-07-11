import PropTypes from "prop-types";
import React from "react";
import { IconFree } from "./IconFree";
import "./MessageIcons.css";

export const MessageIcons = ({ notification }) => {
  return (
    <div className={`message-icons ${notification}`}>
      <div className="frame">
        <IconFree
          className="v6-icon-free"
          iconClassName="v-icon-free"
          iconName={
            notification === "info"
              ? "info"
              : notification === "success"
                ? "check"
                : notification === "warning"
                  ? "exclamation-triangle"
                  : "exclamation-circle"
          }
          padding="none"
          scale="five-x"
          style="solid"
        />
      </div>
    </div>
  );
};

MessageIcons.propTypes = {
  notification: PropTypes.oneOf(["success", "info", "warning", "error"]),
};