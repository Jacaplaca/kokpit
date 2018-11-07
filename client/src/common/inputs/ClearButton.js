import React from "react";
import IconButton from "@material-ui/core/IconButton";
import IconCancel from "@material-ui/icons/Clear";
import CircularProgress from "@material-ui/core/CircularProgress";

const ClearButton = props => {
  const { value, isloading, name, onChange } = props;
  if (value !== "" && isloading) {
    return <CircularProgress size={23} style={{ marginBottom: 10 }} />;
  } else if (value !== "" && !isloading) {
    return (
      <IconButton
        tabindex="-1"
        id={`${name}_clear`}
        onClick={() => onChange({ target: { name, value: "" } })}
      >
        <IconCancel />
      </IconButton>
    );
  } else {
    <div />;
  }
};

export default ClearButton;
