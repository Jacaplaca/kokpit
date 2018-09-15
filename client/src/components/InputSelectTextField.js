import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import IconCancel from "@material-ui/icons/Clear";

const InputSelectTextField = inputProps => {
  const {
    clearValue,
    error,
    classes,
    inputRef = () => {},
    ref,
    ...other
  } = inputProps;

  return (
    <TextField
      error={error ? true : false}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {inputProps.value !== "" ? (
              <IconButton onClick={() => clearValue()}>
                <IconCancel />
              </IconButton>
            ) : (
              <div />
            )}
          </InputAdornment>
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
