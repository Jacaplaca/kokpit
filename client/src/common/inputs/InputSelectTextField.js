import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import IconCancel from "@material-ui/icons/Clear";
import CircularProgress from "@material-ui/core/CircularProgress";

const InputSelectTextField = inputProps => {
  const {
    // disabled,
    clearValue,
    error,
    classes,
    inputRef = () => {},
    ref,
    isLoading,
    ...other
  } = inputProps;

  const clearButton = () => {
    if (inputProps.value !== "" && isLoading) {
      return (
        <CircularProgress size={23} color="red" style={{ marginBottom: 10 }} />
      );
    } else if (inputProps.value !== "" && !isLoading) {
      return (
        <IconButton onClick={() => clearValue()}>
          <IconCancel />
        </IconButton>
      );
    } else {
      <div />;
    }
  };

  return (
    <TextField
      // disabled={disabled ? true : false}
      error={error ? true : false}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">{clearButton()}</InputAdornment>
        ),
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        }
      }}
      {...other}
    />
  );
};

export default InputSelectTextField;
