import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";

const CenteringComponent = ({ children }) => {
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
      <Paper
        style={{
          textAlign: "center",
          width: 500,
          padding: 30,
          margin: 0,
          position: "absolute",
          top: "40%",
          left: "50%",
          //-ms-transform: translate(-50%, -50%);
          transform: "translate(-40%, -50%)"
        }}
      >
        {children}
      </Paper>
    </div>
  );
};

export default CenteringComponent;
