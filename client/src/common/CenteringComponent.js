import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";

const CenteringComponent = ({ children, head }) => {
  return (
    <div
      style={{
        textAlign: "center",
        //padding: 20
        height: "100%",
        position: "relative",
        overflow: "auto"
      }}
    >
      <div
        style={{
          textAlign: "center",
          width: 500,

          margin: 0,
          position: "absolute",
          top: "40%",
          left: "50%",
          //-ms-transform: translate(-50%, -50%);
          transform: "translate(-40%, -50%)"
        }}
      >
        {head}
        <Paper style={{ padding: 30 }}>{children}</Paper>
      </div>
    </div>
  );
};

export default CenteringComponent;
