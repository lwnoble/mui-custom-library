import PropTypes from "prop-types";
import React from "react";
import Icon from "../Icon/Icon";
import "./Expand.css";

const Expand = ({ 
  state = "close", 
  className = "", 
  muiIconIconFreeIconClassName = "mui-icon-instance" 
}) => {
  return (
    <div className={`expand ${className}`}>
      <Icon
        className={`${state === "open" ? "class" : ""}`}
        name="chevron-right"
        size="small"
      />
    </div>
  );
};

Expand.propTypes = {
  state: PropTypes.oneOf(["open", "close"]),
  className: PropTypes.string,
  muiIconIconFreeIconClassName: PropTypes.string,
};

export default Expand;