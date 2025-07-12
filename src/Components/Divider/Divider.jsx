import PropTypes from "prop-types";
import React from "react";
import "./Divider.css";

export const Divider = ({ type, size, className = "" }) => {
  return <div className={`divider ${type} ${size} ${className}`} />;
};

Divider.propTypes = {
  type: PropTypes.oneOf(["vertical", "horizontal"]),
  size: PropTypes.oneOf(["large", "medium", "default"]),
  className: PropTypes.string,
};