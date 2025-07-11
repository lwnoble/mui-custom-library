import PropTypes from "prop-types";
import React from "react";
import { Typography } from "../Typography";
import "./Badge.css";

export const Badge = ({ type, state, text = "1" }) => {
    return (
      <div
        className={`badge ${type} ${state}`}
      >
        {type === "counter" && (
          <Typography
            variant="legal-semibold"
            className="instance-node typography-instance"
          >
            {text}
          </Typography>
        )}
      </div>
    );
  };
  
  Badge.propTypes = {
    type: PropTypes.oneOf(["counter", "status"]),
    state: PropTypes.oneOf(["info", "success", "warning", "error"]),
    text: PropTypes.string,
  };