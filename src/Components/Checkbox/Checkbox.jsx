import PropTypes from "prop-types";
import React from "react";
import Icon from "../Icon";
import "./Checkbox.css";

export const Checkbox = ({ state, size = "default", checked = false }) => {
  return (
    <div 
      className={`checkbox ${size}`}
      data-checked={checked}
      data-focus={state === "focus"}
    >
      <div className="holder">
        <div className="inner-checkbox" />

        <Icon
          className="mui-icon-instance"
          color="default"
          iconFreeIconClassName="design-component-instance-node"
          iconFreeIconName="check"
          size={size === "small" ? "extra-small" : "small"} // Adjust icon size based on checkbox size
        />
        <div className="focus-visible" />

        <div className="element-focus-visible" />
      </div>
    </div>
  );
};

Checkbox.propTypes = {
  state: PropTypes.oneOf(["focus"]),
  size: PropTypes.oneOf(["small", "default"]), // Now supports both sizes
  checked: PropTypes.bool,
};