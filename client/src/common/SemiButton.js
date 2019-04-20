import React from "react";

const one = "rgb(176, 203, 142)";
const two = "rgb(182, 182, 182)";

const color = what => {
  switch (what) {
    case "one":
      return one;
    case "two":
      return two;
    default:
  }
};

const SemiButton = ({ children, ver }) => (
  <div
    style={{
      backgroundColor: color(ver),
      padding: 3,
      // margin: 5,
      textAlign: "center",
      borderRadius: 4,
      display: "initial"
    }}
  >
    <span
      style={{
        // ...styleField.content,
        fontSize: 10.5,
        fontWeight: 700,
        color: "white",
        textAlign: "center",
        textTransform: "uppercase"
      }}
    >
      {children}
    </span>
  </div>
);

export default SemiButton;
