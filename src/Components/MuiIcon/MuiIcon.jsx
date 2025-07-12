/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { IconFree } from "../MessageIcons/IconFree";
import "./style.css";

export const MuiIcon = ({
  size,
  color,
  className,
  iconFreeIconClassName,
  iconFreeIconName = "xmark",
}) => {
  return (
    <div className={`mui-icon ${className}`}>
      <div className={`icon-holder ${size}`}>
        <IconFree
          className="v-icon-free"
          iconClassName={iconFreeIconClassName}
          iconName={iconFreeIconName}
          padding="none"
          scale="sm"
          style="solid"
        />
      </div>
    </div>
  );
};
